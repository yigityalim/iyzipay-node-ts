import type { z } from "zod";
import type { CreatePreAuthSchema, CompletePreAuthSchema } from "../schemas/pre-auth.js";

/**
 * Request for creating a pre-authorization payment.
 * Pre-auth reserves funds without capturing them.
 */
export type CreatePreAuthRequest = z.infer<typeof CreatePreAuthSchema>;

/**
 * Request for completing (capturing) a pre-authorized payment.
 */
export type CompletePreAuthRequest = z.infer<typeof CompletePreAuthSchema>;

/**
 * Response from pre-auth create operation.
 */
export interface PreAuthResponse {
	status: "success" | "failure";
	locale?: string;
	systemTime?: number;
	conversationId?: string;
	price?: string;
	paidPrice?: string;
	currency?: string;
	basketId?: string;
	paymentId?: string;
	fraudStatus?: number;
	merchantCommissionRate?: string;
	merchantCommissionRateAmount?: string;
	iyziCommissionRateAmount?: string;
	iyziCommissionFee?: string;
	cardType?: string;
	cardAssociation?: string;
	cardFamily?: string;
	binNumber?: string;
	lastFourDigits?: string;
	authCode?: string;
	phase?: string;
	hostReference?: string;
	itemTransactions?: Array<{
		itemId: string;
		paymentTransactionId: string;
		transactionStatus: number;
		price: string;
		paidPrice: string;
		merchantCommissionRate: string;
		merchantCommissionRateAmount: string;
		iyziCommissionRateAmount: string;
		iyziCommissionFee: string;
		blockageRate: string;
		blockageRateAmountMerchant: string;
		blockageRateAmountSubMerchant: string;
		blockageResolvedDate: string;
		subMerchantKey: string;
		subMerchantPrice: string;
		subMerchantPayoutRate: string;
		subMerchantPayoutAmount: string;
		merchantPayoutAmount: string;
		convertedPayout: {
			paidPrice: string;
			iyziCommissionRateAmount: string;
			iyziCommissionFee: string;
			blockageRateAmountMerchant: string;
			blockageRateAmountSubMerchant: string;
			subMerchantPayoutAmount: string;
			merchantPayoutAmount: string;
			iyziConversionRate: string;
			iyziConversionRateAmount: string;
			currency: string;
		};
	}>;
	errorCode?: string;
	errorMessage?: string;
	errorGroup?: string;
}

/**
 * Response from post-auth (complete) operation.
 * Uses the same structure as regular payment response.
 */
export type PostAuthResponse = PreAuthResponse;
