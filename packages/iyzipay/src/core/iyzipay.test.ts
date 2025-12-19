import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Iyzipay } from "./iyzipay"; // Adjust import path as needed
import { HttpClient } from "./http-client";

// Mock dependent resources to ensure we only test Iyzipay class logic
// and not the implementation of every sub-resource.
vi.mock("../resources/payment/index.js", () => ({
  PaymentResource: class {
    constructor(public client: any) {}
  },
}));
vi.mock("../resources/transaction/refund.js", () => ({
  RefundResource: class {
    constructor(public client: any) {}
  },
}));
vi.mock("../resources/transaction/cancel.js", () => ({
  CancelResource: class {
    constructor(public client: any) {}
  },
}));
vi.mock("../resources/utils/installments.js", () => ({
  InstallmentResource: class {
    constructor(public client: any) {}
  },
}));
vi.mock("../resources/threeds/index.js", () => ({
  ThreedsResource: class {
    constructor(public client: any) {}
  },
}));
vi.mock("../resources/utils/bin-number.js", () => ({
  BinNumberResource: class {
    constructor(public client: any) {}
  },
}));
vi.mock("../resources/checkout/index.js", () => ({
  CheckoutFormResource: class {
    constructor(public client: any) {}
  },
}));

describe("Iyzipay SDK Main Class", () => {
  const mockConfig = {
    apiKey: "test-api-key",
    secretKey: "test-secret-key",
    baseUrl: "https://sandbox-api.iyzipay.com",
  };

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("should initialize HttpClient and all resources correctly", () => {
    const iyzipay = new Iyzipay(mockConfig);

    // Access private property for testing if needed, or check behavior
    const client = (iyzipay as any).httpClient;
    expect(client).toBeInstanceOf(HttpClient);
    expect(client.config).toEqual(mockConfig);

    // Check if resources are instantiated
    expect(iyzipay.payment).toBeDefined();
    expect(iyzipay.refund).toBeDefined();
    expect(iyzipay.cancel).toBeDefined();
    expect(iyzipay.installment).toBeDefined();
    expect(iyzipay.threeds).toBeDefined();
    expect(iyzipay.binNumber).toBeDefined();
    expect(iyzipay.checkoutForm).toBeDefined();

    // Verify resources received the http client
    expect((iyzipay.payment as any).client).toBe(client);
  });

  describe("Security Guardrails", () => {
    it("should throw a security alert if running in a browser environment (window defined, process undefined)", () => {
      // Simulate Browser Environment
      vi.stubGlobal("window", { document: {} });
      vi.stubGlobal("process", undefined);

      expect(() => new Iyzipay(mockConfig)).toThrowError(
        /SECURITY ALERT: iyzipay-node-ts is intended for SERVER-SIDE usage only/
      );
    });

    it("should NOT throw if running in Node environment (process defined)", () => {
      // Simulate Node Environment (default in many test runners, but ensuring here)
      vi.stubGlobal("process", { env: {} });
      vi.stubGlobal("window", undefined);

      expect(() => new Iyzipay(mockConfig)).not.toThrow();
    });
  });

  describe("fromEnv() Static Method", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      vi.resetModules();
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it("should create instance using process.env variables", () => {
      process.env.IYZIPAY_API_KEY = "env-api-key";
      process.env.IYZIPAY_SECRET_KEY = "env-secret-key";
      process.env.IYZIPAY_BASE_URL = "https://env-url.com";

      const iyzipay = Iyzipay.fromEnv();
      const config = (iyzipay as any).httpClient.config;

      expect(config.apiKey).toBe("env-api-key");
      expect(config.secretKey).toBe("env-secret-key");
      expect(config.baseUrl).toBe("https://env-url.com");
    });

    it("should use default production URL if IYZIPAY_BASE_URL is missing", () => {
      process.env.IYZIPAY_API_KEY = "env-api-key";
      process.env.IYZIPAY_SECRET_KEY = "env-secret-key";
      delete process.env.IYZIPAY_BASE_URL;

      const iyzipay = Iyzipay.fromEnv();
      const config = (iyzipay as any).httpClient.config;

      expect(config.baseUrl).toBe("https://api.iyzipay.com");
    });

    it("should throw error if API keys are missing in env", () => {
      delete process.env.IYZIPAY_API_KEY;
      delete process.env.IYZIPAY_SECRET_KEY;

      expect(() => Iyzipay.fromEnv()).toThrowError(
        /Iyzipay environment variables .* are missing/
      );
    });

    it("should allow overriding config when using fromEnv", () => {
      process.env.IYZIPAY_API_KEY = "env-key";
      process.env.IYZIPAY_SECRET_KEY = "env-secret";

      // Pass a custom sandbox URL while keeping keys from env
      const iyzipay = Iyzipay.fromEnv({
        // @ts-expect-error: we are testing partial override
        baseUrl: "https://custom-override.com",
      });

      const config = (iyzipay as any).httpClient.config;
      expect(config.apiKey).toBe("env-key");
      expect(config.baseUrl).toBe("https://custom-override.com");
    });
  });
});