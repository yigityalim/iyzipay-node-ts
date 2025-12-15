import { describe, it, expect } from 'vitest';
import { calculateHMAC, stringToBase64 } from '../../src/utils/platform/crypto';
import { verifyWebhookSignature } from '../../src/utils/webhook';

describe('Crypto Utilities', () => {
  it('should convert string to base64 correctly', () => {
    const input = 'iyzipay-node-ts';
    // 'iyzipay-node-ts' -> Base64: 'aXl6aXBheS1ub2RlLXRz'
    expect(stringToBase64(input)).toBe('aXl6aXBheS1ub2RlLXRz');
  });

  it('should calculate HMAC-SHA256 correctly', async () => {
    const key = 'secret';
    const data = 'message';
    // Online HMAC araçlarıyla doğrulanabilir sabit değer
    const expected = '8b5f48702995c1598c573db1e21866a9b825d4a794d169d7060a03605796360b';
    
    const result = await calculateHMAC(key, data);
    expect(result).toBe(expected);
  });
});

describe('Webhook Verification', () => {
  it('should return true for valid signature', async () => {
    const secretKey = 'my-secret-key';
    const body = JSON.stringify({ status: 'success' });
    
    // Geçerli imzayı kendimiz üretelim
    const validSignature = await calculateHMAC(secretKey, body);

    const isValid = await verifyWebhookSignature({
      secretKey,
      body,
      signature: validSignature,
    });

    expect(isValid).toBe(true);
  });

  it('should return false for invalid signature', async () => {
    const isValid = await verifyWebhookSignature({
      secretKey: 'my-secret-key',
      body: 'some-data',
      signature: 'wrong-signature',
    });

    expect(isValid).toBe(false);
  });

  it('should return false if parameters are missing', async () => {
    const isValid = await verifyWebhookSignature({
      secretKey: '',
      body: '',
      signature: '',
    });
    expect(isValid).toBe(false);
  });
});