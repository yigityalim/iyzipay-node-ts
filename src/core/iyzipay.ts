import { HttpClient } from './http-client.js';
import { PaymentResource } from '../resources/payment.js';
import type { IyzipayConfig } from '../types/index.js';

export class Iyzipay {
  private httpClient: HttpClient;

  public payment: PaymentResource;

  constructor(config: IyzipayConfig) {
    this.httpClient = new HttpClient(config);

    this.payment = new PaymentResource(this.httpClient);
  }

  /**
   * Environment değişkenlerinden otomatik instance oluşturur.
   * Şunları arar: IYZIPAY_API_KEY, IYZIPAY_SECRET_KEY, IYZIPAY_BASE_URL
   */
  static fromEnv(): Iyzipay {
    // Node.js (process.env) veya Vite/Next.js (import.meta.env) desteği için kontrol
    const getEnv = (key: string) => {
        if (typeof process !== 'undefined' && process.env) return process.env[key];
        // @ts-ignore: Vite/Nextjs için
        if (typeof import.meta !== 'undefined' && import.meta.env) return import.meta.env[key];
        return undefined;
    };

    const apiKey = getEnv('IYZIPAY_API_KEY');
    const secretKey = getEnv('IYZIPAY_SECRET_KEY');
    const baseUrl = getEnv('IYZIPAY_BASE_URL') || 'https://api.iyzipay.com';

    if (!apiKey || !secretKey) {
      throw new Error('Iyzipay environment variables (IYZIPAY_API_KEY, IYZIPAY_SECRET_KEY) are missing.');
    }

    return new Iyzipay({ apiKey, secretKey, baseUrl });
  }
}
