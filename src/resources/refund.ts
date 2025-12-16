import { BaseResource } from './base-resource.js';
import { CreateRefundSchema, type CreateRefundRequest } from '../schemas/refund.js';
import type { RefundResponse } from '../types/refund.js';
import type { IyzipayResult } from '../types/index.js';

/**
 * Resource for managing Refund operations.
 * Allows partial or full refunds based on specific transaction items.
 */
export class RefundResource extends BaseResource {
  /**
   * Initiates a refund for a specific payment transaction.
   * Unlike 'Cancel', which voids the entire payment, 'Refund' can return partial amounts
   * corresponding to specific basket items using `paymentTransactionId`.
   *
   * @param request - The refund request payload containing transaction ID and amount.
   * @returns A promise resolving to the refund result.
   */
  async create(request: CreateRefundRequest): Promise<IyzipayResult<RefundResponse>> {
    try {
      const validated = CreateRefundSchema.parse(request);
      return this.client.request<RefundResponse>('POST', '/payment/refund', validated);
    } catch (error) {
      return { data: null, error: error as any };
    }
  }
}