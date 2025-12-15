import { HttpClient } from '../core/http-client.js';

/**
 * Base resource class for all resources.
 *
 * @abstract
 * @class
 *
 * @property {HttpClient} client - The HTTP client to use for requests.
 */
export abstract class BaseResource {
  constructor(protected client: HttpClient) {}
}
