import { CreatePreAuthSchema, CompletePreAuthSchema } from "../../schemas/pre-auth.js";
import type {
	CreatePreAuthRequest,
	CompletePreAuthRequest,
	PreAuthResponse,
	PostAuthResponse,
} from "../../types/pre-auth.js";
import { Currency, Locale, PaymentChannel, PaymentGroup } from "../../types/enums.js";
import type { IyzipayResult } from "../../types/index.js";
import { BaseResource } from "../base-resource.js";

/**
 * Payment Pre-Authorization Resource.
 *
 * Pre-authorization allows you to reserve funds on a customer's card
 * without immediately capturing the payment. This is useful for:
 * - Hotel reservations
 * - Car rentals
 * - Pre-orders
 * - Any scenario where final amount may change
 *
 * @example
 * ```typescript
 * // Step 1: Create pre-auth (reserve funds)
 * const { data, error } = await iyzipay.preAuth.create({
 *   price: '100.00',
 *   paidPrice: '100.00',
 *   basketId: 'B123',
 *   paymentCard: TestCards.Success.MasterCard,
 *   buyer: Inputs.buyer({ ... }),
 *   shippingAddress: Inputs.address('...', '...'),
 *   billingAddress: Inputs.address('...', '...'),
 *   basketItems: [Inputs.basketItem('Product', '100.00', 'General')],
 * });
 *
 * // Step 2: Complete pre-auth (capture funds)
 * const result = await iyzipay.preAuth.complete({
 *   paymentId: data.paymentId,
 *   paidPrice: '100.00', // Can be less than pre-auth amount
 * });
 * ```
 */
export class PreAuthResource extends BaseResource {
	/**
	 * Create a pre-authorization payment.
	 * Reserves funds without capturing them.
	 *
	 * @param request - Pre-auth request
	 * @returns Promise resolving to pre-auth response
	 */
	async create(
		request: Partial<CreatePreAuthRequest>,
	): Promise<IyzipayResult<PreAuthResponse>> {
		const defaults = this.client.config.defaults || {};

		const mergedRequest = {
			locale: Locale.TR,
			currency: Currency.TRY,
			paymentChannel: PaymentChannel.WEB,
			paymentGroup: PaymentGroup.PRODUCT,
			...defaults,
			...request,
		} as any;

		if (!mergedRequest.paidPrice && mergedRequest.price) {
			mergedRequest.paidPrice = mergedRequest.price;
		}

		if (!mergedRequest.basketId) {
			mergedRequest.basketId = "B" + Date.now();
		}

		try {
			const validatedRequest = CreatePreAuthSchema.parse(mergedRequest);
			return this.client.post<PreAuthResponse>(
				"/payment/preauth",
				validatedRequest,
			);
		} catch (err) {
			return { data: null, error: err as any };
		}
	}

	/**
	 * Complete (capture) a pre-authorized payment.
	 * Can capture partial amount (less than pre-auth).
	 *
	 * @param request - Post-auth request
	 * @returns Promise resolving to payment response
	 */
	async complete(
		request: Partial<CompletePreAuthRequest>,
	): Promise<IyzipayResult<PostAuthResponse>> {
		const mergedRequest = {
			locale: Locale.TR,
			currency: Currency.TRY,
			...request,
		} as any;

		try {
			const validatedRequest = CompletePreAuthSchema.parse(mergedRequest);
			return this.client.post<PostAuthResponse>(
				"/payment/postauth",
				validatedRequest,
			);
		} catch (err) {
			return { data: null, error: err as any };
		}
	}
}
