import type { Locale } from "./enums.js";

/**
 * Request payload for BIN number check.
 *
 * BIN (Bank Identification Number) is the first 6 digits of a card number.
 * This endpoint returns card type, bank info, and available installments.
 */
export interface BinNumberRequest {
	locale?: Locale;
	conversationId?: string;
	binNumber: string;
}

/**
 * Response from BIN number check.
 *
 * Contains card information and available installment options.
 */
export interface BinNumberResponse {
	status: string;
	locale: string;
	systemTime: number;
	conversationId?: string;
	binNumber?: string;
	cardType?: string;
	cardAssociation?: string;
	cardFamily?: string;
	bankName?: string;
	bankCode?: number;
	commercial?: number;
	errorCode?: string;
	errorMessage?: string;
	errorGroup?: string;
}
