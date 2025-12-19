import { describe, it, expect, vi, type Mock, afterEach } from 'vitest';
import { verifyWebhookSignature } from './webhook';
import { calculateHMAC } from './platform/crypto';

vi.mock('./platform/crypto', () => ({
  calculateHMAC: vi.fn(),
}));

describe('verifyWebhookSignature', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return true when the provided signature matches the calculated HMAC', async () => {
    (calculateHMAC as Mock).mockResolvedValue('valid_signature_hash');

    const result = await verifyWebhookSignature({
      secretKey: 'my-secret-key',
      body: '{"status":"success"}',
      signature: 'valid_signature_hash',
    });

    expect(calculateHMAC).toHaveBeenCalledWith('my-secret-key', '{"status":"success"}');
    expect(result).toBe(true);
  });

  it('should return false when the provided signature does not match', async () => {
    (calculateHMAC as Mock).mockResolvedValue('expected_signature_hash');

    const result = await verifyWebhookSignature({
      secretKey: 'my-secret-key',
      body: '{"status":"success"}',
      signature: 'invalid_provided_signature',
    });

    expect(result).toBe(false);
  });

  it('should return false if the secretKey is missing', async () => {
    const result = await verifyWebhookSignature({
      secretKey: '',
      body: 'body',
      signature: 'sig',
    });

    expect(result).toBe(false);
    expect(calculateHMAC).not.toHaveBeenCalled();
  });

  it('should return false if the body is missing', async () => {
    const result = await verifyWebhookSignature({
      secretKey: 'secret',
      body: '',
      signature: 'sig',
    });

    expect(result).toBe(false);
    expect(calculateHMAC).not.toHaveBeenCalled();
  });

  it('should return false if the signature is missing', async () => {
    const result = await verifyWebhookSignature({
      secretKey: 'secret',
      body: 'body',
      signature: '',
    });

    expect(result).toBe(false);
    expect(calculateHMAC).not.toHaveBeenCalled();
  });

  it('should return false securely if an error occurs during HMAC calculation', async () => {
    (calculateHMAC as Mock).mockRejectedValue(new Error('Crypto failure'));

    const result = await verifyWebhookSignature({
      secretKey: 'secret',
      body: 'body',
      signature: 'sig',
    });

    expect(result).toBe(false);
  });
});