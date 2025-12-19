import type { Address, BasketItem, Buyer, PaymentCard } from './payment.js';
import type { Currency, Locale, PaymentChannel, PaymentGroup } from './enums.js';

/**
 * Request payload for initializing 3D Secure payment flow.
 *
 * Identical to standard payment request but requires callbackUrl.
 * After initialization, user must complete 3DS authentication in browser.
 */
export interface ThreedsInitializeRequest {
  locale?: Locale;
  conversationId?: string;
  price: string;
  paidPrice: string;
  currency?: Currency;
  installment?: string;
  basketId: string;
  paymentChannel?: PaymentChannel;
  paymentGroup?: PaymentGroup;
  paymentCard: PaymentCard;
  buyer: Buyer;
  shippingAddress: Address;
  billingAddress: Address;
  basketItems: BasketItem[];
  callbackUrl: string;
  paymentSource?: string;
  posOrderId?: string;
  connectorName?: string;
}

/**
 * Response from 3D Secure initialization.
 *
 * Contains HTML content that must be rendered for user authentication.
 */
export interface ThreedsInitializeResponse {
  status: string;
  locale: string;
  systemTime: number;
  conversationId?: string;
  threeDSHtmlContent?: string;
  paymentId?: string;
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
}

/**
 * Request payload for completing 3D Secure payment.
 *
 * Called after user completes 3DS authentication.
 * paymentId and conversationData are received from callback.
 */
export interface ThreedsCompleteRequest {
  locale?: Locale;
  conversationId?: string;
  paymentId: string;
  conversationData?: string;
}

/**
 * Response from completing 3D Secure payment.
 *
 * Contains full payment details if successful.
 */
export interface ThreedsCompleteResponse {
  status: string;
  locale: string;
  systemTime: number;
  conversationId?: string;
  paymentId?: string;
  price?: string;
  paidPrice?: string;
  currency?: string;
  basketId?: string;
  installment?: number;
  paymentStatus?: string;
  fraudStatus?: number;
  merchantCommissionRate?: string;
  merchantCommissionRateAmount?: string;
  iyziCommissionRateAmount?: string;
  iyziCommissionFee?: string;
  cardType?: string;
  cardAssociation?: string;
  cardFamily?: string;
  binNumber?: string;
  lastFourDigits?: string;
  authCode?: string;
  phase?: string;
  mdStatus?: number;
  errorCode?: string;
  errorMessage?: string;
  errorGroup?: string;
}
