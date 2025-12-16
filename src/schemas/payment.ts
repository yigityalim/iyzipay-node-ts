import { z } from 'zod';

/**
 * Schema for Address validation.
 * Used for both Shipping and Billing addresses.
 */
export const AddressSchema = z.object({
  contactName: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  address: z.string().min(1),
  zipCode: z.string().optional(),
});

/**
 * Schema for individual Basket Items.
 */
export const BasketItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category1: z.string().min(1),
  category2: z.string().optional(),
  itemType: z.enum(['PHYSICAL', 'VIRTUAL']),
  /** Iyzico requires the price as a string (e.g., "10.50") */
  price: z.string(),
});

/**
 * Schema for Buyer information.
 */
export const BuyerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  surname: z.string().min(1),
  email: z.string().email(),
  identityNumber: z.string().min(1),
  registrationAddress: z.string().min(1),
  ip: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  zipCode: z.string().optional(),
  gsmNumber: z.string().optional(),
});

/**
 * Schema for Payment Card details.
 * No raw validation is done here beyond length/type checks.
 */
export const PaymentCardSchema = z.object({
  cardHolderName: z.string().min(1),
  cardNumber: z.string().min(13).max(19),
  expireMonth: z.string().length(2),
  expireYear: z.string().length(4),
  cvc: z.string().min(3).max(4),
  /** 0 = Do not register, 1 = Register card */
  registerCard: z.union([z.literal(0), z.literal(1)]).optional(),
});

/**
 * Main Schema for creating a payment request.
 */
export const CreatePaymentSchema = z.object({
  locale: z.enum(['tr', 'en']).optional().default('tr'),
  conversationId: z.string().optional(),
  price: z.string(),
  paidPrice: z.string().optional(), // Made optional to allow "Smart Merge" logic
  installment: z.number().int().min(1).default(1),
  paymentChannel: z
    .enum(['WEB', 'MOBILE', 'MOBILE_WEB', 'MOBILE_IOS', 'MOBILE_ANDROID', 'MOBILE_WINDOWS', 'MOBILE_TABLET', 'MOBILE_PHONE'])
    .optional()
    .default('WEB'),
  basketId: z.string().optional(),
  paymentGroup: z.enum(['PRODUCT', 'LISTING', 'SUBSCRIPTION']).optional().default('PRODUCT'),
  paymentCard: PaymentCardSchema,
  buyer: BuyerSchema,
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  basketItems: z.array(BasketItemSchema).min(1),
  currency: z.enum(['TRY', 'USD', 'EUR', 'GBP', 'IRR']).optional().default('TRY'),
});

/**
 * Inferred TypeScript Type from the Zod Schema.
 */
export type CreatePaymentRequest = z.infer<typeof CreatePaymentSchema>;