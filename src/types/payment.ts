import type { IyzipayResponse } from './index.js';

export interface PaymentCard {
  cardHolderName: string;
  cardNumber: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
  registerCard?: 0 | 1;
}

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

export interface Address {
  contactName: string;
  city: string;
  country: string;
  address: string;
  zipCode?: string;
}

export interface BasketItem {
  id: string;
  name: string;
  category1: string;
  category2?: string;
  itemType: 'PHYSICAL' | 'VIRTUAL';
  price: string;
}

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