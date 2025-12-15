import { describe, it, expect } from 'vitest';
import { Inputs } from '../../src/utils/builder';

describe('Inputs Builder', () => {
  it('should create a buyer with default values', () => {
    const buyer = Inputs.buyer({
      id: '123',
      name: 'Test',
      surname: 'User',
      email: 'test@test.com',
      identityNumber: '11111111111',
    });

    expect(buyer.ip).toBe('85.34.78.112'); // Default IP kontrolü
    expect(buyer.city).toBe('Istanbul'); // Default Şehir
    expect(buyer.id).toBe('123');
  });

  it('should override default values if provided', () => {
    const buyer = Inputs.buyer({
      id: '123',
      name: 'Test',
      surname: 'User',
      email: 'test@test.com',
      identityNumber: '11111111111',
      ip: '1.1.1.1', // Override
      city: 'Ankara', // Override
    });

    expect(buyer.ip).toBe('1.1.1.1');
    expect(buyer.city).toBe('Ankara');
  });

  it('should create an address correctly', () => {
    const address = Inputs.address('Kızılay, Ankara', 'Ahmet');
    expect(address.address).toBe('Kızılay, Ankara');
    expect(address.contactName).toBe('Ahmet');
    expect(address.country).toBe('Turkey');
  });

  it('should create a basket item with random ID', () => {
    const item1 = Inputs.basketItem('Item 1', '10.00');
    const item2 = Inputs.basketItem('Item 2', '20.00');

    expect(item1.price).toBe('10.00');
    expect(item1.id).toContain('BI');
    expect(item1.id).not.toBe(item2.id); // ID'lerin farklı olduğunu doğrula
  });
});