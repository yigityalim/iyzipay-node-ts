import { describe, it, expect } from 'vitest'
import { generatePkiString } from './pki-builder';

describe('generatePkiString', () => {
  it('should return string representation of primitive values', () => {
    expect(generatePkiString('hello')).toBe('hello');
    expect(generatePkiString(12345)).toBe('12345');
    expect(generatePkiString(10.5)).toBe('10.5');
    expect(generatePkiString(true)).toBe('true');
    expect(generatePkiString(false)).toBe('false');
  });

  it('should format arrays with comma and space separator', () => {
    expect(generatePkiString(['item1', 'item2'])).toBe('[item1, item2]');
    expect(generatePkiString([1, 2, 3])).toBe('[1, 2, 3]');
    expect(generatePkiString([])).toBe('[]');
  });

  it('should format objects as key=value pairs with comma separator (no space)', () => {
    expect(generatePkiString({ key: 'value' })).toBe('[key=value]');
    expect(generatePkiString({ name: 'John', age: 30 })).toBe('[name=John,age=30]');
    expect(generatePkiString({})).toBe('[]');
  });

  it('should ignore null and undefined values within objects', () => {
    const input = {
      valid: 'data',
      skippedNull: null,
      skippedUndefined: undefined,
      zero: 0,
      emptyString: '',
    };
    expect(generatePkiString(input)).toBe('[valid=data,zero=0,emptyString=]');
  });

  it('should handle nested objects recursively', () => {
    const input = {
      user: {
        id: 1,
        details: {
          role: 'admin',
        },
      },
      active: true,
    };
    expect(generatePkiString(input)).toBe('[user=[id=1,details=[role=admin]],active=true]');
  });

  it('should handle arrays of objects', () => {
    const input = [
      { id: 1, val: 'a' },
      { id: 2, val: 'b' },
    ];
    expect(generatePkiString(input)).toBe('[[id=1,val=a], [id=2,val=b]]');
  });

  it('should handle objects containing arrays', () => {
    const input = {
      basketId: 'B123',
      items: ['apple', 'banana'],
      prices: [10, 20],
    };
    expect(generatePkiString(input)).toBe('[basketId=B123,items=[apple, banana],prices=[10, 20]]');
  });

  it('should handle complex mixed deep structures (Iyzico simulation)', () => {
    const input = {
      locale: 'tr',
      conversationId: '123456789',
      buyer: {
        id: 'BY789',
        name: 'John',
        surname: 'Doe',
        identityNumber: '11111111111',
        email: 'email@email.com',
        gsmNumber: '+905555555555',
        registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
        city: 'Istanbul',
        country: 'Turkey',
      },
      shippingAddress: {
        contactName: 'Jane Doe',
        city: 'Istanbul',
        country: 'Turkey',
      },
      basketItems: [
        {
          id: 'BI101',
          name: 'Binocular',
          category1: 'Collectibles',
          price: 250.5,
        },
        {
          id: 'BI102',
          name: 'Game Code',
          category1: 'Game',
          price: 100,
        },
      ],
    };

    const expected =
      '[locale=tr,conversationId=123456789,' +
      'buyer=[id=BY789,name=John,surname=Doe,identityNumber=11111111111,email=email@email.com,gsmNumber=+905555555555,registrationAddress=Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1,city=Istanbul,country=Turkey],' +
      'shippingAddress=[contactName=Jane Doe,city=Istanbul,country=Turkey],' +
      'basketItems=[[id=BI101,name=Binocular,category1=Collectibles,price=250.5], [id=BI102,name=Game Code,category1=Game,price=100]]]';

    expect(generatePkiString(input)).toBe(expected);
  });
});