import { z } from "zod";
import { Currency, Locale, PaymentGroup } from "../types/enums.js";
import { AddressSchema, BasketItemSchema, BuyerSchema } from "./payment.js";

/**
 * Validation schema for checkout form initialization.
 */
export const CheckoutFormInitializeSchema = z.object({
	locale: z.nativeEnum(Locale).optional(),
	conversationId: z.string().optional(),
	price: z.string(),
	paidPrice: z.string(),
	currency: z.nativeEnum(Currency).optional(),
	basketId: z.string(),
	paymentGroup: z.nativeEnum(PaymentGroup).optional(),
	callbackUrl: z.string().url().optional(),
	enabledInstallments: z.array(z.number()).optional(),
	buyer: BuyerSchema,
	shippingAddress: AddressSchema,
	billingAddress: AddressSchema,
	basketItems: z.array(BasketItemSchema),
});

/**
 * Validation schema for checkout form retrieval.
 */
export const CheckoutFormRetrieveSchema = z.object({
	locale: z.nativeEnum(Locale).optional(),
	conversationId: z.string().optional(),
	token: z.string(),
});
