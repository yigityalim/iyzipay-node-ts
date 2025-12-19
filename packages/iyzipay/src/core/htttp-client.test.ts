import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { HttpClient } from "./http-client";
import { calculateHMAC, stringToBase64 } from "../utils/platform/crypto";
import { IyzipayError } from "./iyzipay-error";

vi.mock("../utils/platform/crypto", () => ({
  calculateHMAC: vi.fn(),
  stringToBase64: vi.fn(),
}));

vi.mock("./iyzipay-error", () => {
  return {
    IyzipayError: class {
      constructor(public data: any) {}
    },
  };
});

describe("HttpClient", () => {
  let client: HttpClient;
  const mockConfig = {
    apiKey: "test-api-key",
    secretKey: "test-secret-key",
    baseUrl: "https://sandbox-api.iyzipay.com",
  };

  const fixedDate = 1735689600000;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
    
    client = new HttpClient(mockConfig);
    
    global.fetch = vi.fn();
    (calculateHMAC as Mock).mockResolvedValue("mocked_signature");
    (stringToBase64 as Mock).mockReturnValue("mocked_base64_token");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should initialize with correct config", () => {
    expect(client.config).toEqual(mockConfig);
  });

  it("should successfully execute a GET request", async () => {
    const mockResponse = { status: "success", data: "test-data" };
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await client.get("/payment/test");

    expect(calculateHMAC).toHaveBeenCalledWith(
      mockConfig.secretKey,
      `${fixedDate}/payment/test`
    );
    expect(stringToBase64).toHaveBeenCalledWith(
      `apiKey:${mockConfig.apiKey}&randomKey:${fixedDate}&signature:mocked_signature`
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConfig.baseUrl}/payment/test`,
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          Authorization: "IYZWSv2 mocked_base64_token",
          "x-iyzi-rnd": fixedDate.toString(),
        }),
      })
    );

    expect(result).toEqual({ data: mockResponse, error: null });
  });

  it("should successfully execute a POST request with body", async () => {
    const mockResponse = { status: "success", id: 1 };
    const requestBody = { price: 100 };
    
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await client.post("/payment/create", requestBody);
    const expectedBodyString = JSON.stringify(requestBody);

    expect(calculateHMAC).toHaveBeenCalledWith(
      mockConfig.secretKey,
      `${fixedDate}/payment/create${expectedBodyString}`
    );

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConfig.baseUrl}/payment/create`,
      expect.objectContaining({
        method: "POST",
        body: expectedBodyString,
      })
    );

    expect(result).toEqual({ data: mockResponse, error: null });
  });

  it("should successfully execute a PUT request", async () => {
    const mockResponse = { status: "success", updated: true };
    const requestBody = { name: "New Name" };

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await client.put("/payment/update", requestBody);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/payment/update"),
      expect.objectContaining({ method: "PUT" })
    );

    expect(result.data).toEqual(mockResponse);
  });

  it("should successfully execute a DELETE request", async () => {
    const mockResponse = { status: "success", deleted: true };
    
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await client.delete("/payment/delete");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/payment/delete"),
      expect.objectContaining({ method: "DELETE" })
    );

    expect(result.data).toEqual(mockResponse);
  });

  it("should handle HTTP errors (non-200 status)", async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    const result = await client.post("/error", {});

    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toContain("HTTP 500");
    expect(result.error?.message).toContain("Internal Server Error");
  });

  it("should handle API failure responses (status: failure)", async () => {
    const failureResponse = {
      status: "failure",
      errorCode: "100",
      errorMessage: "Invalid Card",
    };

    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => failureResponse,
    });

    const result = await client.post("/payment/fail", {});

    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(IyzipayError);
    expect((result.error as any).data).toEqual(failureResponse);
  });

  it("should handle network exceptions", async () => {
    const networkError = new Error("Network Down");
    (global.fetch as Mock).mockRejectedValue(networkError);

    const result = await client.get("/network-fail");

    expect(result.data).toBeNull();
    expect(result.error).toBe(networkError);
  });

  it("should handle unknown non-error exceptions", async () => {
    (global.fetch as Mock).mockRejectedValue("String Error");

    const result = await client.get("/unknown-fail");

    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toBe("Unknown Network Error");
  });

  it("should include correct standard headers", async () => {
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ status: "success" }),
    });

    await client.get("/headers");

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-iyzi-client-version": "iyzipay-node-ts-0.1.0",
        }),
      })
    );
  });
});