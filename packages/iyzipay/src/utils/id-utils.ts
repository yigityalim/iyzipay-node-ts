/**
 * ID Generation Utilities for Iyzipay Integration
 *
 * Provides secure, collision-resistant ID generation for common use cases:
 * - Conversation IDs (tracking)
 * - Basket IDs (cart identification)
 * - Idempotency keys (prevent duplicate requests)
 * - Payment references (secure tokens)
 *
 * @example
 * ```typescript
 * import { IdUtils } from 'iyzipay-node-ts';
 *
 * // Generate conversation ID
 * const conversationId = IdUtils.generateConversationId();
 *
 * // Generate basket ID
 * const basketId = IdUtils.generateBasketId('user-123');
 *
 * // Generate idempotency key
 * const idempotencyKey = IdUtils.generateIdempotencyKey();
 *
 * // Hash payment reference
 * const ref = await IdUtils.hashPaymentReference('user-123', 'payment-456');
 * ```
 */

import { calculateHMAC, calculateSHA1, getCrypto } from "./platform/crypto.js";

/**
 * Generate a cryptographically secure random string.
 * Uses Web Crypto API for maximum security.
 */
function generateSecureRandom(length: number = 16): string {
	const array = new Uint8Array(length);

	if (typeof globalThis !== "undefined" && globalThis.crypto) {
		globalThis.crypto.getRandomValues(array);
	} else {
		// Fallback for older environments
		for (let i = 0; i < length; i++) {
			array[i] = Math.floor(Math.random() * 256);
		}
	}

	return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
		"",
	);
}

