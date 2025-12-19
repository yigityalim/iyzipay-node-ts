import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import {
  getCrypto,
  setCustomCryptoProvider,
  resetCryptoProvider,
  calculateSHA1,
  calculateHMAC,
  stringToBase64,
  base64ToString,
  generateRandomBytes,
  ExpoCryptoProvider,
  type CryptoProvider
} from './crypto';

// --- Global Objeleri Sakla (Güvenli Referans) ---
const OriginalBuffer = globalThis.Buffer;

// --- Reusable Mock Implementation ---
const mockNodeCryptoImplementation = {
  createHash: vi.fn(() => ({
    update: vi.fn().mockReturnThis(),
    digest: vi.fn().mockReturnValue('mock_sha1_base64'),
  })),
  createHmac: vi.fn(() => ({
    update: vi.fn().mockReturnThis(),
    digest: vi.fn().mockReturnValue('mock_hmac_hex'),
  })),
  randomBytes: vi.fn((len) => new Uint8Array(len).fill(1)),
  timingSafeEqual: vi.fn(() => true),
  getRandomValues: vi.fn((arr) => arr.fill(1)),
};

// --- Mocks ---

// Top-level mock for general cases
vi.mock('node:crypto', () => {
  return mockNodeCryptoImplementation;
});

// Mock Web Crypto API
const mockWebCrypto = {
  subtle: {
    digest: vi.fn(),
    importKey: vi.fn(),
    sign: vi.fn(),
  },
  getRandomValues: vi.fn((arr) => arr.fill(2)),
} as unknown as Crypto;

// Mock Expo Crypto
const mockExpoCrypto = {
  digestStringAsync: vi.fn(),
  getRandomBytes: vi.fn((len) => new Uint8Array(len).fill(3)),
  getRandomValues: vi.fn((arr) => arr.fill(3)),
  timingSafeEqual: vi.fn(() => true),
  CryptoDigestAlgorithm: { SHA1: 'SHA-1' },
  CryptoEncoding: { BASE64: 'Base64' },
};

