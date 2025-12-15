import { TestCards } from '../presets/cards.js';
import { CreatePaymentSchema, type CreatePaymentRequest } from '../schemas/payment.js';
import { Currency, Locale, PaymentChannel, PaymentGroup } from '../types/enums.js';
import type { IyzipayResult } from '../types/index.js';
import { BaseResource } from './base-resource.js';
import type { PaymentResponse } from '../types/payment.js';
import { Inputs } from '../utils/builder.js';

export class PaymentResource extends BaseResource {
  
  /**
   * Creates a standard payment.
   * Performs client-side validation using Zod schemas before sending the request.
   */
async create(request: Partial<CreatePaymentRequest>): Promise<IyzipayResult<PaymentResponse>> {
    const defaults = this.client.config.defaults || {};
    
    // 1. Akıllı Birleştirme (Smart Merge)
    // TypeScript'in "Partial" tipiyle kavga etmemesi için 'as any' kullanıyoruz.
    // Bu sayede olmayan property'leri (paidPrice gibi) dinamik olarak ekleyebiliriz.
    const mergedRequest = {
      locale: Locale.TR,
      paymentChannel: PaymentChannel.WEB,
      paymentGroup: PaymentGroup.PRODUCT,
      ...defaults,
      ...request,
    } as any;

    // 2. Özel Kurallar (Business Logic)
    // Eğer paidPrice yoksa, price ile aynı kabul et
    if (!mergedRequest.paidPrice && mergedRequest.price) {
      mergedRequest.paidPrice = mergedRequest.price;
    }

    // Sepet ID yoksa oluştur
    if (!mergedRequest.basketId) {
      mergedRequest.basketId = 'B' + Date.now();
    }

    try {
      // 3. Validation
      // Zod şeması mergedRequest'i (doldurulmuş haliyle) kontrol eder
      const validatedRequest = CreatePaymentSchema.parse(mergedRequest);
      
      return this.client.request<PaymentResponse>('POST', '/payment/auth', validatedRequest);
    } catch (err) {
      return { data: null, error: err as any };
    }
  }

  /**
   * Retrieves the details of a specific payment.
   * Useful for checking status after a callback or webhook.
   * * @param paymentId - The unique ID of the payment transaction.
   * @param conversationId - Optional conversation ID used in the initial request.
   */
  async retrieve(paymentId: string, conversationId?: string): Promise<IyzipayResult<PaymentResponse>> {
    return this.client.request<PaymentResponse>('POST', '/payment/detail', {
      paymentId,
      conversationId,
      locale: Locale.TR,
    });
  }

  /**
   * ⚡️ DX Booster: Creates a quick test payment in Sandbox.
   * Automatically fills in valid dummy data for Buyer, Address, and Card.
   * * @example
   * ```ts
   * const result = await iyzipay.payment.createQuickTest({
   * price: 100,
   * card: TestCards.Errors.InsufficientFunds // Test specific error
   * });
   * ```
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
      paymentCard: options.card || TestCards.Success.GarantiDebit, // Default to a working card
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