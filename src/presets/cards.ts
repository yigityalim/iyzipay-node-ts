import type { PaymentCard } from '../types/payment.js';

/**
 * Pre-defined test cards for Sandbox environment.
 * Includes success cards, foreign cards, and error-producing cards.
 */
export const TestCards = {
  /**
   * Cards that return a successful response.
   */
  Success: {
    /** Akbank | MasterCard | Debit */
    AkbankDebit: createCard('5890040000000016'),
    /** Akbank | MasterCard | Credit */
    AkbankCredit: createCard('5526080000000006'),
    /** Denizbank | Visa | Debit */
    DenizbankDebit: createCard('4766620000000001'),
    /** Garanti | MasterCard | Debit */
    GarantiDebit: createCard('5170410000000004'),
    /** Garanti | Amex | Credit */
    GarantiAmex: createCard('374427000000003', '1234'), // Amex 4 digit CVC
    /** IsBankasi | Visa | Credit */
    IsBankasiCredit: createCard('4543590000000006'),
    /** YapiKredi | MasterCard | Credit */
    YapiKrediCredit: createCard('5451030000000000'),
  },

  /**
   * Cards defined as Foreign (Non-Turkish).
   */
  Foreign: {
    Credit: createCard('5400010000000004'),
    Debit: createCard('4054180000000007'),
  },

  /**
   * Cards that simulate specific error scenarios.
   * Useful for testing error handling logic.
   */
  Errors: {
    /** Error: 10051 - Not sufficient funds */
    InsufficientFunds: createCard('4111111111111129'),
    /** Error: 10005 - Do not honour */
    DoNotHonour: createCard('4129111111111111'),
    /** Error: 10043 - Stolen card */
    StolenCard: createCard('4126111111111114'),
    /** Error: 10054 - Expired card */
    ExpiredCard: createCard('4125111111111115'),
    /** Error: 10012 - Invalid transaction */
    InvalidTransaction: createCard('4128111111111112'),
    /** Error: 10034 - Fraud suspect */
    FraudSuspect: createCard('4121111111111119'),
  },
};

/**
 * Helper to create a card object with default valid dates.
 */
function createCard(number: string, cvc = '123'): PaymentCard {
  return {
    cardHolderName: 'Sandbox Test User',
    cardNumber: number,
    expireMonth: '12',
    expireYear: '2030',
    cvc: cvc,
    registerCard: 0,
  };
}