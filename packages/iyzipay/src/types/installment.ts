import type { IyzipayResponse } from "./index.js";

export interface InstallmentDetail {
	binNumber: string;
	price: number;
	cardType: string;
	cardAssociation: string;
	cardFamilyName: string;
	force3ds: number;
	bankName: string;
	bankCode: number;
	forceCvc: number;
	commercial: number;
	installmentPrices: {
		installmentPrice: number;
		totalPrice: number;
		installmentNumber: number;
	}[];
}

export interface InstallmentInfoResponse extends IyzipayResponse {
	installmentDetails?: InstallmentDetail[];
}
