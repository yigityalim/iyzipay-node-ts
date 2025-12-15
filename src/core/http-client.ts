import type { HttpMethod, IyzipayConfig, IyzipayResult } from '../types/index.js';
import { calculateHMAC, stringToBase64 } from '../utils/platform/crypto.js';
import { IyzipayError } from './iyzipay-error.js';

export class HttpClient {
  constructor(public config: IyzipayConfig) {}

  async request<T>(
    method: HttpMethod,
    path: string,
    body: Record<string, any> = {},
  ): Promise<IyzipayResult<T>> {
    try {
      const url = `${this.config.baseUrl}${path}`;
      const randomString = Date.now().toString();
      const requestBodyString = method !== 'GET' ? JSON.stringify(body) : '';

      const authorization = await this.generateAuthHeaderV2(path, randomString, requestBodyString);

      const headers: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-iyzi-rnd': randomString,
        'x-iyzi-client-version': 'iyzipay-node-ts-1.0.0',
        Authorization: authorization,
      };

      const response = await fetch(url, {
        method,
        headers,
        body: method !== 'GET' ? requestBodyString : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { data: null, error: new Error(`HTTP Error ${response.status}: ${errorText}`) };
      }

      const data = (await response.json()) as any;

      if (data.status === 'failure') {
        return { data: null, error: new IyzipayError(data) };
      }

      // BAŞARILI!
      return { data: data as T, error: null };
    } catch (err) {
      // Beklenmeyen ağ hataları vs.
      return { data: null, error: err instanceof Error ? err : new Error('Unknown Error') };
    }
  }

  /**
   * Iyzico V2 Authorization Header Oluşturucu
   * Format: IYZWSv2 apiKey:HMAC_SHA256(randomString + path + JSON.stringify(body))
   */
  private async generateAuthHeaderV2(
    path: string,
    randomString: string,
    bodyString: string,
  ): Promise<string> {
    const { apiKey, secretKey } = this.config;

    const payload = randomString + path + bodyString;

    const signature = await calculateHMAC(secretKey, payload);

    const authParams = [
      `apiKey:${apiKey}`,
      `randomKey:${randomString}`,
      `signature:${signature}`,
    ].join('&');

    const token = stringToBase64(authParams);

    return `IYZWSv2 ${token}`;
  }
}
