import { z } from 'zod';

// Alt bileşenler
export const AddressSchema = z.object({
  contactName: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
  address: z.string().min(1),
  zipCode: z.string().optional(),
});

export const BasketItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category1: z.string().min(1),
  category2: z.string().optional(),
  itemType: z.enum(['PHYSICAL', 'VIRTUAL']),
  price: z.string(), // Iyzico string fiyat ister ("10.5")
});

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
  // ... diğer opsiyonel alanlar eklenebilir
});

export const PaymentCardSchema = z.object({
  cardHolderName: z.string().min(1),
  cardNumber: z.string().min(13).max(19),
  expireMonth: z.string().length(2),
  expireYear: z.string().length(4),
  cvc: z.string().min(3).max(4),
  registerCard: z.union([z.literal(0), z.literal(1)]).optional(),
});

// Ana İstek Şeması
export const CreatePaymentSchema = z.object({
  locale: z.enum(['tr', 'en']).optional().default('tr'),
  conversationId: z.string().optional(),
  price: z.string(), // "100.50"
  paidPrice: z.string(),
  installment: z.number().int().min(1).default(1),
  paymentChannel: z
    .enum(['WEB', 'MOBILE', 'MOBILE_WEB', 'MOBILE_IOS', 'MOBILE_ANDROID'])
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

// TypeScript Tipini Zod'dan Türetme (Otomatik!)
export type CreatePaymentRequest = z.infer<typeof CreatePaymentSchema>;
