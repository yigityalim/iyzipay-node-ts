import type { IyzipayResponse } from '../types/index.js';

export class IyzipayError extends Error {
  public status: string;
  public errorCode?: string;
  public errorMessage?: string;
  public errorGroup?: string;
  public locale?: string;
  public conversationId?: string;
  public systemTime?: number;

  constructor(response: IyzipayResponse) {
    super(response.errorMessage || 'Unknown Iyzipay Error');

    this.name = 'IyzipayError';
    Object.setPrototypeOf(this, IyzipayError.prototype);

    this.status = response.status;
    this.errorCode = response.errorCode;
    this.errorMessage = response.errorMessage;
    this.errorGroup = response.errorGroup;
    this.locale = response.locale;
    this.conversationId = response.conversationId;
    this.systemTime = response.systemTime;
  }
}
