import { HttpClient } from './http-client.js';
import { PaymentResource } from '../resources/payment.js';
import type { IyzipayConfig } from '../types/index.js';
import { RefundResource } from '../resources/refund.js';
import { CancelResource } from '../resources/cancel.js';

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
   * Access to Refund-related operations.
   */
  public refund: RefundResource;

  /**
   * Access to Cancellation (Void) operations.
   */
  public cancel: CancelResource;

  /**
   * Creates a new Iyzipay client instance.
   * @param config - Configuration object containing API keys and base URL.
   */
  constructor(config: IyzipayConfig) {
    if (
      typeof window !== 'undefined' &&
      typeof window.document !== 'undefined' &&
      typeof process === 'undefined'
    ) {
      throw new Error(
        '🚨 SECURITY ALERT: iyzipay-node-ts is intended for SERVER-SIDE usage only. ' +
        'Do NOT use your API keys in a browser environment (React, Vue, etc.) as it will expose your secrets to attackers.'
      );
    }
    
    this.httpClient = new HttpClient(config);
    this.payment = new PaymentResource(this.httpClient);
    this.refund = new RefundResource(this.httpClient);
    this.cancel = new CancelResource(this.httpClient);
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
  static fromEnv(config?: Omit<IyzipayConfig, 'apiKey' | 'secretKey' | 'baseUrl'>): Iyzipay {
    if (!process.env && !(import.meta as any).env) {
      throw new TypeError(
        '[Iyipay-node-ts] Unable to get environment variables, `process.env` or `import.meta.env` is undefined. If you are using Next.js/Vite, make sure to use the correct environment variables.'
      )
    }

    const getEnv = (key: string) => {
        if (typeof process !== 'undefined' && process.env) return process.env[key];
        // @ts-ignore: Handles Vite/Next.js edge environments
        if (typeof import.meta !== 'undefined' && (import.meta as any).env) return (import.meta as any).env[key];
        return undefined;
    };

    const apiKey = getEnv('IYZIPAY_API_KEY');
    const secretKey = getEnv('IYZIPAY_SECRET_KEY');
    const baseUrl = getEnv('IYZIPAY_BASE_URL') || 'https://api.iyzipay.com';

    if (!apiKey || !secretKey) {
      throw new Error('[Iyzipay-node-ts]: Iyzipay environment variables (IYZIPAY_API_KEY, IYZIPAY_SECRET_KEY) are missing.');
    }

    return new Iyzipay({ apiKey, secretKey, baseUrl, ...config });
  }
}