# 🗺️ Roadmap: iyzipay-node-ts

Bu belge, projenin mevcut durumu ve gelecekteki geliştirme hedeflerini içerir.

> **Vizyon:** Türkiye'nin en modern, Type-Safe ve Geliştirici Deneyimi (DX) odaklı ödeme kütüphanesini ve ekosistemini oluşturmak.

---

## 🚀 Faz 1: Temel ve Stabilite (Mevcut Durum v0.1.x)
İlk sürümün kararlı hale getirilmesi ve topluluktan geri bildirim toplanması.

- [x] **Core SDK:** Modern `fetch` tabanlı, `axios` bağımlılığı olmayan yapı.
- [x] **Type Safety:** Zod şemaları ile %100 Runtime & Compile time type safety.
- [x] **DX Helpers:** `TestCards` presetleri ve `Inputs` builder yapısı.
- [x] **Testing:** Vitest ile %95+ test coverage (Unit & Integration).
- [ ] **CI/CD:** GitHub Actions ile otomatik test ve lint süreçleri.
- [ ] **Examples:** Next.js App Router (Server Actions) ve Cloudflare Workers örnekleri.

---

## 🏗️ Faz 2: Mimari Dönüşüm (Monorepo & Turborepo)
Proje büyüdükçe CLI ve Dokümantasyon uygulamalarını yönetmek için "Monorepo" yapısına geçiş.

- [ ] **Workspace Migration:** Projeyi `pnpm-workspace` ve `Turborepo` yapısına taşıma.
  - `packages/iyzipay-node-ts`: Ana SDK.
  - `packages/eslint-config`: Ortak lint ayarları.
  - `packages/tsconfig`: Ortak TypeScript ayarları.
- [ ] **Versioning:** `semantic-release` yerine Monorepo dostu **Changesets** kurulumu.
- [ ] **Shared Types:** Tip tanımlarının paketler arası paylaşımı.

---

## 📚 Faz 3: Ekosistem Genişlemesi
Sadece bir SDK değil, geliştiricilerin hayatını kolaylaştıran araçlar bütünü.

### 📖 Documentation App (`apps/docs`)
- [ ] **Nextra / Docusaurus:** Markdown tabanlı, interaktif dokümantasyon sitesi.
- [ ] **Live Playground:** Tarayıcı üzerinden (StackBlitz/CodeSandbox gömülü) API deneme alanı.
- [ ] **Interactive Error Codes:** Hata kodlarını ve çözümlerini içeren arama motoru.

### 🛠️ CLI Tool (`apps/cli`)
Terminalden çıkmadan Iyzico işlemlerini yönetmek için.
- [ ] `npx iyzipay init`: Projeye config oluşturma.
- [ ] `npx iyzipay verify`: API anahtarlarını doğrulama.
- [ ] `npx iyzipay test`: Sandbox ortamında hızlıca test ödemesi oluşturma.
- [ ] **Webhook Tunneling:** (Stripe CLI benzeri) Yerel geliştirme ortamına webhook yönlendirme.

---

## 🧪 Faz 4: İleri Seviye Özellikler (Ar-Ge)

- [ ] **Fluent API:** Builder pattern yerine zincirleme metod desteği.
  ```ts
  await iyzipay.payment.amount(100).currency('TRY').charge();
````

  - [ ] **Framework Specific Wrappers:**
      - `iyzipay-next`: Next.js Server Actions için hazır helperlar.
      - `iyzipay-hono`: Hono.js middleware desteği.

-----

## 🤝 Katkıda Bulunma

Bu yol haritasındaki maddelerden birini üstlenmek isterseniz, lütfen bir Issue açarak belirtin\!