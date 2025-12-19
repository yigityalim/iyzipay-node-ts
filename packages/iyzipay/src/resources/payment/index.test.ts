import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { CreatePaymentSchema } from '../../schemas/payment';
import { Locale, Currency, PaymentChannel, PaymentGroup } from '../../types/enums';
import { PaymentResource } from '.';
import { HttpClient } from '../../core/http-client';

// --- Mocks ---

// HttpClient Mock
vi.mock('../../core/http-client', () => {
  return {
    HttpClient: vi.fn().mockImplementation(() => ({
      config: { defaults: { locale: 'tr' } },
      post: vi.fn(),
    })),
  };
});

// Zod Schema Mock
vi.mock('../../schemas/payment', () => ({
  CreatePaymentSchema: {
    parse: vi.fn((data) => data), // Validasyonu bypass edip veriyi olduğu gibi döndürüyoruz
  },
}));

describe('PaymentResource', () => {
  let resource: PaymentResource;
  let mockClient: HttpClient;
  const fixedDate = new Date('2024-01-01T00:00:00Z');

  beforeEach(() => {
    mockClient = new HttpClient({ apiKey: 'key', secretKey: 'secret', baseUrl: 'url' });
    resource = new PaymentResource(mockClient);

    // Date.now() sabitliyoruz
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('create', () => {
    const minimalRequest = {
      price: '100.0',
      paymentCard: { cardNumber: '123' }, // Schema mocklandığı için minimal veri yeterli
      buyer: { id: 'B1' },
    };

    it('should call client.post with correct URL and merged default values', async () => {
      const mockResponse = { status: 'success', paymentId: '123' };
      (mockClient.post as Mock).mockResolvedValue({ data: mockResponse, error: null });

      await resource.create(minimalRequest as any);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/payment/auth',
        expect.objectContaining({
          price: '100.0',
          locale: 'tr', // Config'den gelen
          currency: Currency.TRY, // Class default
          paymentChannel: PaymentChannel.WEB, // Class default
          paymentGroup: PaymentGroup.PRODUCT, // Class default
        })
      );
    });

    it('should automatically set paidPrice equal to price if not provided', async () => {
      (mockClient.post as Mock).mockResolvedValue({ data: {}, error: null });

      await resource.create({ price: '150.0' } as any);

      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          price: '150.0',
          paidPrice: '150.0',
        })
      );
    });

    it('should NOT overwrite paidPrice if explicitly provided', async () => {
      (mockClient.post as Mock).mockResolvedValue({ data: {}, error: null });

      await resource.create({ price: '100.0', paidPrice: '90.0' } as any);

      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          price: '100.0',
          paidPrice: '90.0',
        })
      );
    });

    it('should generate basketId automatically if not provided', async () => {
      (mockClient.post as Mock).mockResolvedValue({ data: {}, error: null });

      await resource.create({ price: '10.0' } as any);

      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          basketId: 'B' + fixedDate.getTime(),
        })
      );
    });

    it('should return Zod validation errors without making an API call', async () => {
      const validationError = new Error('Invalid Card Number');
      (CreatePaymentSchema.parse as Mock).mockImplementationOnce(() => {
        throw validationError;
      });

      const result = await resource.create({});

      expect(result.data).toBeNull();
      expect(result.error).toBe(validationError);
      expect(mockClient.post).not.toHaveBeenCalled();
    });

    it('should handle API errors returned from HttpClient', async () => {
      const apiError = new Error('Insufficient Funds');
      (mockClient.post as Mock).mockResolvedValue({ data: null, error: apiError });

      const result = await resource.create(minimalRequest as any);

      expect(result.data).toBeNull();
      expect(result.error).toBe(apiError);
    });
  });
});