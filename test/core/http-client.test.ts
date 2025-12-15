import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpClient } from '../../src/core/http-client';
import { IyzipayError } from '../../src/core/iyzipay-error';

// Fetch'i global olarak mock'luyoruz
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('HttpClient', () => {
  const config = {
    apiKey: 'test-api-key',
    secretKey: 'test-secret-key',
    baseUrl: 'https://sandbox-api.iyzipay.com',
  };

  const client = new HttpClient(config);

  afterEach(() => {
    vi.clearAllMocks(); // Her testten sonra temizle
  });

  it('should handle successful request', async () => {
    // 1. Mock Response Tanımla (Başarılı)
    const mockResponse = {
      status: 'success',
      conversationId: '123456',
      price: '100.00',
    };

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    // 2. İsteği At
    const result = await client.request('POST', '/payment/test', { foo: 'bar' });

    // 3. Kontrol Et
    expect(result.error).toBeNull();
    expect(result.data).toEqual(mockResponse);
    
    // Authorization header formatını kontrol et (V2 Base64 yapısı)
    const calledHeaders = fetchMock.mock.calls[0][1].headers;
    expect(calledHeaders['Authorization']).toContain('IYZWSv2 ');
  });

  it('should handle API failure (status: failure)', async () => {
    // 1. Mock Response (Iyzico Hatası)
    const mockErrorResponse = {
      status: 'failure',
      errorCode: '10051',
      errorMessage: 'Yetersiz bakiye',
    };

    fetchMock.mockResolvedValue({
      ok: true, // HTTP 200 döner ama body'de failure vardır
      json: async () => mockErrorResponse,
    });

    const result = await client.request('POST', '/payment/test');

    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(IyzipayError);
    expect((result.error as IyzipayError).errorCode).toBe('10051');
  });

  it('should handle Network/HTTP errors', async () => {
    // 1. Mock Response (HTTP 500)
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    });

    const result = await client.request('POST', '/payment/test');

    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
    expect(result.error?.message).toContain('HTTP Error 500');
  });
});