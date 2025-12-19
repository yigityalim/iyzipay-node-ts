/**
 * Universal Crypto Platform Layer
 *
 * Provides a pluggable, platform-agnostic cryptographic interface.
 * Automatically detects and uses the best available crypto implementation.
 *
 * **Supported Platforms:**
 * - Web Crypto API (Browsers, Cloudflare Workers, Vercel Edge)
 * - Node.js crypto (v14+)
 * - Expo Crypto (React Native with expo-crypto)
 * - Custom providers (bring your own)
 *
 * @module crypto
 */

/**
 * Crypto provider interface.
 * Implement this to add custom crypto support (e.g., React Native, Deno).
 */
export interface CryptoProvider {
	/** Provider name for debugging */
	readonly name: string;

	/** SHA-1 hash */
	sha1(data: string): Promise<string>;

	/** HMAC-SHA256 signature */
	hmacSha256(key: string, data: string): Promise<string>;

	/** Base64 encode */
	base64Encode(data: string): string;

	/** Base64 decode */
	base64Decode(data: string): string;

	/** Generate secure random bytes */
	randomBytes(length: number): Uint8Array;

	/** Generate secure random string */
	randomString(length: number): string;

	/** Timing safe comparison */
	timingSafeEqual(a: string, b: string): boolean;
}

/**
 * Web Crypto API provider (browsers, edge runtimes).
 */
class WebCryptoProvider implements CryptoProvider {
	readonly name = "WebCrypto";
	private crypto: Crypto;

	constructor(crypto: Crypto) {
		this.crypto = crypto;
	}

	async sha1(data: string): Promise<string> {
		const encoder = new TextEncoder();
		const buffer = await this.crypto.subtle.digest(
			"SHA-1",
			encoder.encode(data),
		);
		return this.arrayBufferToBase64(buffer);
	}

	async hmacSha256(key: string, data: string): Promise<string> {
		const encoder = new TextEncoder();
		const keyData = encoder.encode(key);
		const messageData = encoder.encode(data);

		const cryptoKey = await this.crypto.subtle.importKey(
			"raw",
			keyData,
			{ name: "HMAC", hash: "SHA-256" },
			false,
			["sign"],
		);

		const signature = await this.crypto.subtle.sign(
			"HMAC",
			cryptoKey,
			messageData,
		);
		return this.arrayBufferToHex(signature);
	}

	base64Encode(data: string): string {
		if (typeof btoa !== "undefined") {
			return btoa(data);
		}

		const encoder = new TextEncoder();
		const bytes = encoder.encode(data);
		return this.arrayBufferToBase64(bytes.buffer);
	}

	base64Decode(data: string): string {
		if (typeof atob !== "undefined") {
			return atob(data);
		}
		throw new Error("Base64 decode not available in this environment");
	}

	randomBytes(length: number): Uint8Array {
		const array = new Uint8Array(length);
		this.crypto.getRandomValues(array);
		return array;
	}

	private arrayBufferToBase64(buffer: ArrayBuffer): string {
		const bytes = new Uint8Array(buffer);
		let binary = "";
		for (let i = 0; i < bytes.length; i++) {
			binary += String.fromCharCode(bytes[i] || 0);
		}
		return typeof btoa !== "undefined"
			? btoa(binary)
			: this.base64EncodeBytes(bytes);
	}

	private arrayBufferToHex(buffer: ArrayBuffer): string {
		return Array.from(new Uint8Array(buffer))
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");
	}

	private base64EncodeBytes(bytes: Uint8Array): string {
		const chars =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		let result = "";
		let i = 0;

		while (i < bytes.length) {
			const a = bytes[i++];
			const b = i < bytes.length ? bytes[i++] : 0;
			const c = i < bytes.length ? bytes[i++] : 0;

			if (a === undefined || b === undefined || c === undefined) {
				throw new Error("Invalid byte array");
			}

			const bitmap = (a << 16) | (b << 8) | c;

			result += chars[(bitmap >> 18) & 63];
			result += chars[(bitmap >> 12) & 63];
			result += i > bytes.length + 1 ? "=" : chars[(bitmap >> 6) & 63];
			result += i > bytes.length ? "=" : chars[bitmap & 63];
		}

		return result;
	}

	timingSafeEqual(a: string, b: string): boolean {
		throw new Error("Timing safe equal not available in this environment");
	}

