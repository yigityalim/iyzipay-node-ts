# Modern Iyzipay Client for Node.js (Unofficial)

![CI](https://github.com/kullaniciadi/repo/actions/workflows/ci.yml/badge.svg)
![NPM Version](https://img.shields.io/npm/v/iyzipay-node-ts)
![License](https://img.shields.io/npm/l/iyzipay-node-ts)

A lightweight, type-safe, and edge-ready TypeScript client for Iyzico Payment API.
Designed for Next.js, Cloudflare Workers, and modern Node.js backends.

## Why this package?

The official Iyzico library relies on legacy Node.js modules (`fs`, `request`) and lacks proper TypeScript support. This package solves these issues:

- 🚀 **Edge Compatible:** Works on Vercel Edge, Cloudflare Workers, and Node.js 18+.
- 📦 **Zero Dependencies:** Uses native `fetch` API. No bloat.
- 💎 **Type-Safe:** Written in TypeScript with complete Zod schemas (Coming Soon).
- 🧩 **Tree-Shakeable:** Import only what you need.

## Installation

```bash
pnpm add iyzipay-node-ts
# or
npm install iyzipay-node-ts
# or
yarn add iyzipay-node-ts
# or
bun add iyzipay-node-ts
```

## Usage

```ts
import { Iyzipay } from 'iyzipay-node-ts';

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZIPAY_API_KEY,
  secretKey: process.env.IYZIPAY_SECRET_KEY,
  baseUrl: 'https://sandbox-api.iyzipay.com', // or 'https://api.iyzipay.com' for production
});

// Create a payment
const result = await iyzipay.payment.create({
  // ... fully typed parameters
});

console.log(result);
```

## Disclaimer

This package is not affiliated with Iyzico. Use at your own risk.

## License

MIT

## Author

Mehmet Yiğit Yalım <email@mehmetyigityalim.com>

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) for more information.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

## Sponsor

If you find this package useful, consider sponsoring the developer:

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Donate%20to%20the%20developer-ff69b4)](https://www.buymeacoffee.com/mehmetyigityalim)

## Support

If you have any questions or need help, please open an issue on GitHub.
