import { z } from "zod";
import {
	AddressSchema,
	BasketItemSchema,
	BuyerSchema,
	PaymentCardSchema,
} from "./index.js";
import { Currency, Locale, PaymentChannel, PaymentGroup } from "../types/enums.js";

/**
 * Schema for creating a pre-authorization payment.
 * Pre-auth reserves funds without capturing them immediately.
 */
export const CreatePreAuthSchema = z.object({
	locale: z.nativeEnum(Locale).optional(),
	conversationId: z.string().optional(),
	price: z.string(),
	paidPrice: z.string(),
	currency: z.nativeEnum(Currency).optional(),
	basketId: z.string(),
	paymentChannel: z.nativeEnum(PaymentChannel).optional(),
	paymentGroup: z.nativeEnum(PaymentGroup).optional(),
	paymentCard: PaymentCardSchema,
	buyer: BuyerSchema,
	shippingAddress: AddressSchema,
	billingAddress: AddressSchema,
	basketItems: z.array(BasketItemSchema),
	callbackUrl: z.string().url().optional(),
});

/**
 * Schema for completing (capturing) a pre-authorized payment.
 */
export const CompletePreAuthSchema = z.object({
	locale: z.nativeEnum(Locale).optional(),
	conversationId: z.string().optional(),
	paymentId: z.string(),
	paidPrice: z.string(),
	currency: z.nativeEnum(Currency).optional(),
	ip: z.string().ip().optional(),
});
