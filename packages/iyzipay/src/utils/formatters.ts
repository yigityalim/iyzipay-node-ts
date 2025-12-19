/**
 * Data Formatting Utilities
 *
 * Provides formatting functions for request data transformation,
 * ensuring data is in the correct format expected by Iyzico API.
 *
 * @module utils/formatters
 */

/**
 * Formats a price value to Iyzico's required string format.
 *
 * Iyzico API expects prices as strings with at least one decimal place.
 * This function ensures consistent formatting:
 * - Numbers are converted to strings
 * - Strings are validated and normalized
 * - Always includes at least one decimal place (e.g., "100.0")
 *
 * @example
 * ```typescript
 * formatPrice(100)        // "100.0"
 * formatPrice(100.5)      // "100.5"
 * formatPrice("100")      // "100.0"
 * formatPrice("100.50")   // "100.5"
 * formatPrice(100.123)    // "100.123"
 * ```
 *
 * @param price - The price value (number or string)
 * @returns Formatted price string
 * @throws {Error} If price is not a valid number
 */
export function formatPrice(price: number | string): string {
	if (typeof price !== "number" && typeof price !== "string") {
		throw new Error(
			`Invalid price type: expected number or string, got ${typeof price}`,
		);
	}

	const numPrice = typeof price === "string" ? parseFloat(price) : price;

	if (!Number.isFinite(numPrice) || Number.isNaN(numPrice)) {
		throw new Error(`Invalid price value: ${price}`);
	}

	const priceString = numPrice.toString();

	if (!priceString.includes(".")) {
		return `${priceString}.0`;
	}

	return priceString;
}

/**
 * Formats a Turkish identity number (TC Kimlik No).
 *
 * Validates and formats Turkish identity numbers to 11 digits.
 *
 * @example
 * ```typescript
 * formatIdentityNumber("12345678901")  // "12345678901"
 * formatIdentityNumber(12345678901)    // "12345678901"
 * ```
 *
 * @param identityNumber - The identity number (string or number)
 * @returns Formatted 11-digit identity number string
 * @throws {Error} If identity number is invalid
 */
export function formatIdentityNumber(identityNumber: string | number): string {
	const idString = String(identityNumber);

	if (!/^\d{11}$/.test(idString)) {
		throw new Error(
			`Invalid Turkish identity number: must be 11 digits, got ${idString}`,
		);
	}

	return idString;
}

/**
 * Formats a phone number to international format.
 *
 * Ensures phone numbers are in the format expected by Iyzico (+90XXXXXXXXXX).
 *
 * @example
 * ```typescript
 * formatPhoneNumber("5551234567")      // "+905551234567"
 * formatPhoneNumber("+905551234567")   // "+905551234567"
 * formatPhoneNumber("905551234567")    // "+905551234567"
 * ```
 *
 * @param phone - The phone number
 * @returns Formatted phone number with country code
 */
export function formatPhoneNumber(phone: string): string {
	let cleaned = phone.replace(/\s+/g, "");

	if (cleaned.startsWith("+90")) {
		return cleaned;
	}

	if (cleaned.startsWith("90")) {
		return `+${cleaned}`;
	}

	if (cleaned.startsWith("0")) {
		cleaned = cleaned.substring(1);
	}

	return `+90${cleaned}`;
}

/**
 * Formats a card number by removing spaces and dashes.
 *
 * @example
 * ```typescript
 * formatCardNumber("5528 7900 0000 0008")  // "5528790000000008"
 * formatCardNumber("5528-7900-0000-0008")  // "5528790000000008"
 * ```
 *
 * @param cardNumber - The card number with optional formatting
 * @returns Clean card number string (digits only)
 */
export function formatCardNumber(cardNumber: string): string {
	return cardNumber.replace(/[\s-]/g, "");
}

/**
 * Formats a date to Iyzico's expected format (YYYY-MM-DD HH:mm:ss).
 *
 * @example
 * ```typescript
 * formatDate(new Date('2024-01-15T10:30:00'))  // "2024-01-15 10:30:00"
 * ```
 *
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
