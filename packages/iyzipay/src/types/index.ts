import type { ZodError } from 'zod';
import type { IyzipayError } from '../core/iyzipay-error.js';
import type { Buyer, Address, PaymentCard } from './payment.js';
import type { Currency, Locale } from './enums.js';

/**
 * Configuration options for the Iyzipay client.
 */
export interface IyzipayConfig {
  /** The API Key provided by Iyzico. */
  apiKey: string;
  /** The Secret Key provided by Iyzico. */
  secretKey: string;
  /** The base URL for the API (e.g., 'https://sandbox-api.iyzipay.com'). */
  baseUrl: string;
  /**
   * Global default values.
   * Data added here is automatically merged into every request.
   */
  defaults?: {
    locale?: Locale | string;
    currency?: Currency | string;
    /** Partial Buyer data to be merged (e.g., IP address). */
    buyer?: Partial<Buyer>;
    shippingAddress?: Address;
    billingAddress?: Address;
    /** Default card data (useful for testing). */
    paymentCard?: Partial<PaymentCard>;
  };
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Represents the result of an API operation.
 * It follows a "Result Pattern" to handle errors safely without try-catch blocks in user code.
 */
export type IyzipayResult<T> =
  | { data: T; error: null }
  | { data: null; error: IyzipayError | ZodError | Error };

/**
 * Standard response structure from Iyzico API.
 */
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