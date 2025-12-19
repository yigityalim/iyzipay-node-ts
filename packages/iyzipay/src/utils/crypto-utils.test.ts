import { describe, it, expect, vi, type Mock, afterEach } from 'vitest';
import { CryptoUtils } from './crypto-utils';
import {
  calculateSHA1,
  calculateHMAC,
  stringToBase64,
  base64ToString,
} from './platform/crypto';

vi.mock('./platform/crypto', () => ({
  calculateSHA1: vi.fn(),
  calculateHMAC: vi.fn(),
  stringToBase64: vi.fn(),
  base64ToString: vi.fn(),
}));

describe('CryptoUtils', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should correctly alias sha1 to calculateSHA1', async () => {
    const mockHash = 'mock_sha1_hash';
    (calculateSHA1 as Mock).mockResolvedValue(mockHash);

    const result = await CryptoUtils.sha1('test-data');

    expect(calculateSHA1).toHaveBeenCalledWith('test-data');
    expect(result).toBe(mockHash);
  });

  it('should correctly alias hmac to calculateHMAC', async () => {
    const mockSignature = 'mock_hmac_signature';
    (calculateHMAC as Mock).mockResolvedValue(mockSignature);

    const result = await CryptoUtils.hmac('secret', 'payload');

    expect(calculateHMAC).toHaveBeenCalledWith('secret', 'payload');
    expect(result).toBe(mockSignature);
  });

  it('should correctly alias base64Encode to stringToBase64', () => {
    const mockEncoded = 'dGVzdA==';
    (stringToBase64 as Mock).mockReturnValue(mockEncoded);

    const result = CryptoUtils.base64Encode('test');

    expect(stringToBase64).toHaveBeenCalledWith('test');
    expect(result).toBe(mockEncoded);
  });

  it('should correctly alias base64Decode to base64ToString', () => {
    const mockDecoded = 'test';
    (base64ToString as Mock).mockReturnValue(mockDecoded);

    const result = CryptoUtils.base64Decode('dGVzdA==');

    expect(base64ToString).toHaveBeenCalledWith('dGVzdA==');
    expect(result).toBe(mockDecoded);
  });
});