import { TestCards } from '../presets/cards.js';
import { CreatePaymentSchema, type CreatePaymentRequest } from '../schemas/payment.js';
import { Currency, Locale, PaymentChannel, PaymentGroup } from '../types/enums.js';
import type { IyzipayResult } from '../types/index.js';
import { BaseResource } from './base-resource.js';
import type { PaymentResponse } from '../types/payment.js';
import { Inputs } from '../utils/builder.js';

/**
 * Resource for managing Payment operations.
 * Handles payment creation, retrieval, and test scenarios.
 */
export class PaymentResource extends BaseResource {
  
  /**
   * Creates a standard payment.
   * Performs client-side validation using Zod schemas before sending the request to Iyzico.
   *
   * @param request - The payment request payload.
   * @returns A promise resolving to the payment result.
   */
  async create(request: Partial<CreatePaymentRequest>): Promise<IyzipayResult<PaymentResponse>> {
    const defaults = this.client.config.defaults || {};
    
    // 1. Smart Merge
    // Combines defaults with the user request. 'as any' is used to allow dynamic
    // property assignment before final validation.
    const mergedRequest = {
      locale: Locale.TR,
      paymentChannel: PaymentChannel.WEB,
      paymentGroup: PaymentGroup.PRODUCT,
      ...defaults,
      ...request,
    } as any;

    // 2. Business Logic & Defaults
    // If 'paidPrice' is missing, default it to 'price'.
    if (!mergedRequest.paidPrice && mergedRequest.price) {
      mergedRequest.paidPrice = mergedRequest.price;
    }

    // Ensure a Basket ID exists
    if (!mergedRequest.basketId) {
      mergedRequest.basketId = 'B' + Date.now();
    }

    try {
      // 3. Validation
      // Validate the final request object against the Zod schema.
      const validatedRequest = CreatePaymentSchema.parse(mergedRequest);
      
      return this.client.request<PaymentResponse>('POST', '/payment/auth', validatedRequest);
    } catch (err) {
      return { data: null, error: err as any };
    }
  }

  /**
   * Retrieves the details of a specific payment.
   * Useful for verifying payment status after a callback or webhook event.
   *
   * @param paymentId - The unique ID of the payment transaction.
   * @param conversationId - (Optional) The conversation ID used in the initial request.
   * @returns A promise resolving to the payment details.
   */
  async retrieve(paymentId: string, conversationId?: string): Promise<IyzipayResult<PaymentResponse>> {
    return this.client.request<PaymentResponse>('POST', '/payment/detail', {
      paymentId,
      conversationId,
      locale: Locale.TR,
    });
  }

  /**
   * ⚡️ Developer Experience (DX) Helper: Creates a quick test payment in Sandbox.
   * Automatically populates valid dummy data for Buyer, Address, and Card, reducing boilerplate.
   *
   * @example
   * ```ts
   * const result = await iyzipay.payment.createQuickTest({
   * price: 100,
   * card: TestCards.Errors.InsufficientFunds // Simulate an error
   * });
   * ```
   *
   * @param options - Configuration for the test payment (price, currency, etc.).
   * @returns A promise resolving to the payment result.
   */
  async createQuickTest(options: {
    price: number;
    currency?: Currency;
    card?: import('../types/payment.js').PaymentCard;
    basketId?: string;
  }): Promise<IyzipayResult<PaymentResponse>> {
    const priceStr = options.price.toFixed(2);
    
    return this.create({
      price: priceStr,
      paidPrice: priceStr,
      currency: options.currency || Currency.TRY,
      basketId: options.basketId || `TEST-${Date.now()}`,
      paymentChannel: PaymentChannel.WEB,
      paymentGroup: PaymentGroup.PRODUCT,
      // Default to a working card if none is provided
      paymentCard: options.card || TestCards.Success.GarantiDebit, 
      buyer: Inputs.buyer({
        id: 'QUICK-TEST-USER',
        name: 'Sandbox',
        surname: 'Tester',
        email: 'test@iyzico.com',
        identityNumber: '11111111111'
      }),
      shippingAddress: Inputs.address('Nidakule Göztepe', 'Sandbox Tester'),
      billingAddress: Inputs.address('Nidakule Göztepe', 'Sandbox Tester'),
      basketItems: [
        Inputs.basketItem('Test Item', priceStr, 'General')
      ]
    });
  }
}