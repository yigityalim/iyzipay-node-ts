import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  isValidTCKN,
  isValidLuhn,
  IyzipayValidators
} from './validators';

describe('Validation Utilities', () => {

  describe('isValidTCKN (Algorithm Checks)', () => {
    it('should validate a correct real TCKN', () => {
      // Örnek geçerli TCKN (Algoritma kurallarına uyan random bir değer)
      // 10000000146 -> Bu algoritmayı sağlar:
      // Tekler (1,3,5,7,9): 1+0+0+0+1 = 2
      // Çiftler (2,4,6,8): 0+0+0+0 = 0
      // 10. hane: (2*7 - 0) % 10 = 4 (Doğru)
      // İlk 10 toplam: 1+0+0+0+0+0+0+0+1+4 = 6
      // 11. hane: 6 % 10 = 6 (Doğru)
      expect(isValidTCKN('10000000146')).toBe(true);
    });

    it('should fail if length is not 11', () => {
      expect(isValidTCKN('123')).toBe(false);
      expect(isValidTCKN('123456789012')).toBe(false);
    });

    it('should fail if it starts with 0', () => {
      // Algoritmaya uysa bile TCKN 0 ile başlayamaz
      expect(isValidTCKN('01234567890')).toBe(false);
    });

    it('should fail if checksum (10th digit) is wrong', () => {
      // 10000000146 geçerliydi, 10. haneyi 5 yapalım
      expect(isValidTCKN('10000000156')).toBe(false);
    });

    it('should fail if checksum (11th digit) is wrong', () => {
      // 10000000146 geçerliydi, 11. haneyi 7 yapalım
      expect(isValidTCKN('10000000147')).toBe(false);
    });

    it('should fail on non-numeric characters', () => {
      expect(isValidTCKN('1000000014a')).toBe(false);
    });
  });

  describe('isValidLuhn (Credit Card Check)', () => {
    it('should validate a correct card number (Test Card)', () => {
      // Iyzico Sandbox Test Kartı: 5890040000000016
      expect(isValidLuhn('5890040000000016')).toBe(true);
    });

    it('should handle spaces and dashes gracefully', () => {
      expect(isValidLuhn('5890 0400 0000 0016')).toBe(true);
      expect(isValidLuhn('5890-0400-0000-0016')).toBe(true);
    });

    it('should fail on invalid checksum', () => {
      // Son haneyi değiştirelim: 6 -> 7
      expect(isValidLuhn('5890040000000017')).toBe(false);
    });

    it('should fail if input is too short', () => {
      expect(isValidLuhn('123')).toBe(false);
    });

    it('should fail on empty input', () => {
      expect(isValidLuhn('')).toBe(false);
    });
  });

  describe('Zod Schemas (IyzipayValidators)', () => {
    describe('tcKimlikNo', () => {
      it('should parse valid TCKN', () => {
        const result = IyzipayValidators.tcKimlikNo.safeParse('10000000146');
        expect(result.success).toBe(true);
      });

      it('should return error for invalid format', () => {
        const result = IyzipayValidators.tcKimlikNo.safeParse('123'); // Too short
        expect(result.success).toBe(false);
        if (!result.success) {
           expect(result.error.issues[0].message).toContain('must be exactly 11 digits');
        }
      });

      it('should return error for invalid checksum', () => {
        const result = IyzipayValidators.tcKimlikNo.safeParse('10000000156'); // Bad math
        expect(result.success).toBe(false);
        if (!result.success) {
           expect(result.error.issues[0].message).toContain('Invalid TCKN');
        }
      });
    });

    describe('creditCard', () => {
      it('should parse valid card number string', () => {
        const result = IyzipayValidators.creditCard.safeParse('5890040000000016');
        expect(result.success).toBe(true);
      });

      it('should return error for Luhn failure', () => {
        const result = IyzipayValidators.creditCard.safeParse('5890040000000017');
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('Luhn check failed');
        }
      });

      it('should return error for length bounds', () => {
        const shortRes = IyzipayValidators.creditCard.safeParse('12345');
        expect(shortRes.success).toBe(false);
        if (!shortRes.success) {
             expect(shortRes.error.issues[0].message).toContain('Card number too short');
        }
      });
    });

    describe('gsmNumber', () => {
      it('should validate correct formats (+90, 905, 5)', () => {
        // Regex: ^(\+?90)?5\d{9}$
        // Valid formats: +905551234567, 905551234567, 5551234567
        expect(IyzipayValidators.gsmNumber.safeParse('+905551234567').success).toBe(true);
        expect(IyzipayValidators.gsmNumber.safeParse('905551234567').success).toBe(true);
        expect(IyzipayValidators.gsmNumber.safeParse('5551234567').success).toBe(true);
      });

      it('should match regex logic provided in source', () => {
         // Source regex: ^(\+?90)?5\d{9}$
         // Valid: 5551234567
         // Valid: 905551234567
         // Valid: +905551234567
         
         expect(IyzipayValidators.gsmNumber.safeParse('5551234567').success).toBe(true);
         expect(IyzipayValidators.gsmNumber.safeParse('+905551234567').success).toBe(true);
      });

      it('should fail for non-Turkish formats', () => {
        expect(IyzipayValidators.gsmNumber.safeParse('15551234567').success).toBe(false);
      });

      it('should fail for invalid length', () => {
        expect(IyzipayValidators.gsmNumber.safeParse('555123').success).toBe(false);
      });
    });
  });
});