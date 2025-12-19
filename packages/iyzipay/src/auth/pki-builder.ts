/**
 * Generates the PKI (Public Key Infrastructure) string required by Iyzico.
 * * This string is used to generate the hash for V1 authentication (if needed) 
 * or specific verification processes. Iyzico uses a custom serialization format:
 * * @remarks
 * - Arrays are enclosed in square brackets: `[item1, item2]`
 * - Objects are serialized as key-value pairs: `[key=value,key2=value2]`
 * - Recursive structures are supported.
 * - Null or Undefined values are omitted from the string.
 *
 * @param data - The request payload (object, array, or primitive).
 * @returns A formatted string used for hashing/signature generation.
 */
export function generatePkiString(data: unknown): string {
  if (Array.isArray(data)) {
    const items = data.map((item) => generatePkiString(item)).join(', ');
    return `[${items}]`;
  }

  if (typeof data === 'object' && data !== null) {
    const parts: string[] = [];

    for (const key in data) {
      // @ts-expect-error: Safety check is implicitly handled by the loop
      const value = data[key];

      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          parts.push(`${key}=${generatePkiString(value)}`);
        } else {
          parts.push(`${key}=${value}`);
        }
      }
    }

    return `[${parts.join(',')}]`;
  }

  return String(data);
}