import type { Currency, Locale, PaymentGroup } from "./enums.js";
import type { Address, BasketItem, Buyer } from "./payment.js";

/**
 * Request payload for initializing checkout form.
 *
 * Checkout Form is a hosted payment page provided by Iyzico.
 * Eliminates PCI compliance requirements.
 */
export interface CheckoutFormInitializeRequest {
	locale?: Locale;
	conversationId?: string;
	price: string;
	paidPrice: string;
	currency?: Currency;
	basketId: string;
	paymentGroup?: PaymentGroup;
	callbackUrl?: string;
	enabledInstallments?: number[];
	buyer: Buyer;
	shippingAddress: Address;
	billingAddress: Address;
	basketItems: BasketItem[];
}

/**
 * Response from checkout form initialization.
 *
 * Contains payment page URL and token.
 */
export interface CheckoutFormInitializeResponse {
	status: string;
	locale: string;
	systemTime: number;
	conversationId?: string;
	token?: string;
	checkoutFormContent?: string;
	tokenExpireTime?: number;
	paymentPageUrl?: string;
	errorCode?: string;
	errorMessage?: string;
	errorGroup?: string;
}

/**
 * Request payload for retrieving checkout form result.
 *
 * Called after user completes payment on hosted page.
 */
export interface CheckoutFormRetrieveRequest {
	locale?: Locale;
	conversationId?: string;
	token: string;
}

/**
 * Response from checkout form retrieval.
 *
 * Contains complete payment details.
 */
export interface CheckoutFormRetrieveResponse {
	status: string;
	locale: string;
	systemTime: number;
	conversationId?: string;
	token?: string;
	paymentId?: string;
	price?: string;
	paidPrice?: string;
	currency?: string;
	basketId?: string;
	installment?: number;
	paymentStatus?: string;
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
	errorCode?: string;
	errorMessage?: string;
	errorGroup?: string;
}
