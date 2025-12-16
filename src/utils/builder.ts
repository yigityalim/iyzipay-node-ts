import { ItemType } from '../types/enums.js';
import type { Address, BasketItem, Buyer, PaymentCard } from '../types/payment.js';

/**
 * Simplified interface for creating a Buyer object.
 * Reduces the number of required fields by assuming defaults for less critical data.
 */
interface SimpleBuyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  identityNumber: string;
  ip?: string;
  city?: string;
  country?: string;
  address?: string;
}

/**
 * Helper utility to construct complex Iyzico objects with minimal input.
 * Automatically fills in bureaucratic fields like dates, IPs, and zip codes.
 */
export const Inputs = {
  /**
   * Creates a valid `Buyer` object with minimal required information.
   * Defaults:
   * - IP: '85.34.78.112' (Standard TR IP)
   * - City: 'Istanbul'
   * - Country: 'Turkey'
   * - Registration Dates: Fixed past date
   *
   * @param info - The essential buyer information.
   */
  buyer: (info: SimpleBuyer): Buyer => ({
    id: info.id,
    name: info.name,
    surname: info.surname,
    email: info.email,
    identityNumber: info.identityNumber,
    ip: info.ip || '85.34.78.112',
    city: info.city || 'Istanbul',
    country: info.country || 'Turkey',
    registrationAddress: info.address || 'N/A',
    lastLoginDate: '2023-01-01 12:00:00',
    registrationDate: '2023-01-01 12:00:00',
    gsmNumber: '+905555555555',
    zipCode: '34732',
  }),

  /**
   * quickly creates an `Address` object used for both shipping and billing.
   * Defaults to 'Istanbul, Turkey' and a standard zip code.
   *
   * @param fullAddress - The street address string.
   * @param contactName - The name of the contact person.
   */
  address: (fullAddress: string, contactName: string): Address => ({
    contactName: contactName,
    city: 'Istanbul',
    country: 'Turkey',
    address: fullAddress,
    zipCode: '34732',
  }),

  /**
   * Creates a `PaymentCard` object.
   * By default, `registerCard` is set to 0 (do not save card).
   *
   * @param info - The card details (number, holder, expiry, cvc).
   */
  card: (
    info: Pick<
      PaymentCard,
      'cardHolderName' | 'cardNumber' | 'expireMonth' | 'expireYear' | 'cvc'
    >,
  ): PaymentCard => ({
    ...info,
    registerCard: 0,
  }),

  /**
   * Creates a single `BasketItem`.
   * Generates a random ID for the item to ensure uniqueness in simple tests.
   *
   * @param name - The name of the product.
   * @param price - The price as a string (e.g., "10.00").
   * @param category - The product category (default: 'General').
   * @param itemType - The item type (default: 'PHYSICAL').
   */
  basketItem: (
    name: string,
    price: string,
    category = 'General',
    itemType: ItemType = ItemType.PHYSICAL,
  ): BasketItem => ({
    id: 'BI' + Math.floor(Math.random() * 10000),
    name: name,
    category1: category,
    itemType: itemType,
    price: price,
  }),
};