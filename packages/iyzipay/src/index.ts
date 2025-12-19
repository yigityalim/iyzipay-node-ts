import { Iyzipay } from "./core/iyzipay.js";
import type { IyzipayConfig } from "./types/index.js";

export * from "./core/iyzipay.js";
export * from "./core/iyzipay-error.js";
export { TestCards } from "./presets/cards.js";
export * from "./schemas/bin-number.js";
export * from "./schemas/checkout-form.js";
export * from "./schemas/index.js";
export * from "./schemas/threeds.js";
export * from "./types/bin-number.js";
export * from "./types/cancel.js";
export * from "./types/checkout-form.js";
export * from "./types/enums.js";
// --- Type Definitions ---
export * from "./types/index.js";
export * from "./types/installment.js";
export * from "./types/payment.js";
export * from "./types/pre-auth.js";
export * from "./types/refund.js";
export * from "./types/threeds.js";
export * from "./utils/builder.js";
// --- Utilities ---
export { Inputs } from "./utils/builder.js";
export { CryptoUtils } from "./utils/crypto-utils.js";
export * from "./utils/formatters.js";
export * from "./utils/formatters.js";
export { IdUtils } from "./utils/id-utils.js";
export * from "./utils/validators.js";
export * from "./utils/validators.js";
export * from "./utils/webhook.js";
export * from "./utils/webhook.js";

/**
 * Factory function to create a new Iyzipay client instance.
 * Preferred over `new Iyzipay(...)` for a functional programming style.
 *
 * @param config - Configuration options (apiKey, secretKey, baseUrl).
 * @returns An initialized `Iyzipay` client instance.
 *
 * @example
 * ```ts
 * const client = createClient({
 *   apiKey: '...',
 *   secretKey: '...',
 *   baseUrl: '...'
 * });
 *
 * const { data, error } = client.payment.create({ ... });
 * ```
 */
export const createClient = (config: IyzipayConfig): Iyzipay => {
	return new Iyzipay(config);
};

/**
 * Alias for `createClient`.
 * Useful for developers who prefer a shorter import name.
 *
 * @example
 * ```ts
 * import { iyzipay } from 'iyzipay-node-ts';
 * const client = iyzipay({ ... });
 *
 * const { data, error } = client.payment.create({ ... });
 * ```
 */
export const iyzipay = createClient;
