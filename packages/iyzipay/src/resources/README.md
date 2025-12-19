# Resource Organization

## Domain-Based Structure

```
resources/
├── payment/          # Payment operations (create, preAuth, postAuth)
├── threeds/          # 3D Secure (existing: threeds.ts)
├── checkout/         # Checkout Form (existing: checkout-form.ts)
├── subscription/     # Subscription system
│   ├── index.ts      # Main subscription resource
│   └── customer.ts   # Customer management
├── marketplace/      # Marketplace features
│   ├── index.ts      # Approval, cross-booking, payout
│   └── sub-merchant.ts
├── card/             # Card storage
├── apm/              # Alternative payment methods (BKM, Pecco)
├── transaction/      # Cancel, Refund (existing files)
└── utils/            # Installments, BIN check (existing files)
```

## Migration Strategy

**Existing resources (keep as-is):**
- `payment.ts` → Will move to `payment/index.ts` later
- `refund.ts` → Will move to `transaction/refund.ts` later
- `cancel.ts` → Will move to `transaction/cancel.ts` later
- `threeds.ts` → Will move to `threeds/index.ts` later
- `checkout-form.ts` → Will move to `checkout/index.ts` later
- `bin-number.ts` → Will move to `utils/bin-number.ts` later
- `installments.ts` → Will move to `utils/installments.ts` later

**New resources (use new structure):**
- Subscription → `subscription/index.ts`
- Sub-merchant → `marketplace/sub-merchant.ts`
- Card storage → `card/index.ts`
- APM → `apm/index.ts`

## Benefits

- ✅ Scalable to 50+ resources
- ✅ Logical grouping
- ✅ Easier navigation
- ✅ Related code together
- ✅ Clear separation of concerns