describe('Universal Crypto Platform Layer', () => {
  beforeEach(() => {
    resetCryptoProvider();
    vi.resetModules();
    vi.clearAllMocks();
    
    // Varsayılan olarak her test temiz bir ortamda başlar
    vi.stubGlobal('crypto', undefined);
    vi.stubGlobal('window', undefined);
    vi.stubGlobal('Buffer', undefined);
    vi.stubGlobal('btoa', undefined);
    vi.stubGlobal('atob', undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // --- Provider Detection Tests ---

  describe('Provider Detection (getCrypto)', () => {
    it('should detect WebCryptoProvider when globalThis.crypto is available', async () => {
      vi.stubGlobal('crypto', mockWebCrypto);
      
      const provider = await getCrypto();
      expect(provider.name).toBe('WebCrypto');
    });

    it('should detect NodeCryptoProvider when node:crypto is available (and WebCrypto is missing)', async () => {
      // Ensure node:crypto is working for this test
      vi.doMock('node:crypto', () => mockNodeCryptoImplementation);
      
      const provider = await getCrypto();
      expect(provider.name).toBe('NodeCrypto');
    });

    it('should prefer Custom Provider if set', async () => {
      const customProvider = { name: 'Custom', sha1: vi.fn() } as unknown as CryptoProvider;
      setCustomCryptoProvider(customProvider);

      const provider = await getCrypto();
      expect(provider).toBe(customProvider);
      expect(provider.name).toBe('Custom');
    });

    it('should throw error if no crypto implementation is available', async () => {
      // Bu test için özel olarak hata fırlatan bir mock tanımlıyoruz
      vi.doMock('node:crypto', () => { throw new Error('Not found'); });

      await expect(getCrypto()).rejects.toThrow(/No crypto implementation available/);
    });
  });

  // --- NodeCryptoProvider Tests ---

  describe('NodeCryptoProvider Implementation', () => {
    beforeEach(() => {
       // Orijinal Buffer'ı geri yükle
       vi.stubGlobal('Buffer', OriginalBuffer); 
       
       // CRITICAL FIX: Önceki testlerdeki (özellikle "should throw error...")
       // doMock çağrılarının etkisini silmek için çalışan mock'u tekrar tanımlıyoruz.
       vi.doMock('node:crypto', () => mockNodeCryptoImplementation);
    });

    it('should calculate SHA1 using node crypto', async () => {
      const result = await calculateSHA1('test');
      expect(result).toBe('mock_sha1_base64');
    });

    it('should calculate HMAC using node crypto', async () => {
      const result = await calculateHMAC('key', 'data');
      expect(result).toBe('mock_hmac_hex');
    });

    it('should generate random bytes using node crypto', async () => {
        const { uint8array } = await generateRandomBytes(10);
        expect(uint8array.length).toBe(10);
        expect(uint8array[0]).toBe(1);
    });

    it('should perform timing safe equal', async () => {
        const provider = await getCrypto();
        expect(provider.timingSafeEqual('a', 'b')).toBe(true);
    });
  });

  // --- WebCryptoProvider Tests ---

  describe('WebCryptoProvider Implementation', () => {
    let provider: CryptoProvider;

    beforeEach(async () => {
      vi.stubGlobal('crypto', mockWebCrypto);
      vi.stubGlobal('TextEncoder', TextEncoder);
      
      vi.stubGlobal('btoa', (str: string) => OriginalBuffer.from(str, 'binary').toString('base64'));
      vi.stubGlobal('atob', (str: string) => OriginalBuffer.from(str, 'base64').toString('binary'));
      
      provider = await getCrypto();
    });

    it('should calculate SHA1 using Web Crypto API', async () => {
      const mockBuffer = new Uint8Array([1, 2, 3]).buffer;
      (mockWebCrypto.subtle.digest as Mock).mockResolvedValue(mockBuffer);

      const result = await provider.sha1('data');
      
      expect(mockWebCrypto.subtle.digest).toHaveBeenCalledWith('SHA-1', expect.any(Uint8Array));
      expect(result).toBe('AQID'); // Base64 of [1, 2, 3]
    });

    it('should calculate HMAC using Web Crypto API', async () => {
      const mockKey = { type: 'secret' };
      const mockSignature = new Uint8Array([10, 20, 30]).buffer; // Hex: 0a141e

      (mockWebCrypto.subtle.importKey as Mock).mockResolvedValue(mockKey);
      (mockWebCrypto.subtle.sign as Mock).mockResolvedValue(mockSignature);

      const result = await provider.hmacSha256('key', 'data');

      expect(mockWebCrypto.subtle.importKey).toHaveBeenCalledWith(
        'raw', 
        expect.any(Uint8Array), 
        { name: 'HMAC', hash: 'SHA-256' }, 
        false, 
        ['sign']
      );
      expect(mockWebCrypto.subtle.sign).toHaveBeenCalledWith('HMAC', mockKey, expect.any(Uint8Array));
      expect(result).toBe('0a141e');
    });

    it('should fallback to manual base64 encoding if btoa is missing', async () => {
        vi.stubGlobal('btoa', undefined);
        const result = provider.base64Encode('ABC');
        expect(result).toBe('QUJD');
    });

    it('should fallback to manual base64 decoding if atob is missing', () => {
        vi.stubGlobal('atob', undefined); 
        expect(() => provider.base64Decode('QUJD')).toThrow(/Base64 decode not available/);
    });

    it('should throw on timingSafeEqual as it is not supported in WebCrypto implementation', () => {
        expect(() => provider.timingSafeEqual('a', 'b')).toThrow(/not available/);
    });
  });

  // --- ExpoCryptoProvider Tests ---

  describe('ExpoCryptoProvider Implementation', () => {
    let provider: ExpoCryptoProvider;

    beforeEach(() => {
      provider = new ExpoCryptoProvider(mockExpoCrypto);
    });

    it('should calculate SHA1 using Expo digestStringAsync', async () => {
      (mockExpoCrypto.digestStringAsync as Mock).mockResolvedValue('expo_sha1');
      
      const result = await provider.sha1('data');
      
      expect(mockExpoCrypto.digestStringAsync).toHaveBeenCalledWith(
        'SHA-1', 
        'data', 
        { encoding: 'Base64' }
      );
      expect(result).toBe('expo_sha1');
    });

    it('should throw error for HMAC calculation (not natively supported)', async () => {
      await expect(provider.hmacSha256('key', 'data')).rejects.toThrow(/HMAC not natively supported/);
    });

    it('should generate random bytes using Expo getRandomBytes', () => {
       const bytes = provider.randomBytes(10);
       expect(bytes).toBeInstanceOf(Uint8Array);
       expect(bytes.length).toBe(10);
       expect(mockExpoCrypto.getRandomBytes).toHaveBeenCalledWith(10);
    });
  });

  // --- Utility Functions Tests ---

  describe('Utility Functions', () => {
    it('stringToBase64 should use Buffer if available', () => {
        vi.stubGlobal('Buffer', OriginalBuffer);
        expect(stringToBase64('test')).toBe('dGVzdA==');
    });

    it('stringToBase64 should use btoa if Buffer missing', () => {
        vi.stubGlobal('Buffer', undefined);
        vi.stubGlobal('btoa', (s: string) => OriginalBuffer.from(s).toString('base64'));
        
        expect(stringToBase64('test')).toBe('dGVzdA==');
    });

    it('stringToBase64 should throw if neither is available', () => {
        vi.stubGlobal('Buffer', undefined);
        vi.stubGlobal('btoa', undefined);
        expect(() => stringToBase64('test')).toThrow(/Base64 encoding not available/);
    });

    it('base64ToString should use Buffer if available', () => {
        vi.stubGlobal('Buffer', OriginalBuffer);
        expect(base64ToString('dGVzdA==')).toBe('test');
    });

    it('base64ToString should use atob if Buffer missing', () => {
        vi.stubGlobal('Buffer', undefined);
        vi.stubGlobal('atob', (s: string) => OriginalBuffer.from(s, 'base64').toString('utf8'));
        expect(base64ToString('dGVzdA==')).toBe('test');
    });
  });
});