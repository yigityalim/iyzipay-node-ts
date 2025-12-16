import { HttpClient } from '../core/http-client.js';

/**
 * Abstract base class for all Iyzico API resources.
 * Provides shared access to the HTTP client for making requests.
 *
 * @abstract
 * @class
 */
export abstract class BaseResource {
  /**
   * @param client - The HTTP client instance used for API communication.
   */
  constructor(protected client: HttpClient) {}
}