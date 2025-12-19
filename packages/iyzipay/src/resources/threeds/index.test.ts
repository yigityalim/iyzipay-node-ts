import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { ThreedsInitializeSchema, ThreedsCompleteSchema } from '../../schemas/threeds';
import { Locale, Currency, PaymentChannel, PaymentGroup } from '../../types/enums';
import { ThreedsResource } from '.';
import { HttpClient } from '../../core/http-client';

// --- Mocks ---

vi.mock('../../core/http-client', () => {
  return {
    HttpClient: vi.fn().mockImplementation(() => ({
      config: { defaults: { locale: 'tr' } },
      post: vi.fn(),
    })),
  };
});

// Mock Zod schemas to focus on resource logic
vi.mock('../../schemas/threeds', () => ({
  ThreedsInitializeSchema: {
    parse: vi.fn((data) => data),
  },
  ThreedsCompleteSchema: {
    parse: vi.fn((data) => data),
  },
}));

describe('ThreedsResource', () => {
  let resource: ThreedsResource;
  let mockClient: HttpClient;
  const fixedDate = new Date('2024-01-01T00:00:00Z');

  beforeEach(() => {
    mockClient = new HttpClient({ apiKey: 'key', secretKey: 'secret', baseUrl: 'url' });
    resource = new ThreedsResource(mockClient);

    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  // --- Initialize Tests ---

  describe('initialize', () => {
    const minimalRequest = {
      price: '100.0',
      callbackUrl: 'https://callback.url',
      paymentCard: { cardNumber: '123456' },
      buyer: { id: 'B1' },
    };

    it('should call client.post with correct URL and merged defaults', async () => {
      const mockResponse = { status: 'success', threeDSHtmlContent: '<html>...</html>' };
      (mockClient.post as Mock).mockResolvedValue({ data: mockResponse, error: null });

      await resource.initialize(minimalRequest as any);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/payment/3dsecure/initialize',
        expect.objectContaining({
          price: '100.0',
          locale: 'tr', // From config default
          currency: Currency.TRY, // Class default
          paymentChannel: PaymentChannel.WEB, // Class default
          paymentGroup: PaymentGroup.PRODUCT, // Class default
        })
      );
    });

    it('should set paidPrice to price if missing', async () => {
      (mockClient.post as Mock).mockResolvedValue({ data: {}, error: null });

      await resource.initialize({ price: '50.0' } as any);

      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          price: '50.0',
          paidPrice: '50.0',
        })
      );
    });

    it('should generate basketId if missing', async () => {
      (mockClient.post as Mock).mockResolvedValue({ data: {}, error: null });

      await resource.initialize({ price: '10.0' } as any);

      expect(mockClient.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          basketId: 'B' + fixedDate.getTime(),
        })
      );
    });

    it('should return validation errors', async () => {
      const validationError = new Error('Validation Failed');
      (ThreedsInitializeSchema.parse as Mock).mockImplementationOnce(() => {
        throw validationError;
      });

      const result = await resource.initialize({});

      expect(result.data).toBeNull();
      expect(result.error).toBe(validationError);
      expect(mockClient.post).not.toHaveBeenCalled();
    });
  });

  // --- Complete Tests ---

  describe('complete', () => {
    const completeRequest = {
      paymentId: '12345',
      conversationData: 'some-data',
    };

    it('should call client.post with correct URL', async () => {
      const mockResponse = { status: 'success', paymentStatus: 'SUCCESS' };
      (mockClient.post as Mock).mockResolvedValue({ data: mockResponse, error: null });

      const result = await resource.complete(completeRequest);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/payment/3dsecure/auth',
        completeRequest
      );
      expect(result.data).toBe(mockResponse);
    });

    it('should return validation errors', async () => {
      const validationError = new Error('Invalid Payment ID');
      (ThreedsCompleteSchema.parse as Mock).mockImplementationOnce(() => {
        throw validationError;
      });

      const result = await resource.complete({} as any);

      expect(result.data).toBeNull();
      expect(result.error).toBe(validationError);
      expect(mockClient.post).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const apiError = new Error('Authentication Failed');
      (mockClient.post as Mock).mockResolvedValue({ data: null, error: apiError });

      const result = await resource.complete(completeRequest);

      expect(result.data).toBeNull();
      expect(result.error).toBe(apiError);
    });
  });
});