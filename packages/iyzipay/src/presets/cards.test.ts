import { describe, it, expect } from 'vitest';
import { TestCards } from './cards';

describe('TestCards', () => {
  describe('Structure', () => {
    it('should contain expected categories', () => {
      expect(TestCards).toHaveProperty('Success');
      expect(TestCards).toHaveProperty('Foreign');
      expect(TestCards).toHaveProperty('Errors');
    });

    it('should have all cards strictly typed with required fields', () => {
      const allCards = [
        ...Object.values(TestCards.Success),
        ...Object.values(TestCards.Foreign),
        ...Object.values(TestCards.Errors),
      ];

      allCards.forEach((card) => {
        expect(card).toEqual(
          expect.objectContaining({
            cardHolderName: 'Sandbox Test User',
            expireMonth: '12',
            expireYear: '2030',
            registerCard: 0,
            cardNumber: expect.any(String),
            cvc: expect.any(String),
          })
        );
      });
    });
  });

  describe('Success Cards', () => {
    it('should have correct details for Akbank Debit', () => {
      expect(TestCards.Success.AkbankDebit).toMatchObject({
        cardNumber: '5890040000000016',
        cvc: '123',
      });
    });

    it('should have correct details for Garanti Amex (4-digit CVC)', () => {
      expect(TestCards.Success.GarantiAmex).toMatchObject({
        cardNumber: '374427000000003',
        cvc: '1234',
      });
    });

    it('should verify all success card numbers', () => {
      expect(TestCards.Success.AkbankCredit.cardNumber).toBe('5526080000000006');
      expect(TestCards.Success.DenizbankDebit.cardNumber).toBe('4766620000000001');
      expect(TestCards.Success.GarantiDebit.cardNumber).toBe('5170410000000004');
      expect(TestCards.Success.IsBankasiCredit.cardNumber).toBe('4543590000000006');
      expect(TestCards.Success.YapiKrediCredit.cardNumber).toBe('5451030000000000');
    });
  });

  describe('Foreign Cards', () => {
    it('should contain valid foreign card numbers', () => {
      expect(TestCards.Foreign.Credit.cardNumber).toBe('5400010000000004');
      expect(TestCards.Foreign.Debit.cardNumber).toBe('4054180000000007');
    });
  });

  describe('Error Cards', () => {
    it('should map specific error scenarios to correct card numbers', () => {
      const errorScenarios = [
        { card: TestCards.Errors.InsufficientFunds, expectedEnd: '29' },
        { card: TestCards.Errors.DoNotHonour, expectedEnd: '11' },
        { card: TestCards.Errors.StolenCard, expectedEnd: '14' },
        { card: TestCards.Errors.ExpiredCard, expectedEnd: '15' },
        { card: TestCards.Errors.InvalidTransaction, expectedEnd: '12' },
        { card: TestCards.Errors.FraudSuspect, expectedEnd: '19' },
      ];

      errorScenarios.forEach(({ card, expectedEnd }) => {
        expect(card.cardNumber.endsWith(expectedEnd)).toBe(true);
        expect(card.cardNumber).toHaveLength(16);
      });
    });

    it('should map 3D Secure specific error cards', () => {
      expect(TestCards.Errors.ThreeDSMdStatusZero.cardNumber).toBe('4131111111111117');
      expect(TestCards.Errors.ThreeDSMdStatusFour.cardNumber).toBe('4141111111111115');
      expect(TestCards.Errors.ThreeDSInitializeFailed.cardNumber).toBe('4151111111111112');
    });
  });
});