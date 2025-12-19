import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { IdUtils } from "./id-utils";
import { calculateHMAC, calculateSHA1, getCrypto } from "./platform/crypto";

// Mock the crypto platform dependencies
vi.mock("./platform/crypto", () => ({
  calculateHMAC: vi.fn(),
  calculateSHA1: vi.fn(),
  getCrypto: vi.fn(),
}));

describe("IdUtils", () => {
  const fixedTimestamp = 1700000000000;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedTimestamp);
    vi.clearAllMocks();

    // Default mock for getCrypto to support verification tests
    (getCrypto as Mock).mockResolvedValue({
      timingSafeEqual: vi.fn().mockReturnValue(true),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("ID Generation", () => {
    it("should generate conversation ID with default prefix", () => {
      const id = IdUtils.generateConversationId();
      
      // Expected format: conv_<timestamp>_<random>
      expect(id).toMatch(/^conv_1700000000000_[a-f0-9]+$/);
    });

    it("should generate conversation ID with custom prefix", () => {
      const id = IdUtils.generateConversationId("order");
      expect(id).toMatch(/^order_1700000000000_[a-f0-9]+$/);
    });

    it("should generate basket ID for a specific user", () => {
      const id = IdUtils.generateBasketId("user123");
      // Expected format: basket_user123_<timestamp>_<random>
      expect(id).toMatch(/^basket_user123_1700000000000_[a-f0-9]+$/);
    });

    it("should generate anonymous basket ID", () => {
      const id = IdUtils.generateBasketId();
      expect(id).toMatch(/^basket_anon_1700000000000_[a-f0-9]+$/);
    });

    it("should generate idempotency key with default context", () => {
      const key = IdUtils.generateIdempotencyKey();
      expect(key).toMatch(/^idem_request_1700000000000_[a-f0-9]+$/);
    });

    it("should generate idempotency key with custom context", () => {
      const key = IdUtils.generateIdempotencyKey("refund");
      expect(key).toMatch(/^idem_refund_1700000000000_[a-f0-9]+$/);
    });
  });

  describe("Payment Reference Hashing", () => {
    it("should hash payment references using SHA1", async () => {
      (calculateSHA1 as Mock).mockResolvedValue("a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6");

      const ref = await IdUtils.hashPaymentReference("user-1", "pay-2");

      expect(calculateSHA1).toHaveBeenCalledWith("user-1::pay-2");
      // Expect ref_ + first 16 chars of hash
      expect(ref).toBe("ref_a1b2c3d4e5f6g7h8");
    });
  });

  describe("Secret Key Generation", () => {
    it("should generate hex secret key by default", () => {
      const secret = IdUtils.generateSecretKey();
      // 32 bytes = 64 hex characters
      expect(secret).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should generate base64 secret key when requested", () => {
      const secret = IdUtils.generateSecretKey("base64");
      // Base64 string regex validation
      expect(secret).toMatch(/^[A-Za-z0-9+/]+={0,2}$/);
    });
  });

  describe("Signed Nonce (Replay Protection)", () => {
    const mockSecret = "super-secret-key";

    describe("createSignedNonce", () => {
      it("should create a valid signed nonce object", async () => {
        (calculateHMAC as Mock).mockResolvedValue("mock_signature");

        const expiryMs = 5000;
        const result = await IdUtils.createSignedNonce(mockSecret, expiryMs);

        expect(result.timestamp).toBe(fixedTimestamp);
        expect(result.expiresAt).toBe(fixedTimestamp + expiryMs);
        expect(result.nonce).toMatch(/^[a-f0-9]{32}$/); // 16 bytes = 32 hex chars
        expect(result.signature).toBe("mock_signature");

        // Verify payload construction passed to HMAC
        const expectedPayload = `${result.nonce}:${fixedTimestamp}:${result.expiresAt}`;
        expect(calculateHMAC).toHaveBeenCalledWith(mockSecret, expectedPayload);
      });
    });

    describe("verifySignedNonce", () => {
      const validNonce = "valid_nonce_val";
      const validSignature = "valid_signature";
      const maxAgeMs = 5000;

      it("should return true for a valid, fresh nonce", async () => {
        const timestamp = fixedTimestamp - 1000; // Created 1 second ago (valid)
        
        // Mock crypto provider
        const mockTimingSafeEqual = vi.fn().mockReturnValue(true);
        (getCrypto as Mock).mockResolvedValue({ timingSafeEqual: mockTimingSafeEqual });
        
        (calculateHMAC as Mock).mockResolvedValue(validSignature);

        const isValid = await IdUtils.verifySignedNonce(
          validNonce,
          timestamp,
          validSignature,
          mockSecret,
          maxAgeMs
        );

        expect(isValid).toBe(true);
        
        // Verify HMAC payload reconstruction matches creation logic
        const expectedPayload = `${validNonce}:${timestamp}:${timestamp + maxAgeMs}`;
        expect(calculateHMAC).toHaveBeenCalledWith(mockSecret, expectedPayload);
        expect(mockTimingSafeEqual).toHaveBeenCalledWith(validSignature, validSignature);
      });

      it("should return false if timestamp is expired (too old)", async () => {
        const timestamp = fixedTimestamp - (maxAgeMs + 100); // Expired by 100ms
        
        const isValid = await IdUtils.verifySignedNonce(
          validNonce,
          timestamp,
          validSignature,
          mockSecret,
          maxAgeMs
        );

        expect(isValid).toBe(false);
        expect(calculateHMAC).not.toHaveBeenCalled(); // Optimization check
      });

      it("should return false if timestamp is in the future (clock skew/attack)", async () => {
        const timestamp = fixedTimestamp + 5000; // 5 seconds in future
        
        const isValid = await IdUtils.verifySignedNonce(
          validNonce,
          timestamp,
          validSignature,
          mockSecret,
          maxAgeMs
        );

        expect(isValid).toBe(false);
      });

      it("should return false if signature does not match", async () => {
        const timestamp = fixedTimestamp - 1000;
        
        // Mock timingSafeEqual to return false
        const mockTimingSafeEqual = vi.fn().mockReturnValue(false);
        (getCrypto as Mock).mockResolvedValue({ timingSafeEqual: mockTimingSafeEqual });
        (calculateHMAC as Mock).mockResolvedValue("calculated_correct_signature");

        const isValid = await IdUtils.verifySignedNonce(
          validNonce,
          timestamp,
          "invalid_signature_input",
          mockSecret,
          maxAgeMs
        );

        expect(isValid).toBe(false);
        expect(mockTimingSafeEqual).toHaveBeenCalledWith("invalid_signature_input", "calculated_correct_signature");
      });
    });
  });
});