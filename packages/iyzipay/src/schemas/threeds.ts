import { z } from 'zod';
import {
  AddressSchema,
  BasketItemSchema,
  BuyerSchema,
  PaymentCardSchema,
} from './payment.js';
import { Currency, Locale, PaymentChannel, PaymentGroup } from '../types/enums.js';

/**
 * Validation schema for 3D Secure initialization request.
 *
 * Extends standard payment schema with required callbackUrl.
 */
export const ThreedsInitializeSchema = z.object({
  locale: z.nativeEnum(Locale).optional(),
  conversationId: z.string().optional(),
  price: z.string(),
  paidPrice: z.string(),
  currency: z.nativeEnum(Currency).optional(),
  installment: z.string().optional(),
  basketId: z.string(),
  paymentChannel: z.nativeEnum(PaymentChannel).optional(),
  paymentGroup: z.nativeEnum(PaymentGroup).optional(),
  paymentCard: PaymentCardSchema,
  buyer: BuyerSchema,
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  basketItems: z.array(BasketItemSchema),
  callbackUrl: z.string().url(),
  paymentSource: z.string().optional(),
  posOrderId: z.string().optional(),
  connectorName: z.string().optional(),
});

/**
 * Validation schema for completing 3D Secure payment.
 *
 * Requires paymentId from 3DS callback.
 */
export const ThreedsCompleteSchema = z.object({
  locale: z.nativeEnum(Locale).optional(),
  conversationId: z.string().optional(),
  paymentId: z.string(),
  conversationData: z.string().optional(),
});
