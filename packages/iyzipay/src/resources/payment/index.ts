import { CreatePaymentRequest, CreatePaymentSchema } from "../../schemas/payment.js";
import { Locale, Currency, PaymentChannel, PaymentGroup } from "../../types/enums.js";
import { IyzipayResult } from "../../types/index.js";
import { BaseResource } from "../base-resource.js";

/**
 * Payment Resource - Direct payment operations.
 *
 * Handles direct card payments without 3D Secure.
 * Use only for low-risk transactions or when 3DS is not required.
 *
 * @example
 * ```typescript
 * const { data, error } = await iyzipay.payment.create({
 *   price: '100.00',
 *   paidPrice: '100.00',
 *   basketId: 'BASKET123',
 *   paymentCard: TestCards.Success.MasterCard,
 *   buyer: Inputs.buyer({ ... }),
 *   shippingAddress: Inputs.address('...', '...'),
 *   billingAddress: Inputs.address('...', '...'),
 *   basketItems: [Inputs.basketItem('Product', '100.00', 'General')],
 * });
 * ```
 */
export class PaymentResource extends BaseResource {
    /**
     * Create a direct payment (non-3DS).
     *
     * @param request - Payment request
     * @returns Promise resolving to payment response
     */
    async create(
        request: Partial<CreatePaymentRequest>,
    ): Promise<IyzipayResult<PaymentResponse>> {
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
            const validatedRequest = CreatePaymentSchema.parse(mergedRequest);
            return this.client.post<PaymentResponse>("/payment/auth", validatedRequest);
        } catch (err) {
            return { data: null, error: err as any };
        }
    }
}