	randomString(length: number): string {
		const array = new Uint8Array(length);
		this.crypto.getRandomValues(array);
		return Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");
	}
}

/**
 * Node.js crypto provider.
 */
class NodeCryptoProvider implements CryptoProvider {
	readonly name = "NodeCrypto";
	private crypto: typeof import("node:crypto");

	constructor(crypto: typeof import("node:crypto")) {
		this.crypto = crypto;
	}

	async sha1(data: string): Promise<string> {
		return this.crypto.createHash("sha1").update(data, "utf8").digest("base64");
	}

	async hmacSha256(key: string, data: string): Promise<string> {
		return this.crypto
			.createHmac("sha256", key)
			.update(data, "utf8")
			.digest("hex");
	}

	base64Encode(data: string): string {
		return Buffer.from(data, "utf8").toString("base64");
	}

	base64Decode(data: string): string {
		return Buffer.from(data, "base64").toString("utf8");
	}

	randomBytes(length: number): Uint8Array {
		return new Uint8Array(this.crypto.randomBytes(length));
	}

	timingSafeEqual(a: string, b: string): boolean {
		return this.crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
	}

	randomString(length: number): string {
		const array = new Uint8Array(length);
		this.crypto.getRandomValues(array);
		return Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");
	}
}

/**
 * Expo Crypto provider (React Native with expo-crypto).
 *
 * @example
 * ```typescript
 * import * as ExpoCrypto from 'expo-crypto';
 * import { setCustomCryptoProvider, ExpoCryptoProvider } from 'iyzipay-node-ts';
 *
 * setCustomCryptoProvider(new ExpoCryptoProvider(ExpoCrypto));
 * ```
 */
export class ExpoCryptoProvider implements CryptoProvider {
	readonly name = "ExpoCrypto";
	private expo: any;

	constructor(expoCrypto: any) {
		this.expo = expoCrypto;
	}

	async sha1(data: string): Promise<string> {
		const hash = await this.expo.digestStringAsync(
			this.expo.CryptoDigestAlgorithm.SHA1,
			data,
			{ encoding: this.expo.CryptoEncoding.BASE64 },
		);
		return hash;
	}

	async hmacSha256(key: string, data: string): Promise<string> {
		throw new Error(
			"HMAC not natively supported in expo-crypto. Use Web Crypto polyfill.",
		);
	}

	base64Encode(data: string): string {
		if (typeof btoa !== "undefined") {
			return btoa(data);
		}
		throw new Error("Base64 encoding not available");
	}

	base64Decode(data: string): string {
		if (typeof atob !== "undefined") {
			return atob(data);
		}
		throw new Error("Base64 decoding not available");
	}

	randomBytes(length: number): Uint8Array {
		return this.expo.getRandomBytes(length);
	}

	timingSafeEqual(a: string, b: string): boolean {
		return this.expo.timingSafeEqual(Buffer.from(a), Buffer.from(b));
	}

	randomString(length: number): string {
		const array = new Uint8Array(length);
		this.expo.getRandomValues(array);
		return Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");
	}
}

let currentProvider: CryptoProvider | null = null;

/**
 * Get the current crypto provider.
 * Automatically detects and initializes the best available provider.
 *
 * **Detection Order:**
 * 1. Custom provider (if set via `setCustomCryptoProvider`)
 * 2. Web Crypto API (globalThis.crypto)
 * 3. Node.js crypto (dynamic import)
 *
 * @returns Active crypto provider
 * @throws Error if no crypto implementation is available
 *
 * @example
 * ```typescript
 * import { getCrypto } from './utils/platform/crypto.js';
 *
 * const crypto = await getCrypto();
 * const hash = await crypto.sha1('data');
 * ```
 */
export async function getCrypto(): Promise<CryptoProvider> {
	if (currentProvider) {
		return currentProvider;
	}

	if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
		currentProvider = new WebCryptoProvider(globalThis.crypto);
		return currentProvider;
	}

	try {
		const nodeCrypto = await import("node:crypto");
		currentProvider = new NodeCryptoProvider(nodeCrypto);
		return currentProvider;
	} catch {}

	throw new Error(
		"No crypto implementation available. " +
			"Please ensure you are running in a supported environment (Browser, Node.js, Edge Runtime) " +
			"or set a custom provider using setCustomCryptoProvider().",
	);
}

