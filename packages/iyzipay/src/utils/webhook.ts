import { calculateHMAC } from './platform/crypto.js';

export interface WebhookVerificationOptions {
  /** The secret key of your Iyzico merchant account. */
  secretKey: string;
  /** The raw body string received from the webhook request. */
  body: string;
  /** The value of the 'x-iyz-signature' header. */
  signature: string;
}

/**
 * Verifies the authenticity of an Iyzico webhook request.
 * It calculates the HMAC-SHA256 signature of the incoming body using your secret key
 * and compares it with the `x-iyz-signature` header provided by Iyzico.
 *
 * @param options - Configuration options containing the key, body, and signature.
 * @returns `true` if the signature is valid, `false` otherwise.
 */
export async function verifyWebhookSignature(
  options: WebhookVerificationOptions,
): Promise<boolean> {
  if (!options.signature || !options.body || !options.secretKey) {
    return false;
  }

  try {
    const expectedSignature = await calculateHMAC(options.secretKey, options.body);
    return expectedSignature === options.signature;
  } catch (error) {
    // In case of crypto failure, return false securely.
    return false;
  }
}