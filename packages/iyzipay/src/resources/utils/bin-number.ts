import { BinNumberSchema } from "../../schemas/bin-number";
import { IyzipayResult } from "../../types";
import { BinNumberRequest, BinNumberResponse } from "../../types/bin-number";
import { Locale } from "../../types/enums";
import { BaseResource } from "../base-resource";


/**
 * Resource for BIN (Bank Identification Number) operations.
 *
 * BIN check allows you to retrieve card information and available
 * installment options based on the first 6 digits of a card number.
 *
 * @example
 * ```typescript
 * const { data, error } = await iyzipay.binNumber.retrieve({
 *   binNumber: '552608',
 * });
 *
 * if (data) {
 *   console.log(data.cardType);      // CREDIT_CARD or DEBIT_CARD
 *   console.log(data.cardFamily);    // Bonus, Maximum, etc.
 *   console.log(data.bankName);      // Akbank, Garanti, etc.
 * }
 * ```
 */
export class BinNumberResource extends BaseResource {
	/**
	 * Retrieve card information by BIN number.
	 *
	 * Returns card type, bank information, and commercial status.
	 * Useful for displaying installment options before payment.
	 *
	 * @param request - BIN number check request (6 digits)
	 * @returns Promise resolving to card information
	 *
	 * @example
	 * ```typescript
	 * // Check Akbank Debit card
	 * const result = await iyzipay.binNumber.retrieve({
	 *   binNumber: '589004',
	 * });
	 *
	 * // Check with conversation ID for tracking
	 * const result2 = await iyzipay.binNumber.retrieve({
	 *   binNumber: '552608',
	 *   conversationId: 'ORDER-123',
	 * });
	 * ```
	 */
	async retrieve(
		request: Partial<BinNumberRequest>,
	): Promise<IyzipayResult<BinNumberResponse>> {
		const mergedRequest = {
			locale: Locale.TR,
			...request,
		} as any;

		try {
			const validatedRequest = BinNumberSchema.parse(mergedRequest);
			return this.client.post<BinNumberResponse>(
				"/payment/bin/check",
				validatedRequest,
			);
		} catch (err) {
			return { data: null, error: err as any };
		}
	}

	/**
	 * Helper to extract BIN number from full card number.
	 *
	 * @param cardNumber - Full card number (16-19 digits)
	 * @returns First 6 digits (BIN)
	 *
	 * @example
	 * ```typescript
	 * const bin = iyzipay.binNumber.extractBin('5528790000000008');
	 * // Returns: '552879'
	 * ```
	 */
	extractBin(cardNumber: string): string {
		return cardNumber.replace(/\s/g, "").substring(0, 6);
	}
}
