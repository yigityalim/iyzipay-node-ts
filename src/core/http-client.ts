import type { HttpMethod, IyzipayConfig, IyzipayResult } from '../types/index.js';
import { calculateHMAC, stringToBase64 } from '../utils/platform/crypto.js';
import { IyzipayError } from './iyzipay-error.js';

/**
 * Handles low-level HTTP requests to the Iyzico API.
 * Manages V2 Authentication headers, request serialization, and error parsing.
 */
export class HttpClient {
  constructor(public config: IyzipayConfig) {}

  /**
   * Sends a generic HTTP request to the Iyzico API.
   *
   * @typeParam T - The expected return type of the request data.
   * @param method - HTTP method (GET, POST, etc.).
   * @param path - The API endpoint path (e.g., '/payment/auth').
   * @param body - The request payload (optional).
   * @returns A promise that resolves to an `IyzipayResult` containing either data or an error.
   */
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
        'x-iyzi-client-version': 'iyzipay-node-ts-0.1.0',
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

      return { data: data as T, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Unknown Network Error') };
    }
  }

  /**
   * Generates the Authorization header using Iyzico V2 (HMAC-SHA256) standard.
   * * Header Format: `IYZWSv2 apiKey:HMAC_SHA256(randomString + path + body)`
   * * @param path - The request path.
   * @param randomString - A unique random string (timestamp).
   * @param bodyString - The stringified JSON body.
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