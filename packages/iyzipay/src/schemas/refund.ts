import { z } from 'zod';

/**
 * Schema for creating a Refund request.
 * Iyzico allows refunding specific transactions within a payment (Basket Items).
 */
export const CreateRefundSchema = z.object({
  locale: z.enum(['tr', 'en']).optional().default('tr'),
  conversationId: z.string().optional(),
  paymentTransactionId: z.string().min(1),
  price: z.string().min(1),
  ip: z.string().optional().default('85.34.78.112'),
  currency: z.enum(['TRY', 'USD', 'EUR', 'GBP', 'IRR']).optional().default('TRY'),
  reason: z.enum(['DOUBLE_PAYMENT', 'BUYER_REQUEST', 'FRAUD', 'OTHER']).optional(),
  description: z.string().optional(),
});

/**
 * Inferred TypeScript type for the Refund request.
 */
export type CreateRefundRequest = z.infer<typeof CreateRefundSchema>;