import { CreateRefundRequest, CreateRefundSchema } from "../../schemas";
import { IyzipayResult } from "../../types";
import { RefundResponse } from "../../types/refund";
import { BaseResource } from "../base-resource";

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
      return this.client.post<RefundResponse>('/payment/refund', validated);
    } catch (error) {
      return { data: null, error: error as any };
    }
  }
}
