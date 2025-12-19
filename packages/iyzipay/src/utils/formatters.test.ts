import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  formatIdentityNumber,
  formatPhoneNumber,
  formatCardNumber,
  formatDate,
} from './formatters';

describe('Data Formatting Utilities', () => {
  describe('formatPrice', () => {
    it('should format integer numbers with a decimal point', () => {
      expect(formatPrice(100)).toBe('100.0');
      expect(formatPrice(0)).toBe('0.0');
      expect(formatPrice(-50)).toBe('-50.0');
    });

    it('should format integer strings with a decimal point', () => {
      expect(formatPrice('100')).toBe('100.0');
      expect(formatPrice('0')).toBe('0.0');
      expect(formatPrice('-50')).toBe('-50.0');
    });

    it('should preserve existing decimal places for numbers', () => {
      expect(formatPrice(100.5)).toBe('100.5');
      expect(formatPrice(10.123)).toBe('10.123');
      expect(formatPrice(99.99)).toBe('99.99');
    });

    it('should normalize decimal strings', () => {
      expect(formatPrice('100.50')).toBe('100.5'); // Trailing zeros removed by parseFloat
      expect(formatPrice('10.123')).toBe('10.123');
    });

    it('should throw error for invalid types', () => {
      // @ts-expect-error: Testing runtime validation
      expect(() => formatPrice(null)).toThrow(/Invalid price type/);
      // @ts-expect-error: Testing runtime validation
      expect(() => formatPrice(undefined)).toThrow(/Invalid price type/);
      // @ts-expect-error: Testing runtime validation
      expect(() => formatPrice({})).toThrow(/Invalid price type/);
    });

    it('should throw error for invalid numeric values', () => {
      expect(() => formatPrice(NaN)).toThrow(/Invalid price value/);
      expect(() => formatPrice(Infinity)).toThrow(/Invalid price value/);
      expect(() => formatPrice('abc')).toThrow(/Invalid price value/);
    });
  });

  describe('formatIdentityNumber', () => {
    it('should return valid 11-digit identity numbers as is', () => {
      expect(formatIdentityNumber('12345678901')).toBe('12345678901');
      expect(formatIdentityNumber(12345678901)).toBe('12345678901');
    });

    it('should throw error for inputs shorter than 11 digits', () => {
      expect(() => formatIdentityNumber('1234567890')).toThrow(/Invalid Turkish identity number/);
      expect(() => formatIdentityNumber(123)).toThrow(/Invalid Turkish identity number/);
    });

    it('should throw error for inputs longer than 11 digits', () => {
      expect(() => formatIdentityNumber('123456789012')).toThrow(/Invalid Turkish identity number/);
    });

    it('should throw error for non-numeric characters', () => {
      expect(() => formatIdentityNumber('12345a78901')).toThrow(/Invalid Turkish identity number/);
    });
  });

  describe('formatPhoneNumber', () => {
    it('should handle numbers already in +90 format', () => {
      expect(formatPhoneNumber('+905551234567')).toBe('+905551234567');
    });

    it('should prepend + for numbers starting with 90', () => {
      expect(formatPhoneNumber('905551234567')).toBe('+905551234567');
    });

    it('should replace leading 0 with +90', () => {
      expect(formatPhoneNumber('05551234567')).toBe('+905551234567');
    });

    it('should prepend +90 for raw local numbers', () => {
      expect(formatPhoneNumber('5551234567')).toBe('+905551234567');
    });

    it('should remove whitespace', () => {
      expect(formatPhoneNumber('+90 555 123 45 67')).toBe('+905551234567');
      expect(formatPhoneNumber('0 555 123 45 67')).toBe('+905551234567');
    });
  });

  describe('formatCardNumber', () => {
    it('should remove spaces from card numbers', () => {
      expect(formatCardNumber('1234 5678 9012 3456')).toBe('1234567890123456');
    });

    it('should remove dashes from card numbers', () => {
      expect(formatCardNumber('1234-5678-9012-3456')).toBe('1234567890123456');
    });

    it('should handle mixed delimiters', () => {
      expect(formatCardNumber('1234-5678 9012-3456')).toBe('1234567890123456');
    });

    it('should return clean numbers unchanged', () => {
      expect(formatCardNumber('1234567890123456')).toBe('1234567890123456');
    });
  });

  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD HH:mm:ss', () => {
      // Create a fixed date: 2024-01-15 10:30:45
      const date = new Date(2024, 0, 15, 10, 30, 45);
      expect(formatDate(date)).toBe('2024-01-15 10:30:45');
    });

    it('should pad single digits with zeros', () => {
      // Create a date with single digits: 2024-02-05 09:05:05
      const date = new Date(2024, 1, 5, 9, 5, 5);
      expect(formatDate(date)).toBe('2024-02-05 09:05:05');
    });

    it('should handle end of year correctly', () => {
      const date = new Date(2023, 11, 31, 23, 59, 59);
      expect(formatDate(date)).toBe('2023-12-31 23:59:59');
    });
  });
});