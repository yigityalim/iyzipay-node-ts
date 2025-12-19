import type { IyzipayConfig } from "../types/index.js";
import { HttpClient } from "./http-client.js";
import { InstallmentResource } from "../resources/utils/installments.js";
import { BinNumberResource } from "../resources/utils/bin-number.js";
import { PaymentResource } from "../resources/payment/index.js";
import { PreAuthResource } from "../resources/payment/pre-auth.js";
import { CheckoutFormResource } from "../resources/checkout/index.js";
import { ThreedsResource } from "../resources/threeds/index.js";
import { CancelResource } from "../resources/transaction/cancel.js";
import { RefundResource } from "../resources/transaction/refund.js";

/**
 * The main entry point for the Iyzipay SDK.
 * Initializes the client and exposes available resources (e.g., payment, refund).
 */
export class Iyzipay {
	private httpClient: HttpClient;

	/**
	 * Access to Payment-related operations (Create, Retrieve, etc.)
	 */
	public payment: PaymentResource;

	/**
	 * Access to Pre-Authorization payment operations.
	 */
	public preAuth: PreAuthResource;

	/**
	 * Access to Refund-related operations.
	 */
	public refund: RefundResource;

	/**
	 * Access to Cancellation (Void) operations.
	 */
	public cancel: CancelResource;

	/**
	 * Access to Installment operations.
	 */
	public installment: InstallmentResource;

	/**
	 * Access to 3D Secure payment operations.
	 */
	public threeds: ThreedsResource;

	/**
	 * Access to BIN number check operations.
	 */
	public binNumber: BinNumberResource;

	/**
	 * Access to Checkout Form operations.
	 */
	public checkoutForm: CheckoutFormResource;

	/**
	 * Creates a new Iyzipay client instance.
	 * @param config - Configuration object containing API keys and base URL.
	 */
	constructor(config: IyzipayConfig) {
		if (
			typeof window !== "undefined" &&
			typeof window.document !== "undefined" &&
			typeof process === "undefined"
		) {
			throw new Error(
				"🚨 SECURITY ALERT: iyzipay-node-ts is intended for SERVER-SIDE usage only. " +
					"Do NOT use your API keys in a browser environment (React, Vue, etc.) as it will expose your secrets to attackers.",
			);
		}

		const client = new HttpClient(config);
		this.httpClient = client;

		this.payment = new PaymentResource(client);
		this.preAuth = new PreAuthResource(client);
		this.refund = new RefundResource(client);
		this.cancel = new CancelResource(client);
		this.installment = new InstallmentResource(client);
		this.threeds = new ThreedsResource(client);
		this.binNumber = new BinNumberResource(client);
		this.checkoutForm = new CheckoutFormResource(client);
	}

	/**
	 * Creates an Iyzipay instance automatically from environment variables.
	 * * It looks for the following variables:
	 * - `IYZIPAY_API_KEY`
	 * - `IYZIPAY_SECRET_KEY`
	 * - `IYZIPAY_BASE_URL` (Optional, defaults to production API)
	 * * Supports both Node.js (`process.env`) and modern frameworks like Next.js/Vite (`import.meta.env`).
	 * * @throws Error if API key or Secret key is missing.
	 */
	static fromEnv(
		config?: Omit<IyzipayConfig, "apiKey" | "secretKey" | "baseUrl">,
	): Iyzipay {
		if (!process.env && !(import.meta as any).env) {
			throw new TypeError(
				"[Iyipay-node-ts] Unable to get environment variables, `process.env` or `import.meta.env` is undefined. If you are using Next.js/Vite, make sure to use the correct environment variables.",
			);
		}

		const getEnv = (key: string) => {
			if (typeof process !== "undefined" && process.env)
				return process.env[key];
			if (typeof import.meta !== "undefined" && (import.meta as any).env)
				return (import.meta as any).env[key];
			return undefined;
		};

		const apiKey = getEnv("IYZIPAY_API_KEY");
		const secretKey = getEnv("IYZIPAY_SECRET_KEY");
		const baseUrl = getEnv("IYZIPAY_BASE_URL") || "https://api.iyzipay.com";

		if (!apiKey || !secretKey) {
			throw new Error(
				"[Iyzipay-node-ts]: Iyzipay environment variables (IYZIPAY_API_KEY, IYZIPAY_SECRET_KEY) are missing.",
			);
		}

		return new Iyzipay({ apiKey, secretKey, baseUrl, ...config });
	}
}
