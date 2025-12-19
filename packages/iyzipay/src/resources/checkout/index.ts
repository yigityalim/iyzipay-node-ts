import {
	CheckoutFormInitializeSchema,
	CheckoutFormRetrieveSchema,
} from "../../schemas/checkout-form.js";
import type {
	CheckoutFormInitializeRequest,
	CheckoutFormInitializeResponse,
	CheckoutFormRetrieveRequest,
	CheckoutFormRetrieveResponse,
} from "../../types/checkout-form.js";
import { Currency, Locale, PaymentGroup } from "../../types/enums.js";
import type { IyzipayResult } from "../../types/index.js";
import { BaseResource } from "../base-resource.js";

/**
 * Resource for Checkout Form operations.
 *
 * Checkout Form is Iyzico's hosted payment page solution.
 * Eliminates PCI compliance requirements by handling card data on Iyzico's servers.
 *
 * @example
 * ```typescript
 * const { data, error } = await iyzipay.checkoutForm.initialize({
 *   price: '100.00',
 *   paidPrice: '100.00',
 *   basketId: 'BASKET123',
 *   buyer: Inputs.buyer({ ... }),
 *   // ... other fields
 * });
 *
 * if (data?.paymentPageUrl) {
 *   // Redirect user to payment page
 *   window.location.href = data.paymentPageUrl;
 * }
 * ```
 */
export class CheckoutFormResource extends BaseResource {
	/**
	 * Initialize checkout form and get payment page URL.
	 *
	 * Returns a hosted payment page URL where users can enter card details.
	 * After payment, user is redirected to callbackUrl with token parameter.
	 *
	 * @param request - Checkout form initialization request
	 * @returns Promise resolving to payment page URL and token
	 *
	 * @example
	 * ```typescript
	 * const result = await iyzipay.checkoutForm.initialize({
	 *   price: '100.00',
	 *   paidPrice: '100.00',
	 *   basketId: 'BASKET-' + Date.now(),
	 *   callbackUrl: 'https://example.com/payment/callback',
	 *   enabledInstallments: [1, 2, 3, 6, 9],
	 *   buyer: Inputs.buyer({
	 *     id: 'USER123',
	 *     name: 'John',
	 *     surname: 'Doe',
	 *     email: 'john@example.com',
	 *     identityNumber: '11111111111',
	 *   }),
	 *   shippingAddress: Inputs.address('Shipping Address', 'John Doe'),
	 *   billingAddress: Inputs.address('Billing Address', 'John Doe'),
	 *   basketItems: [
	 *     Inputs.basketItem('Product 1', '100.00', 'Electronics'),
	 *   ],
	 * });
	 *
	 * if (result.data?.paymentPageUrl) {
	 *   window.location.href = result.data.paymentPageUrl;
	 * }
	 * ```
	 */
	async initialize(
		request: Partial<CheckoutFormInitializeRequest>,
	): Promise<IyzipayResult<CheckoutFormInitializeResponse>> {
		const defaults = this.client.config.defaults || {};

		const mergedRequest = {
			locale: Locale.TR,
			currency: Currency.TRY,
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
			const validatedRequest =
				CheckoutFormInitializeSchema.parse(mergedRequest);
			return this.client.post<CheckoutFormInitializeResponse>(
				"/payment/iyzipos/checkoutform/initialize/auth/ecom",
				validatedRequest,
			);
		} catch (err) {
			return { data: null, error: err as any };
		}
	}

	/**
	 * Retrieve checkout form payment result.
	 *
	 * Called from callback URL after user completes payment.
	 * Token is received as query parameter from Iyzico.
	 *
	 * @param request - Retrieval request with token from callback
	 * @returns Promise resolving to payment details
	 *
	 * @example
	 * ```typescript
	 * // In your callback route handler
	 * const token = req.query.token;
	 *
	 * const result = await iyzipay.checkoutForm.retrieve({ token });
	 *
	 * if (result.data?.paymentStatus === 'SUCCESS') {
	 *   // Payment successful
	 *   await db.order.update({
	 *     where: { id: result.data.basketId },
	 *     data: { status: 'paid', paymentId: result.data.paymentId },
	 *   });
	 * }
	 * ```
	 */
	async retrieve(
		request: CheckoutFormRetrieveRequest,
	): Promise<IyzipayResult<CheckoutFormRetrieveResponse>> {
		try {
			const validatedRequest = CheckoutFormRetrieveSchema.parse(request);
			return this.client.post<CheckoutFormRetrieveResponse>(
				"/payment/iyzipos/checkoutform/auth/ecom/detail",
				validatedRequest,
			);
		} catch (err) {
			return { data: null, error: err as any };
		}
	}
}
