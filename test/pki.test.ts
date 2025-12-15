import { describe, it, expect } from 'vitest';
import { generatePkiString } from '../src/auth/pki-builder';

describe('PKI Builder', () => {
  it('should format simple object correctly', () => {
    const data = { name: 'test', id: 123 };
    // Iyzico formatı: [key=value,key2=value2]
    expect(generatePkiString(data)).toBe('[name=test,id=123]');
  });

  it('should format nested object correctly', () => {
    const data = { user: { id: 1 }, role: 'admin' };
    expect(generatePkiString(data)).toBe('[user=[id=1],role=admin]');
  });

  it('should ignore null and undefined', () => {
    const data = { name: 'test', empty: null, missing: undefined };
    expect(generatePkiString(data)).toBe('[name=test]');
  });

  it('should format arrays correctly', () => {
    const data = { items: ['a', 'b'] };
    expect(generatePkiString(data)).toBe('[items=[a, b]]');
  });
});
