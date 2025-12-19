import type { IyzipayResponse } from './index.js';

/**
 * Represents the response returned by Iyzico after a cancel request.
 */
export interface CancelResponse extends IyzipayResponse {
  paymentId?: string;
  price?: string;
  currency?: string;
}