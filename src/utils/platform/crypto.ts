/**
 * Universal Crypto Layer
 *
 * This module provides a unified interface for cryptographic operations (SHA1, HMAC-SHA256)
 * that works across Node.js (Legacy & Modern), Edge Runtimes (Cloudflare, Vercel),
 * and Browsers/React Native.
 */

import type * as NodeCrypto from 'node:crypto';

/**
 * Retrieves the Web Crypto API instance if available in the global scope.
 * Supported in: Node.js 19+, Cloudflare Workers, Vercel Edge, Browsers.
 */
const getWebCrypto = (): Crypto | undefined => {
  if (typeof globalThis !== 'undefined' && globalThis.crypto) {
    return globalThis.crypto;
  }
  return undefined;
};

/**
 * Dynamically imports the Node.js legacy crypto module.
 * This is a fallback for Node.js 18 and older or environments lacking global crypto.
 */
const getNodeCrypto = async (): Promise<typeof NodeCrypto> => {
  try {
    // @ts-ignore: Dynamic import may not be recognized by all bundlers but works in Node
    return await import('node:crypto');
  } catch {
    throw new Error(
      'Cryptographic functionality is not available in this environment. ' +
        'Please ensure you are running on Node.js, an Edge Runtime, or a Secure Context (HTTPS) in browsers.',
    );
  }
};

/**
 * Computes a SHA-1 hash of the given string.
 * Required for Iyzico V1 Authentication headers.
 *
 * @param input - The string to hash.
 * @returns The SHA-1 hash encoded as a Base64 string.
 */
export async function calculateSHA1(input: string): Promise<string> {
  const webCrypto = getWebCrypto();

  // Modern / Edge Strategy
  if (webCrypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await webCrypto.subtle.digest('SHA-1', data);
    return arrayBufferToBase64(hashBuffer);
  }

  // Legacy Node.js Strategy
  const nodeCrypto = await getNodeCrypto();
  return nodeCrypto.createHash('sha1').update(input, 'utf8').digest('base64');
}

/**
 * Computes an HMAC-SHA256 signature.
 * Required for Iyzico V2 Authentication headers.
 *
 * @param key - The secret key used for signing.
 * @param data - The data payload to sign.
 * @returns The HMAC signature encoded as a Hex string.
 */
export async function calculateHMAC(key: string, data: string): Promise<string> {
  const webCrypto = getWebCrypto();

  // Modern / Edge Strategy
  if (webCrypto?.subtle) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const messageData = encoder.encode(data);

    const importedKey = await webCrypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    );

    const signature = await webCrypto.subtle.sign('HMAC', importedKey, messageData);
    return arrayBufferToHex(signature);
  }

  // Legacy Node.js Strategy
  const nodeCrypto = await getNodeCrypto();
  return nodeCrypto.createHmac('sha256', key).update(data).digest('hex');
}

// --- Utilities ---

/**
 * Converts an ArrayBuffer to a Base64 string.
 * Handles environment differences (btoa vs Buffer).
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(buffer).toString('base64');
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i] || 0);
  }
  return btoa(binary);
}

/**
 * Converts an ArrayBuffer to a Hex string.
 */
function arrayBufferToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Converts a string to a Base64 string.
 * Handles environment differences (btoa vs Buffer).
 */
export function stringToBase64(input: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(input).toString('base64');
  }
  return btoa(input);
}