/**
 * Set a custom crypto provider.
 *
 * Use this to provide crypto for unsupported platforms (e.g., React Native).
 *
 * @param provider - Custom crypto provider
 *
 * @example
 * ```typescript
 * // React Native with expo-crypto
 * import * as ExpoCrypto from 'expo-crypto';
 * import { setCustomCryptoProvider, ExpoCryptoProvider } from 'iyzipay-node-ts';
 *
 * setCustomCryptoProvider(new ExpoCryptoProvider(ExpoCrypto));
 * ```
 *
 * @example
 * ```typescript
 * // Custom implementation
 * import { setCustomCryptoProvider, CryptoProvider } from 'iyzipay-node-ts';
 *
 * class MyCustomCrypto implements CryptoProvider {
 *   name = 'MyCustom';
 *   async sha1(data: string) { ... }
 *   async hmacSha256(key: string, data: string) { ... }
 *   base64Encode(data: string) { ... }
 *   base64Decode(data: string) { ... }
 *   randomBytes(length: number) { ... }
 * 	 timingSafeEqual(a: string, b: string): boolean;
 * 	 randomString(length: number): string;
 * }
 *
 * setCustomCryptoProvider(new MyCustomCrypto());
 * ```
 */
export function setCustomCryptoProvider(provider: CryptoProvider): void {
	currentProvider = provider;
}

/**
 * Reset crypto provider (for testing).
 * @internal
 */
export function resetCryptoProvider(): void {
	currentProvider = null;
}

// --- Public API (Convenience Functions) ---

/**
 * Compute SHA-1 hash.
 *
 * @param data - Data to hash
 * @returns Base64-encoded SHA-1 hash
 *
 * @example
 * ```typescript
 * const hash = await calculateSHA1('sensitive-data');
 * // Returns: "qUqP5cyxm6YcTAhz05Hph5gvu9M="
 * ```
 */
export async function calculateSHA1(data: string): Promise<string> {
	const crypto = await getCrypto();
	return crypto.sha1(data);
}

/**
 * Compute HMAC-SHA256 signature.
 *
 * @param key - Secret key
 * @param data - Data to sign
 * @returns Hex-encoded HMAC signature
 *
 * @example
 * ```typescript
 * const signature = await calculateHMAC('secret-key', 'message');
 * // Returns: "a1b2c3d4e5f6..."
 * ```
 */
export async function calculateHMAC(
	key: string,
	data: string,
): Promise<string> {
	const crypto = await getCrypto();
	return crypto.hmacSha256(key, data);
}

/**
 * Encode string to Base64 (synchronous).
 *
 * @param data - String to encode
 * @returns Base64-encoded string
 *
 * @example
 * ```typescript
 * const encoded = stringToBase64('Hello World');
 * // Returns: "SGVsbG8gV29ybGQ="
 * ```
 */
export function stringToBase64(data: string): string {
	if (typeof Buffer !== "undefined") {
		return Buffer.from(data, "utf8").toString("base64");
	}
	if (typeof btoa !== "undefined") {
		return btoa(data);
	}
	throw new Error("Base64 encoding not available in this environment");
}

/**
 * Decode Base64 string (synchronous).
 *
 * @param data - Base64 string
 * @returns Decoded string
 *
 * @example
 * ```typescript
 * const decoded = base64ToString('SGVsbG8gV29ybGQ=');
 * // Returns: "Hello World"
 * ```
 */
export function base64ToString(data: string): string {
	if (typeof Buffer !== "undefined") {
		return Buffer.from(data, "base64").toString("utf8");
	}
	if (typeof atob !== "undefined") {
		return atob(data);
	}
	throw new Error("Base64 decoding not available in this environment");
}

/**
 * Generate cryptographically secure random bytes.
 *
 * @param length - Number of bytes
 * @returns Random bytes
 *
 * @example
 * ```typescript
 * const { hex, base64, uint8array } = await generateRandomBytes(32);
 * console.log(hex) // e.g. "a1b2c3d4e5f6..."
 * console.log(base64) // e.g. "a1b2c3d4e5f6..."
 * console.log(uint8array) // e.g. Uint8Array(32)
 * ```
 */
export async function generateRandomBytes(length: number): Promise<{ hex: string; base64: string; uint8array: Uint8Array }> {
	const crypto = await getCrypto();
	return {
		hex: Array.from(crypto.randomBytes(length), b => b.toString(16).padStart(2, '0')).join(''),
		base64: Buffer.from(crypto.randomBytes(length)).toString('base64'),
		uint8array: crypto.randomBytes(length)
	}
}
