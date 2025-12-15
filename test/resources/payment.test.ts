import { describe, it, expect, vi, afterEach } from 'vitest';
import { Iyzipay } from '../../src/core/iyzipay';
import { TestCards } from '../../src/presets/cards';
import { Inputs } from '../../src/utils/builder';
import { ZodError } from 'zod';
import { Currency } from '../../src/types/enums';

const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('Payment Resource', () => {
  const iyzipay = new Iyzipay({
    apiKey: 'key',
    secretKey: 'secret',
    baseUrl: 'https://sandbox-api.iyzipay.com',
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1: Zod Validation Kontrolü
  it('should validate request data before sending (Zod check)', async () => {
    const { error } = await iyzipay.payment.create({
    // @ts-ignore: Price number olarak gönderiliyor (Hata bekleniyor)
      price: 100, 
      paymentCard: TestCards.Success.GarantiDebit,
      buyer: Inputs.buyer({ id: '1', name: 'a', surname: 'b', email: 'a@b.com', identityNumber: '1' }),
      shippingAddress: Inputs.address('addr', 'name'),
      billingAddress: Inputs.address('addr', 'name'),
      basketItems: [Inputs.basketItem('item', '10')],
    });

    // ZodError dönmeli
    expect(error).toBeInstanceOf(ZodError);
    
    // Hatanın detayına bakmaya gerek yok, validation çalıştı mı o önemli.
    // Ama merak ediyorsan console.log(error) yapabilirsin.
  });

  // TEST 2: createQuickTest Kontrolü
  it('should call createQuickTest correctly', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success', paymentId: '123' }),
    });

    const { data, error } = await iyzipay.payment.createQuickTest({
      price: 50,
    });

    if (error) throw error; // Test patlamalı

    expect(data?.paymentId).toBe('123');

    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(callBody.price).toBe('50.00');
    expect(callBody.paymentCard.cardHolderName).toBeDefined();
  });

  // TEST 3: Global Defaults Kontrolü
  it('should merge global defaults with request', async () => {
    const iyzipayWithDefaults = new Iyzipay({
      apiKey: 'key',
      secretKey: 'secret',
      baseUrl: 'url',
      defaults: {
        currency: Currency.EUR, // Default Currency
      },
    });

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' }),
    });

    const result = await iyzipayWithDefaults.payment.create({
      price: '10.00',
      // Currency göndermiyoruz, default'tan (EUR) almalı
      paymentCard: TestCards.Success.AkbankDebit,
      buyer: Inputs.buyer({ id:'1', name:'a', surname:'b', email:'a@b.com', identityNumber:'1' }),
      shippingAddress: Inputs.address('addr', 'name'),
      billingAddress: Inputs.address('addr', 'name'),
      basketItems: [Inputs.basketItem('item', '10')],
    });

    if (result.error) {
        // Hata detayını görelim
        console.error('Test Error:', JSON.stringify(result.error, null, 2));
    }

    expect(result.error).toBeNull(); 
    expect(fetchMock).toHaveBeenCalled();

    const callBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(callBody.currency).toBe(Currency.EUR);
    expect(callBody.paidPrice).toBe('10.00'); // Smart logic kontrolü
  });
});