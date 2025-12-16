import type { IyzipayResponse } from './index.js';

/**
 * Represents the response returned by Iyzico after a refund request.
 */
export interface RefundResponse extends IyzipayResponse {
  paymentId?: string;
  paymentTransactionId?: string;
  price?: string;
  currency?: string;
}