import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { CreateCancelSchema } from '../../schemas/cancel';
import { HttpClient } from '../../core/http-client';
import { CancelResource } from './cancel';

// --- Mocks ---

vi.mock('../../core/http-client', () => {
  return {
    HttpClient: vi.fn().mockImplementation(() => ({
      post: vi.fn(),
    })),
  };
});

vi.mock('../../schemas/cancel', () => ({
  CreateCancelSchema: {
    parse: vi.fn((data) => data),
  },
}));

describe('CancelResource', () => {
  let resource: CancelResource;
  let mockClient: HttpClient;

  beforeEach(() => {
    mockClient = new HttpClient({ apiKey: 'key', secretKey: 'secret', baseUrl: 'url' });
    resource = new CancelResource(mockClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    const cancelRequest = {
      locale: 'tr',
      conversationId: '123456',
      paymentId: 'PAY-123',
      ip: '127.0.0.1',
    };

    it('should call client.post with correct URL and validated data', async () => {
      const mockResponse = { status: 'success', paymentId: 'PAY-123' };
      (mockClient.post as Mock).mockResolvedValue({ data: mockResponse, error: null });

      const result = await resource.create(cancelRequest as any);

      expect(mockClient.post).toHaveBeenCalledWith(
        '/payment/cancel',
        cancelRequest
      );
      expect(result.data).toBe(mockResponse);
      expect(result.error).toBeNull();
    });

    it('should return Zod validation errors immediately', async () => {
      const validationError = new Error('Invalid Payment ID');
      (CreateCancelSchema.parse as Mock).mockImplementationOnce(() => {
        throw validationError;
      });

      const result = await resource.create({} as any);

      expect(result.data).toBeNull();
      expect(result.error).toBe(validationError);
      expect(mockClient.post).not.toHaveBeenCalled();
    });

    it('should handle API errors returned from HttpClient', async () => {
      const apiError = new Error('Payment not found');
      (mockClient.post as Mock).mockResolvedValue({ data: null, error: apiError });

      const result = await resource.create(cancelRequest as any);

      expect(result.data).toBeNull();
      expect(result.error).toBe(apiError);
    });
  });
});