import { z } from 'zod';

/**
 * Schema for creating a Cancel (Void) request.
 * Cancellation voids the entire payment transaction.
 */
export const CreateCancelSchema = z.object({
  locale: z.enum(['tr', 'en']).optional().default('tr'),
  conversationId: z.string().optional(),
  /** The unique Payment ID returned from the initial payment creation. */
  paymentId: z.string().min(1),
  ip: z.string().optional().default('85.34.78.112'),
  reason: z.enum(['DOUBLE_PAYMENT', 'BUYER_REQUEST', 'FRAUD', 'OTHER']).optional(),
  description: z.string().optional(),
});

/**
 * Inferred TypeScript type for the Cancel request.
 */
export type CreateCancelRequest = z.infer<typeof CreateCancelSchema>;