export const IdUtils = {
	/**
	 * Generate a unique conversation ID for request tracking.
	 *
	 * **Use case:** Track requests across Iyzico API calls.
	 * **Format:** `conv_<timestamp>_<random>`
	 *
	 * @param prefix - Optional prefix (default: 'conv')
	 * @returns Unique conversation ID
	 *
	 * @example
	 * ```typescript
	 * const conversationId = IdUtils.generateConversationId();
	 * // Returns: "conv_1703001234567_a1b2c3d4"
	 *
	 * // With custom prefix
	 * const orderId = IdUtils.generateConversationId('order');
	 * // Returns: "order_1703001234567_a1b2c3d4"
	 * ```
	 */
	generateConversationId(prefix: string = "conv"): string {
		const timestamp = Date.now();
		const random = generateSecureRandom(8);
		return `${prefix}_${timestamp}_${random}`;
	},

	/**
	 * Generate a unique basket ID for cart identification.
	 *
	 * **Use case:** Identify shopping carts in payment requests.
	 * **Format:** `basket_<userId>_<timestamp>_<random>`
	 *
	 * @param userId - Optional user identifier
	 * @returns Unique basket ID
	 *
	 * @example
	 * ```typescript
	 * const basketId = IdUtils.generateBasketId('user-123');
	 * // Returns: "basket_user-123_1703001234567_a1b2"
	 *
	 * // Anonymous basket
	 * const anonBasket = IdUtils.generateBasketId();
	 * // Returns: "basket_anon_1703001234567_a1b2"
	 * ```
	 */
	generateBasketId(userId?: string): string {
		const timestamp = Date.now();
		const random = generateSecureRandom(4);
		const userPart = userId || "anon";
		return `basket_${userPart}_${timestamp}_${random}`;
	},

	/**
	 * Generate an idempotency key to prevent duplicate requests.
	 *
	 * **Use case:** Ensure payment requests are processed only once.
	 * **Critical for:** Retry logic, network failures, double-clicks.
	 *
	 * @param context - Optional context (e.g., 'payment', 'refund')
	 * @returns Unique idempotency key
	 *
	 * @example
	 * ```typescript
	 * const key = IdUtils.generateIdempotencyKey('payment');
	 * // Returns: "idem_payment_1703001234567_a1b2c3d4e5f6"
	 *
	 * // Store this key and reuse for retries
	 * const result = await iyzipay.payment.create({
	 *   // ... payment data
	 *   conversationId: key, // Use as conversation ID
	 * });
	 * ```
	 */
	generateIdempotencyKey(context: string = "request"): string {
		const timestamp = Date.now();
		const random = generateSecureRandom(12);
		return `idem_${context}_${timestamp}_${random}`;
	},

	/**
	 * Hash a payment reference securely.
	 *
	 * **Use case:** Create secure, non-reversible payment tokens.
	 * **Never store:** Credit card numbers, CVV, passwords.
	 * **Safe to store:** Payment references, user+payment combinations.
	 *
	 * @param parts - Parts to combine and hash
	 * @returns Promise resolving to hashed reference
	 *
	 * @example
	 * ```typescript
	 * // Create payment reference
	 * const ref = await IdUtils.hashPaymentReference('user-123', 'payment-456');
	 * // Returns: "ref_a1b2c3d4e5f6..."
	 *
	 * // Store this in database as payment token
	 * await db.payments.create({
	 *   userId: 'user-123',
	 *   paymentId: 'payment-456',
	 *   reference: ref, // Safe to store
	 * });
	 * ```
	 */
	async hashPaymentReference(...parts: string[]): Promise<string> {
		const combined = parts.join("::");
		const hash = await calculateSHA1(combined);
		return `ref_${hash.substring(0, 16)}`;
	},

	/**
	 * Generate a server-side secret key.
	 *
	 * **Use case:** Generate API keys, webhook secrets, encryption keys.
	 * **Security:** 32-byte cryptographically secure random.
	 *
	 * @param format - Output format ('hex' or 'base64')
	 * @returns Secure random key
	 *
	 * @example
	 * ```typescript
	 * // Generate webhook secret (Next.js API route)
	 * export async function POST(req: Request) {
	 *   const secret = IdUtils.generateSecretKey();
	 *   // Store in environment: WEBHOOK_SECRET=abc123...
	 *
	 *   await db.webhookSecrets.create({
	 *     service: 'iyzipay',
	 *     secret: secret,
	 *   });
	 * }
	 * ```
	 */
	generateSecretKey(format: "hex" | "base64" = "hex"): string {
		const random = generateSecureRandom(32);

		if (format === "base64") {
			// Convert hex to base64
			const bytes = new Uint8Array(
				random.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)),
			);
			if (typeof Buffer !== "undefined") {
				return Buffer.from(bytes).toString("base64");
			}
			return btoa(String.fromCharCode(...bytes));
		}

		return random;
	},

	/**
	 * Create a signed nonce with timestamp (replay attack prevention).
	 *
	 * **Use case:** Prevent replay attacks on API requests.
	 * **How it works:** Combines nonce + timestamp, signs with secret.
	 *
	 * @param secret - Secret key for signing
	 * @param expiryMs - Validity period in milliseconds (default: 5 minutes)
	 * @returns Promise resolving to signed nonce object
	 *
	 * @example
	 * ```typescript
	 * // Client-side: Generate nonce
	 * const nonce = await IdUtils.createSignedNonce(process.env.API_SECRET!);
	 *
	 * // Send to API
	 * const response = await fetch('/api/payment', {
	 *   headers: {
	 *     'X-Nonce': nonce.nonce,
	 *     'X-Timestamp': nonce.timestamp.toString(),
	 *     'X-Signature': nonce.signature,
	 *   },
	 * });
	 *
	 * // Server-side: Verify nonce
	 * const isValid = await IdUtils.verifySignedNonce(
	 *   nonce.nonce,
	 *   nonce.timestamp,
	 *   nonce.signature,
	 *   process.env.API_SECRET!,
	 *   300000
	 * );
	 * ```
	 */
	async createSignedNonce(
		secret: string,
		expiryMs: number = 300000,
	): Promise<{
		nonce: string;
		timestamp: number;
		signature: string;
		expiresAt: number;
	}> {
		const nonce = generateSecureRandom(16);
		const timestamp = Date.now();
		const expiresAt = timestamp + expiryMs;

		const payload = `${nonce}:${timestamp}:${expiresAt}`;
		const signature = await calculateHMAC(secret, payload);

		return { nonce, timestamp, signature, expiresAt };
	},

	/**
	 * Verify a signed nonce (replay attack prevention).
	 *
	 * @param nonce - Nonce value
	 * @param timestamp - Request timestamp
	 * @param signature - HMAC signature
	 * @param secret - Secret key for verification
	 * @param maxAgeMs - Maximum age in milliseconds
	 * @returns Promise resolving to validity boolean
	 *
	 * @example
	 * ```typescript
	 * // API route handler
	 * export async function POST(req: Request) {
	 *   const nonce = req.headers.get('X-Nonce');
	 *   const timestamp = parseInt(req.headers.get('X-Timestamp')!);
	 *   const signature = req.headers.get('X-Signature');
	 *
	 *   const isValid = await IdUtils.verifySignedNonce(
	 *     nonce!,
	 *     timestamp,
	 *     signature!,
	 *     process.env.API_SECRET!,
	 *   );
	 *
	 *   if (!isValid) {
	 *     return new Response('Invalid or expired nonce', { status: 401 });
	 *   }
	 *
	 *   // Process request...
	 * }
	 * ```
	 */
	async verifySignedNonce(
		nonce: string,
		timestamp: number,
		signature: string,
		secret: string,
		maxAgeMs: number = 300000,
	): Promise<boolean> {
		const crypto = await getCrypto();
		const now = Date.now();
		const age = now - timestamp;

		if (age < 0 || age > maxAgeMs) {
			return false;
		}

		const expiresAt = timestamp + maxAgeMs;
		const payload = `${nonce}:${timestamp}:${expiresAt}`;
		const expectedSignature = await calculateHMAC(secret, payload);

		return crypto.timingSafeEqual(
			signature,
			expectedSignature,
		);
	},
} as const;
