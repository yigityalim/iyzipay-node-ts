# 🚀 iyzipay-node-ts

![NPM Version](https://img.shields.io/npm/v/iyzipay-node-ts)
![License](https://img.shields.io/npm/l/iyzipay-node-ts)
![Downloads](https://img.shields.io/npm/dt/iyzipay-node-ts)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)

**The Modern, Type-Safe, and Edge-Ready Iyzico Client.** Designed for **Next.js**, **Cloudflare Workers**, **Bun**, and modern Node.js backends.

> ⚠️ **Unofficial Client:** This package is not affiliated with Iyzico. It is an open-source initiative to provide a better Developer Experience (DX).

---

## ✨ Why this package?

The official Iyzico library relies on legacy modules (`request`, `fs`), has no proper TypeScript support, and is bloated. **iyzipay-node-ts** changes the game:

- 🛡️ **Full Type Safety:** Inputs & Outputs are fully typed with Zod schemas.
- ⚡ **Edge Ready:** Zero dependencies. Uses native `fetch`. Runs on Vercel Edge, Cloudflare, etc.
- 🛠️ **DX First:** Includes **Builders**, **Test Card Presets**, and **Validators**.
- 🇹🇷 **Local Helpers:** Built-in **TCKN (Turkish ID)** and **Luhn (Credit Card)** validators.
- 🔐 **Secure:** Automatic Webhook signature verification & Browser-Usage Guard.

---

## 📦 Installation

```bash
pnpm add iyzipay-node-ts
# or
npm install iyzipay-node-ts
# or
bun add iyzipay-node-ts
````

-----

## ⚡ Quick Start

### 1\. Initialize Client

Use the modern factory function `createClient` or `iyzipay`:

```typescript
import { createClient } from 'iyzipay-node-ts';

const client = createClient({
  apiKey: process.env.IYZICO_API_KEY!,
  secretKey: process.env.IYZICO_SECRET_KEY!,
  baseUrl: process.env.IYZICO_BASE_URL || '[https://sandbox-api.iyzipay.com](https://sandbox-api.iyzipay.com)',
});
```

### 2\. Create Payment (The Modern Way)

Forget writing 50 lines of boilerplate JSON. Use **Inputs Builder** and **Test Presets**:

```typescript
import { Inputs, TestCards, Currency, PaymentGroup } from 'iyzipay-node-ts';

const { data, error } = await client.payment.create({
  price: '100.00',
  currency: Currency.TRY,
  paymentGroup: PaymentGroup.PRODUCT,
  
  // ⚡ Use a Preset Card (No need to search PDFs for test numbers)
  paymentCard: TestCards.Success.GarantiDebit, 
  
  // 🛠️ Use Builder to auto-fill bureaucratic fields (IP, City, etc.)
  buyer: Inputs.buyer({
    id: 'USER-123',
    name: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    identityNumber: '11111111111'
  }),
  shippingAddress: Inputs.address('Nidakule Göztepe', 'John Doe'),
  billingAddress: Inputs.address('Nidakule Göztepe', 'John Doe'),
  basketItems: [
    Inputs.basketItem('Nike Air Jordan', '100.00', 'Shoes')
  ]
});

if (error) {
  console.error('Payment Failed:', error.errorMessage);
} else {
  console.log('Success! Payment ID:', data.paymentId);
}
```

-----

## 🧰 Superpowers (Utilities)

### 🇹🇷 Validators (TCKN & Credit Card)

Don't install extra packages. We built them in with **Zod**.

```typescript
import { IyzipayValidators } from 'iyzipay-node-ts';
import { z } from 'zod';

const CheckoutForm = z.object({
  fullName: z.string(),
  // Validates Turkish ID Number algorithm (Mod 10)
  identityNumber: IyzipayValidators.tcKimlikNo, 
  // Validates Credit Card Checksum (Luhn Algorithm)
  cardNumber: IyzipayValidators.creditCard,     
});

// Example Usage
CheckoutForm.parse({ identityNumber: "11111111110" }); // Throws ZodError if invalid
```

### 🧪 Test Card Presets

IntelliSense will show you all available test cards.

```typescript
import { TestCards } from 'iyzipay-node-ts';

// Success Scenarios
TestCards.Success.AkbankCredit
TestCards.Success.GarantiAmex

// Error Scenarios (Test your error handling)
TestCards.Errors.InsufficientFunds  // Returns Error 10051
TestCards.Errors.StolenCard         // Returns Error 10043
```

### 🪝 Webhook Verification

Secure your endpoints easily.

```typescript
import { verifyWebhookSignature } from 'iyzipay-node-ts';

// In your API Route / Controller
const isValid = await verifyWebhookSignature({
  secretKey: process.env.IYZICO_SECRET_KEY!,
  body: JSON.stringify(req.body), // Raw body string
  signature: req.headers['x-iyz-signature']
});

if (!isValid) throw new Error('Invalid Webhook Signature');
```

-----

## 🗺️ Roadmap & Vision

We aim to build a complete ecosystem around Iyzico for Node.js developers.
Check out our [ROADMAP.md](https://www.google.com/search?q=./ROADMAP.md) for upcoming features like CLI and Documentation App.

## 🤝 Contributing

Contributions are welcome\! Please read our [contributing guidelines](https://www.google.com/search?q=CONTRIBUTING.md).

## 📄 License

MIT © [Mehmet Yiğit Yalım](https://www.google.com/search?q=https://github.com/mehmetyigityalim)