/**
 * Generates the PKI (Public Key Infrastructure) string required by Iyzico.
 * * Iyzico uses a custom serialization format for its authentication headers:
 * - Arrays are enclosed in square brackets: [item1, item2]
 * - Objects are serialized as key-value pairs: [key=value,key2=value2]
 * - Recursive structures are supported.
 * - Null or Undefined values are omitted.
 *
 * @param data - The request payload (object or array).
 * @returns A formatted string used for hashing.
 */
export function generatePkiString(data: unknown): string {
  // Case 1: Handle Arrays
  // Example: ["a", "b"] -> "[a, b]"
  if (Array.isArray(data)) {
    const items = data.map((item) => generatePkiString(item)).join(', ');
    return `[${items}]`;
  }

  // Case 2: Handle Objects
  // Example: { id: 1, name: "test" } -> "[id=1,name=test]"
  if (typeof data === 'object' && data !== null) {
    // Iyzico requires specific formatting for numbers (e.g. Price)
    // but usually, raw JSON value is enough for the PKI string if it matches the body.

    const parts: string[] = [];

    // We must iterate over keys. Order matters in some implementations,
    // but JS objects do not guarantee order.
    // However, Iyzico's V2 auth usually relies on the JSON body string,
    // while V1 relies on this PKI string.
    for (const key in data) {
      // @ts-expect-error: Safety check for key existence is implicitly handled by loop
      const value = data[key];

      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          // Recursive call for nested objects
          parts.push(`${key}=${generatePkiString(value)}`);
        } else {
          // Primitives (String, Number, Boolean)
          parts.push(`${key}=${value}`);
        }
      }
    }

    // Join with comma. Note: Iyzico does NOT use space after comma for object properties.
    return `[${parts.join(',')}]`;
  }

  // Case 3: Primitives
  // Simply return the string representation
  return String(data);
}
