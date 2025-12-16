/**
 * Supported currencies for transactions.
 */
export enum Currency {
  TRY = 'TRY',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  IRR = 'IRR',
}

/**
 * Supported locales for error messages and payment pages.
 */
export enum Locale {
  TR = 'tr',
  EN = 'en',
}

/**
 * Payment groups for classifying the transaction.
 */
export enum PaymentGroup {
  PRODUCT = 'PRODUCT',
  LISTING = 'LISTING',
  SUBSCRIPTION = 'SUBSCRIPTION',
}

/**
 * Payment channels defining where the transaction originates.
 */
export enum PaymentChannel {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
  MOBILE_WEB = 'MOBILE_WEB',
  MOBILE_IOS = 'MOBILE_IOS',
  MOBILE_ANDROID = 'MOBILE_ANDROID',
  MOBILE_WINDOWS = 'MOBILE_WINDOWS',
  MOBILE_TABLET = 'MOBILE_TABLET',
  MOBILE_PHONE = 'MOBILE_PHONE',
}

/**
 * Types of items in the basket.
 */
export enum ItemType {
  PHYSICAL = 'PHYSICAL',
  VIRTUAL = 'VIRTUAL',
}

/**
 * Common Iyzico Error Codes.
 * @see https://docs.iyzico.com/ek-bilgiler/hata-kodlari
 */
export enum IyzipayErrorCode {
  SYSTEM_ERROR = '1',
  INVALID_REQUEST = '11',
  INVALID_CARD_NUMBER = '12',
  INVALID_EXPIRE_MONTH = '13',
  INVALID_EXPIRE_YEAR = '14',
  INVALID_CVC = '15',
  INVALID_CARD_HOLDER_NAME = '16',
  DO_NOT_HONOUR = '10005',
  INVALID_TRANSACTION = '10012',
  FRAUD_SUSPECT = '10034',
  NOT_SUFFICIENT_FUNDS = '10051',
  EXPIRED_CARD = '10054',
  STOLEN_CARD = '10043',
}