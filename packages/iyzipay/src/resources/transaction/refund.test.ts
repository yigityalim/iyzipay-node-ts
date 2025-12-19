import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { CreateRefundSchema } from '../../schemas';
import { HttpClient } from '../../core/http-client';
import { RefundResource } from './refund';

// --- Mocks ---

// HttpClient Mock
vi.mock('../../core/http-client', () => {
  return {
    HttpClient: vi.fn().mockImplementation(() => ({
      post: vi.fn(),
    })),
  };
});

// Zod Schema Mock
vi.mock('../../schemas', () => ({
  CreateRefundSchema: {
    parse: vi.fn((data) => data),
  },
}));

describe('RefundResource', () => {
  let resource: RefundResource;
  let mockClient: HttpClient;

  beforeEach(() => {
    mockClient = new HttpClient({ apiKey: 'key', secretKey: 'secret', baseUrl: 'url' });
    resource = new RefundResource(mockClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    const refundRequest = {
      locale: 'tr',
      conversationId: '123456',
      paymentTransactionId: '1',
      price: '10.0',
      ip: '127.0.0.1',
    };

    it('should call client.post with correct URL and validated data', async () => {
      const mockResponse = { status: 'success', paymentId: 'PAY-123', price: '10.0' };
      (mockClient.post as Mock).mockResolvedValue({ data: mockResponse, error: null });

      const result = await resource.create(refundRequest as any);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/payment/refund',
        refundRequest
      );
      expect(result.data).toBe(mockResponse);
      expect(result.error).toBeNull();
    });

    it('should return Zod validation errors immediately', async () => {
      const validationError = new Error('Invalid Transaction ID');
      (CreateRefundSchema.parse as Mock).mockImplementationOnce(() => {
        throw validationError;
      });

      const result = await resource.create({} as any);

      expect(result.data).toBeNull();
      expect(result.error).toBe(validationError);
      expect(mockClient.post).not.toHaveBeenCalled();
    });

    it('should handle API errors returned from HttpClient', async () => {
      const apiError = new Error('Refund failed');
      (mockClient.post as Mock).mockResolvedValue({ data: null, error: apiError });

      const result = await resource.create(refundRequest as any);

      expect(result.data).toBeNull();
      expect(result.error).toBe(apiError);
    });
  });
});