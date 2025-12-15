import type { ZodError } from 'zod';
import type { IyzipayError } from '../core/iyzipay-error.js';
import type { Buyer, Address, PaymentCard } from './payment.js';
import type { Currency, Locale } from './enums.js';

export interface IyzipayConfig {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
  /**
   * Global varsayılan değerler.
   * Buraya eklenen veriler, tüm isteklerde otomatik olarak kullanılır.
   */
  defaults?: {
    locale?: Locale | string;
    currency?: Currency | string;
    buyer?: Partial<Buyer>; // Partial: Tüm alanları girmek zorunda olmasın
    shippingAddress?: Address;
    billingAddress?: Address;
    paymentCard?: Partial<PaymentCard>;
  };
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type IyzipayResult<T> =
  | { data: T; error: null }
  | { data: null; error: IyzipayError | ZodError | Error };

export interface IyzipayResponse<T = unknown> {
  status: 'success' | 'failure';
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
  locale?: string;
  systemTime?: number;
  conversationId?: string;
  data?: T;
  [key: string]: unknown;
}
