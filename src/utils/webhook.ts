import { calculateHMAC } from './platform/crypto.js';

export interface WebhookVerificationOptions {
  /** The secret key of your Iyzico merchant account */
  secretKey: string;
  /** The raw body string received from the webhook request */
  body: string;
  /** The value of the 'x-iyz-signature' header */
  signature: string;
}

/**
 * Verifies the authenticity of an Iyzico webhook request.
 * It calculates the HMAC-SHA256 signature of the body and compares it with the header.
 * * @param options - Verification options
 * @returns True if signature is valid, false otherwise.
 */
export async function verifyWebhookSignature(
  options: WebhookVerificationOptions
): Promise<boolean> {
  if (!options.signature || !options.body || !options.secretKey) {
    return false;
  }

  try {
    const expectedSignature = await calculateHMAC(options.secretKey, options.body);
    return expectedSignature === options.signature;
  } catch (error) {
    // Logging logic can be injected here
    return false;
  }
}