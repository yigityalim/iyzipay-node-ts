import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { CheckoutFormInitializeSchema, CheckoutFormRetrieveSchema } from '../../schemas/checkout-form';
import { Locale, Currency, PaymentGroup } from '../../types/enums';
import { CheckoutFormResource } from '.';
import { HttpClient } from '../../core/http-client';

// --- Mocks ---

// HttpClient'ı mock'luyoruz
vi.mock('../../core/http-client', () => {
  return {
    HttpClient: vi.fn().mockImplementation(() => ({
      config: { defaults: { locale: 'tr' } }, // Varsayılan config simülasyonu
      post: vi.fn(),
    })),
  };
});

// Zod şemalarını mock'luyoruz (Validasyon mantığını izole etmek için)
vi.mock('../../schemas/checkout-form', () => ({
  CheckoutFormInitializeSchema: {
    parse: vi.fn((data) => data), // Başarılı durumda veriyi olduğu gibi döndür
  },
  CheckoutFormRetrieveSchema: {
    parse: vi.fn((data) => data),
  },
}));

describe('CheckoutFormResource', () => {
  let resource: CheckoutFormResource;
  let mockClient: HttpClient;

  beforeEach(() => {
    // Her testten önce temiz bir client ve resource oluştur
    mockClient = new HttpClient({ apiKey: 'key', secretKey: 'secret', baseUrl: 'url' });
    resource = new CheckoutFormResource(mockClient);
    
    // Date.now() sabitliyoruz ki basketId testlerinde tutarlılık olsun
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // --- Initialize Tests ---

  describe('initialize', () => {
    const mockRequest = {
      price: '100.0',
      basketId: 'B123',
      conversationId: '123456',
      buyer: { id: 'user1' },
      shippingAddress: {},
      billingAddress: {},
      basketItems: [],
    };

    it('should call client.post with correct URL and merged data', async () => {
      // Mock başarılı yanıt
      const mockResponse = { paymentPageUrl: 'https://iyzico.com/pay' };
      (mockClient.post as Mock).mockResolvedValue({ data: mockResponse, error: null });

      await resource.initialize(mockRequest as any);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/payment/iyzipos/checkoutform/initialize/auth/ecom',
        expect.objectContaining({
          price: '100.0',
          locale: 'tr', // Config default'tan gelmeli
          currency: Currency.TRY, // Kod içindeki default
          paymentGroup: PaymentGroup.PRODUCT, // Kod içindeki default
        })
      );
    });

    it('should automatically set paidPrice equal to price if missing', async () => {
      const requestWithoutPaidPrice = { price: '50.0' };
      (mockClient.post as Mock).mockResolvedValue({ data: {}, error: null });

      await resource.initialize(requestWithoutPaidPrice as any);

      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          price: '50.0',
          paidPrice: '50.0', // Otomatik atanmalı
        })
      );
    });

    it('should generate basketId if missing', async () => {
      const requestWithoutBasketId = { price: '10.0' };
      (mockClient.post as Mock).mockResolvedValue({ data: {}, error: null });

      await resource.initialize(requestWithoutBasketId as any);

      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          basketId: 'B' + Date.now(), // Otomatik oluşturulan ID
        })
      );
    });

    it('should return Zod validation errors without calling API', async () => {
      const zodError = new Error('Validation Failed');
      (CheckoutFormInitializeSchema.parse as Mock).mockImplementationOnce(() => {
        throw zodError;
      });

      const result = await resource.initialize({});

      expect(result.data).toBeNull();
      expect(result.error).toBe(zodError);
      expect(mockClient.post).not.toHaveBeenCalled();
    });

    it('should handle HTTP client errors gracefully', async () => {
      const httpError = new Error('Network Error');
      (mockClient.post as Mock).mockResolvedValue({ data: null, error: httpError });

      const result = await resource.initialize(mockRequest as any);

      expect(result.data).toBeNull();
      expect(result.error).toBe(httpError);
    });
  });

  // --- Retrieve Tests ---

  describe('retrieve', () => {
    it('should call client.post with correct URL and token', async () => {
      const mockRetrieveReq = { token: 'test-token', locale: Locale.TR };
      const mockResponse = { paymentStatus: 'SUCCESS' };
      
      (mockClient.post as Mock).mockResolvedValue({ data: mockResponse, error: null });

      const result = await resource.retrieve(mockRetrieveReq);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/payment/iyzipos/checkoutform/auth/ecom/detail',
        mockRetrieveReq
      );
      expect(result.data).toBe(mockResponse);
    });

    it('should return Zod validation errors', async () => {
      const zodError = new Error('Invalid Token');
      (CheckoutFormRetrieveSchema.parse as Mock).mockImplementationOnce(() => {
        throw zodError;
      });

      const result = await resource.retrieve({ token: '' } as any);

      expect(result.data).toBeNull();
      expect(result.error).toBe(zodError);
      expect(mockClient.post).not.toHaveBeenCalled();
    });
  });
});