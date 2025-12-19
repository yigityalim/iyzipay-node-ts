import { z } from 'zod';

/**
 * Validates a Turkish Republic Identity Number (TCKN).
 * Applies the official algorithmic checks (mod 10 rules).
 *
 * @param value - The 11-digit identity string.
 * @returns True if valid, false otherwise.
 */
export function isValidTCKN(value: string): boolean {
  if (!/^[1-9][0-9]{10}$/.test(value)) return false;

  const digits: any[] = value.split('').map(Number);
  
  // Algorithm Steps:
  // 1. Sum of 1st, 3rd, 5th, 7th, 9th digits
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  
  // 2. Sum of 2nd, 4th, 6th, 8th digits
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
  
  // 3. 10th digit check
  const tenthDigit = (oddSum * 7 - evenSum) % 10;
  if (tenthDigit !== digits[9]) return false;

  // 4. 11th digit check
  const totalSum = digits.slice(0, 10).reduce((acc, curr) => acc + curr, 0);
  if (totalSum % 10 !== digits[10]) return false;

  return true;
}

/**
 * Validates a Credit Card number using the Luhn Algorithm.
 * This does NOT check if the card is active, only if the number format is mathematically valid.
 *
 * @param value - The card number string (can contain spaces).
 * @returns True if valid, false otherwise.
 */
export function isValidLuhn(value: string): boolean {
  const sanitized = value.replace(/\D/g, ''); // Remove spaces/dashes
  if (!sanitized || sanitized.length < 13) return false;

  let sum = 0;
  let shouldDouble = false;

  // Loop through values starting from the rightmost digit
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i));

    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

/**
 * Collection of Zod Schemas for common Turkish Fintech validations.
 * Can be used directly in your own Zod objects.
 */
export const IyzipayValidators = {
  /**
   * Schema for Turkish Republic Identity Number (TCKN).
   */
  tcKimlikNo: z.string()
    .length(11, 'TCKN must be exactly 11 digits')
    .refine(isValidTCKN, 'Invalid TCKN (Checksum failed)'),

  /**
   * Schema for Credit Card Number (Luhn Check).
   * Automatically strips spaces before validation.
   */
  creditCard: z.string()
    .min(13, 'Card number too short')
    .max(19, 'Card number too long')
    .refine(isValidLuhn, 'Invalid Credit Card Number (Luhn check failed)'),
    
  /**
   * Schema for Turkish GSM Numbers.
   * Expects format: +905xxxxxxxxx or 05xxxxxxxxx or 5xxxxxxxxx
   */
  gsmNumber: z.string()
    .regex(/^(\+?90)?5\d{9}$/, 'Invalid Turkish GSM number format'),
};