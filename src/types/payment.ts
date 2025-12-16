import type { IyzipayResponse } from './index.js';

/**
 * Represents credit or debit card information.
 */
export interface PaymentCard {
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
  /** 0 to use without registering, 1 to register the card. */
  registerCard?: 0 | 1;
}

/**
 * Represents the buyer (customer) details.
 */
export interface Buyer {
  id: string;
  name: string;
  surname: string;
  gsmNumber?: string;
  email: string;
  identityNumber: string;
  lastLoginDate?: string;
  registrationDate?: string;
  registrationAddress: string;
  ip: string;
  city: string;
  country: string;
  zipCode?: string;
}

/**
 * Represents a physical address (Billing or Shipping).
 */
export interface Address {
  contactName: string;
  city: string;
  country: string;
  address: string;
  zipCode?: string;
}

/**
 * Represents an item in the shopping basket.
 */
export interface BasketItem {
  id: string;
  name: string;
  category1: string;
  category2?: string;
  itemType: 'PHYSICAL' | 'VIRTUAL';
  /** Price as a string (e.g., "10.00"). */
  price: string;
}

/**
 * Response returned after a Payment Creation request.
 */
export interface PaymentResponse extends IyzipayResponse {
  price?: string;
  paidPrice?: string;
  installment?: number;
  paymentId?: string;
  paymentStatus?: string;
  fraudStatus?: number;
  merchantCommissionRate?: number;
  merchantCommissionRateAmount?: number;
  iyziCommissionRateAmount?: number;
  iyziCommissionFee?: number;
  cardType?: string;
  cardAssociation?: string;
  cardFamily?: string;
  binNumber?: string;
  basketId?: string;
  currency?: string;
  itemTransactions?: any[];
  token?: string;
  callbackUrl?: string;
}