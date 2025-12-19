import {
	ThreedsCompleteSchema,
	ThreedsInitializeSchema,
} from "../../schemas/threeds.js";
import {
	Currency,
	Locale,
	PaymentChannel,
	PaymentGroup,
} from "../../types/enums.js";
import type { IyzipayResult } from "../../types/index.js";
import type {
	ThreedsCompleteRequest,
	ThreedsCompleteResponse,
	ThreedsInitializeRequest,
	ThreedsInitializeResponse,
} from "../../types/threeds.js";
import { BaseResource } from "../base-resource.js";

/**
 * Resource for managing 3D Secure payment operations.
 *
 * 3D Secure adds an authentication layer for card payments,
 * required by law in Turkey and EU for most transactions.
 *
 * @example
 * ```typescript
 * const { data, error } = await iyzipay.threeds.initialize({
 *   price: '100.00',
 *   paidPrice: '100.00',
 *   callbackUrl: 'https://example.com/callback',
 *   // ... other payment fields
 * });
 *
 * if (data?.threeDSHtmlContent) {
 *   // Render HTML in browser for user authentication
 * }
 * ```
 */
export class ThreedsResource extends BaseResource {
	/**
	 * Initialize 3D Secure payment flow.
	 *
	 * Returns HTML content that must be rendered in the browser for
	 * user authentication. After authentication, user is redirected
	 * to callbackUrl with paymentId and conversationData.
	 *
	 * @param request - 3DS initialization request
	 * @returns Promise resolving to initialization response with HTML content
	 *
	 * @example
	 * ```typescript
	 * const result = await iyzipay.threeds.initialize({
	 *   price: '100.00',
	 *   paidPrice: '100.00',
	 *   basketId: 'BASKET123',
	 *   callbackUrl: 'https://example.com/payment/callback',
	 *   paymentCard: TestCards.Success.GarantiDebit,
	 *   buyer: Inputs.buyer({ ... }),
	 *   shippingAddress: Inputs.address('...', '...'),
	 *   billingAddress: Inputs.address('...', '...'),
	 *   basketItems: [Inputs.basketItem('...', '100.00', 'General')],
	 * });
	 *
	 * if (result.data?.threeDSHtmlContent) {
	 *   // Render in iframe or redirect
	 *   document.getElementById('3ds-frame').innerHTML = result.data.threeDSHtmlContent;
	 * }
	 * ```
	 */
	async initialize(
		request: Partial<ThreedsInitializeRequest>,
	): Promise<IyzipayResult<ThreedsInitializeResponse>> {
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
			const validatedRequest = ThreedsInitializeSchema.parse(mergedRequest);
			return this.client.post<ThreedsInitializeResponse>(
				"/payment/3dsecure/initialize",
				validatedRequest,
			);
		} catch (err) {
			return { data: null, error: err as any };
		}
	}

	/**
	 * Complete 3D Secure payment after user authentication.
	 *
	 * Called from callback URL after user completes 3DS verification.
	 * The paymentId and conversationData are received as query parameters
	 * or POST data from Iyzico.
	 *
	 * @param request - Completion request with paymentId from callback
	 * @returns Promise resolving to complete payment response
	 *
	 * @example
	 * ```typescript
	 * // In your callback route handler
	 * const paymentId = req.query.paymentId;
	 * const conversationData = req.query.conversationData;
	 *
	 * const result = await iyzipay.threeds.complete({
	 *   paymentId,
	 *   conversationData,
	 * });
	 *
	 * if (result.data?.status === 'success') {
	 *   // Payment successful
	 * }
	 * ```
	 */
	async complete(
		request: ThreedsCompleteRequest,
	): Promise<IyzipayResult<ThreedsCompleteResponse>> {
		try {
			const validatedRequest = ThreedsCompleteSchema.parse(request);
			return this.client.post<ThreedsCompleteResponse>(
				"/payment/3dsecure/auth",
				validatedRequest,
			);
		} catch (err) {
			return { data: null, error: err as any };
		}
	}
}
