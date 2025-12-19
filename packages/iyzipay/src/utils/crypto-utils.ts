/**
 * Crypto Utilities for Iyzipay Integration
 *
 * Provides secure cryptographic functions for developers integrating with Iyzipay.
 * These utilities ensure correct implementation of hashing and encoding operations.
 *
 * @example
 * ```typescript
 * import { CryptoUtils } from 'iyzipay-node-ts';
 *
 * // Hash sensitive data
 * const hash = await CryptoUtils.sha1('sensitive-data');
 *
 * // Create HMAC signature
 * const signature = await CryptoUtils.hmac('secret-key', 'data-to-sign');
 *
 * // Base64 encoding
 * const encoded = CryptoUtils.base64Encode('plain-text');
 * ```
 */

import {
	base64ToString,
	calculateHMAC,
	calculateSHA1,
	stringToBase64,
} from "./platform/crypto.js";

export const CryptoUtils = {
	/**
	 * Compute SHA-1 hash of input string.
	 *
	 * **Use case:** Hashing sensitive data before storage or transmission.
	 *
	 * @param input - String to hash
	 * @returns Promise resolving to Base64-encoded SHA-1 hash
	 *
	 * @example
	 * ```typescript
	 * const hash = await CryptoUtils.sha1('user@example.com');
	 * // Returns: "qUqP5cyxm6YcTAhz05Hph5gvu9M="
	 * ```
	 */
	sha1: calculateSHA1,

	/**
	 * Compute HMAC-SHA256 signature.
	 *
	 * **Use case:** Creating secure signatures for API requests or webhooks.
	 *
	 * @param key - Secret key for signing
	 * @param data - Data to sign
	 * @returns Promise resolving to hex-encoded HMAC signature
	 *
	 * @example
	 * ```typescript
	 * const signature = await CryptoUtils.hmac('my-secret', 'message');
	 * // Returns: "a1b2c3d4..."
	 * ```
	 */
	hmac: calculateHMAC,

	/**
	 * Encode string to Base64.
	 *
	 * **Use case:** Encoding data for transmission or storage.
	 *
	 * @param input - String to encode
	 * @returns Promise resolving to Base64-encoded string
	 *
	 * @example
	 * ```typescript
	 * const encoded = await CryptoUtils.base64Encode('Hello World');
	 * // Returns: "SGVsbG8gV29ybGQ="
	 * ```
	 */
	base64Encode: stringToBase64,

	/**
	 * Decode Base64 string.
	 *
	 * **Use case:** Decoding received data.
	 *
	 * @param input - Base64 string to decode
	 * @returns Promise resolving to decoded string
	 *
	 * @example
	 * ```typescript
	 * const decoded = await CryptoUtils.base64Decode('SGVsbG8gV29ybGQ=');
	 * // Returns: "Hello World"
	 * ```
	 */
	base64Decode: base64ToString,
} as const;
