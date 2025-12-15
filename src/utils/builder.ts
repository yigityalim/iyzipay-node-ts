import { ItemType } from '../types/enums.js';
import type { Address, BasketItem, Buyer, PaymentCard } from '../types/payment.js';

// Kullanıcıdan sadece en gerekli alanları isteyen basitleştirilmiş arayüz
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

export const Inputs = {
  /**
   * Minimal bilgilerle geçerli bir Iyzico Alıcısı oluşturur.
   * IP, Tarih, Adres gibi bürokratik alanları varsayılanlarla doldurur.
   */
  buyer: (info: SimpleBuyer): Buyer => ({
    id: info.id,
    name: info.name,
    surname: info.surname,
    email: info.email,
    identityNumber: info.identityNumber,
    ip: info.ip || '85.34.78.112', // Varsayılan TR IP'si
    city: info.city || 'Istanbul',
    country: info.country || 'Turkey',
    registrationAddress: info.address || 'N/A',
    lastLoginDate: '2023-01-01 12:00:00',
    registrationDate: '2023-01-01 12:00:00',
    gsmNumber: '+905555555555',
    zipCode: '34732'
  }),

  /**
   * Fatura ve Kargo adresini hızlıca oluşturur.
   */
  address: (fullAddress: string, contactName: string): Address => ({
    contactName: contactName,
    city: 'Istanbul',
    country: 'Turkey',
    address: fullAddress,
    zipCode: '34732'
  }),

  /**
   * Kart oluşturur. Varsayılan olarak kartı kaydetmez (registerCard: 0).
   */
  card: (info: Pick<PaymentCard, 'cardHolderName' | 'cardNumber' | 'expireMonth' | 'expireYear' | 'cvc'>): PaymentCard => ({
    ...info,
    registerCard: 0
  }),

  /**
   * Sepet öğesi oluşturur.
   */
  basketItem: (name: string, price: string, category = 'General', itemType: ItemType = ItemType.PHYSICAL): BasketItem => ({
    id: 'BI' + Math.floor(Math.random() * 10000),
    name: name,
    category1: category,
    itemType: itemType,
    price: price
  })
};