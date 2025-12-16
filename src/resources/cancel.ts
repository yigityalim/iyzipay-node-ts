import { BaseResource } from './base-resource.js';
import { CreateCancelSchema, type CreateCancelRequest } from '../schemas/cancel.js';
import type { CancelResponse } from '../types/cancel.js';
import type { IyzipayResult } from '../types/index.js';

/**
 * Resource for managing Cancellation (Void) operations.
 */
export class CancelResource extends BaseResource {
  /**
   * Cancels (voids) an entire payment.
   * This operation is typically available before the end-of-day reconciliation.
   * Unlike 'Refund', it does not require a transaction ID, just the main Payment ID.
   *
   * @param request - The cancel request payload.
   * @returns A promise resolving to the cancel result.
   */
  async create(request: CreateCancelRequest): Promise<IyzipayResult<CancelResponse>> {
    try {
      const validated = CreateCancelSchema.parse(request);
      return this.client.request<CancelResponse>('POST', '/payment/cancel', validated);
    } catch (error) {
      return { data: null, error: error as any };
    }
  }
}