import { describe, it, expect } from 'vitest';
import { IyzipayError } from './iyzipay-error';

describe('IyzipayError', () => {
  it('should be an instance of Error and IyzipayError', () => {
    const error = new IyzipayError({ status: 'failure' });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(IyzipayError);
  });

  it('should set the error name correctly', () => {
    const error = new IyzipayError({ status: 'failure' });
    expect(error.name).toBe('IyzipayError');
  });

  it('should map all properties from the response correctly', () => {
    const mockResponse = {
      status: 'failure' as const,
      errorCode: '10051',
      errorMessage: 'Card limit insufficient',
      errorGroup: 'NOT_SUFFICIENT_FUNDS',
      locale: 'tr',
      conversationId: '123456',
      systemTime: 1672531200000,
    };

    const error = new IyzipayError(mockResponse);

    expect(error.status).toBe(mockResponse.status);
    expect(error.errorCode).toBe(mockResponse.errorCode);
    expect(error.errorMessage).toBe(mockResponse.errorMessage);
    expect(error.message).toBe(mockResponse.errorMessage); // inherited message
    expect(error.errorGroup).toBe(mockResponse.errorGroup);
    expect(error.locale).toBe(mockResponse.locale);
    expect(error.conversationId).toBe(mockResponse.conversationId);
    expect(error.systemTime).toBe(mockResponse.systemTime);
  });

  it('should use default message when errorMessage is missing', () => {
    const error = new IyzipayError({ status: 'failure' });
    expect(error.message).toBe('Unknown Iyzipay Error');
  });

  it('should handle optional fields being undefined', () => {
    const minimalResponse = { status: 'failure' } as const;
    const error = new IyzipayError(minimalResponse);

    expect(error.errorCode).toBeUndefined();
    expect(error.errorGroup).toBeUndefined();
    expect(error.conversationId).toBeUndefined();
    expect(error.systemTime).toBeUndefined();
  });

  it('should capture the stack trace', () => {
    const error = new IyzipayError({ status: 'failure' });
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });

  it('should verify prototype chain integrity', () => {
    // This ensures Object.setPrototypeOf worked as expected
    const error = new IyzipayError({ status: 'failure' });

    const proto = Object.getPrototypeOf(error);
    expect(proto).toBe(IyzipayError.prototype);
    
    const parentProto = Object.getPrototypeOf(proto);
    expect(parentProto).toBe(Error.prototype);
  });
});