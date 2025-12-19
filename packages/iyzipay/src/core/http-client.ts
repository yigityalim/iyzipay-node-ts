import type { IyzipayConfig, IyzipayResult } from "../types/index.js";
import { calculateHMAC, stringToBase64 } from "../utils/platform/crypto.js";
import { IyzipayError } from "./iyzipay-error.js";

/**
 * Modern HTTP client for Iyzico API.
 *
 * Features:
 * - Typed HTTP methods (get, post, put, delete)
 * - Automatic V2 authentication
 * - Better error handling
 * - Type inference
 */
export class HttpClient {
	constructor(public config: IyzipayConfig) {}

	/**
	 * Sends a GET request to the Iyzico API.
	 *
	 * @typeParam T - Expected response type
	 * @param path - API endpoint path
	 * @returns Promise resolving to typed result
	 */
	async get<T>(path: string): Promise<IyzipayResult<T>> {
		return this.request<T>("GET", path);
	}

	/**
	 * Sends a POST request to the Iyzico API.
	 *
	 * @typeParam T - Expected response type
	 * @param path - API endpoint path
	 * @param body - Request payload
	 * @returns Promise resolving to typed result
	 */
	async post<T>(
		path: string,
		body: Record<string, unknown> = {},
	): Promise<IyzipayResult<T>> {
		return this.request<T>("POST", path, body);
	}

	/**
	 * Sends a PUT request to the Iyzico API.
	 *
	 * @typeParam T - Expected response type
	 * @param path - API endpoint path
	 * @param body - Request payload
	 * @returns Promise resolving to typed result
	 */
	async put<T>(
		path: string,
		body: Record<string, unknown> = {},
	): Promise<IyzipayResult<T>> {
		return this.request<T>("PUT", path, body);
	}

	/**
	 * Sends a DELETE request to the Iyzico API.
	 *
	 * @typeParam T - Expected response type
	 * @param path - API endpoint path
	 * @param body - Request payload (optional)
	 * @returns Promise resolving to typed result
	 */
	async delete<T>(
		path: string,
		body: Record<string, unknown> = {},
	): Promise<IyzipayResult<T>> {
		return this.request<T>("DELETE", path, body);
	}

	/**
	 * Internal request handler.
	 *
	 * @typeParam T - Expected response type
	 * @param method - HTTP method
	 * @param path - API endpoint path
	 * @param body - Request payload
	 * @returns Promise resolving to typed result
	 */
	private async request<T>(
		method: "GET" | "POST" | "PUT" | "DELETE",
		path: string,
		body: Record<string, unknown> = {},
	): Promise<IyzipayResult<T>> {
		try {
			const url = `${this.config.baseUrl}${path}`;
			const randomString = Date.now().toString();
			const requestBodyString = method !== "GET" ? JSON.stringify(body) : "";

			const authorization = await this.generateAuthHeaderV2(
				path,
				randomString,
				requestBodyString,
			);

			const headers: Record<string, string> = {
				Accept: "application/json",
				"Content-Type": "application/json",
				"x-iyzi-rnd": randomString,
				"x-iyzi-client-version": "iyzipay-node-ts-0.1.0",
				Authorization: authorization,
			};

			const response = await fetch(url, {
				method,
				headers,
				body: method !== "GET" ? requestBodyString : undefined,
			});

			if (!response.ok) {
				const errorText = await response.text();
				return {
					data: null,
					error: new Error(`HTTP ${response.status}: ${errorText}`),
				};
			}

			const data = (await response.json()) as Record<string, unknown>;

			if (data.status === "failure") {
				return { data: null, error: new IyzipayError(data as never) };
			}

			return { data: data as T, error: null };
		} catch (err) {
			return {
				data: null,
				error: err instanceof Error ? err : new Error("Unknown Network Error"),
			};
		}
	}

	/**
	 * Generates V2 Authorization header (HMAC-SHA256).
	 *
	 * Format: `IYZWSv2 base64(apiKey:xxx&randomKey:xxx&signature:xxx)`
	 *
	 * @param path - Request path
	 * @param randomString - Unique random string
	 * @param bodyString - Stringified JSON body
	 * @returns Authorization header value
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
		].join("&");

		const token = stringToBase64(authParams);

		return `IYZWSv2 ${token}`;
	}
}
