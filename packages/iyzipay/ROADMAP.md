# 🗺️ Roadmap: iyzipay-node-ts

Bu belge, projenin mevcut durumu ve gelecekteki geliştirme hedeflerini içerir.

> **Vizyon:** Türkiye'nin en modern, Type-Safe ve Geliştirici Deneyimi (DX) odaklı ödeme kütüphanesini ve ekosistemini oluşturmak.

---

## ✅ Faz 1: Core & Mimari (Tamamlandı)
Modern altyapının kurulması ve stabil hale getirilmesi.

- [x] **Core SDK:** Modern `fetch` tabanlı, `axios` bağımlılığı olmayan yapı.
- [x] **Monorepo Architecture:** `pnpm-workspace` ve `Turborepo` ile SDK, Docs ve CLI yönetimi.
- [x] **Type Safety:** Zod şemaları ile %100 Runtime & Compile time type safety.
- [x] **Resource Implementation:** Payment, Cancel, Refund ve Installment (Taksit) kaynakları.
- [x] **DX Helpers:** `TestCards` presetleri ve `Inputs` builder yapısı.
- [x] **Testing:** Vitest ile Unit test altyapısı.

---

## 🚀 Faz 2: Ekosistem Araçları (Tamamlandı v0.1.x)
Geliştiricilerin işini kolaylaştıran yan araçların inşası.

### 📖 Documentation (`apps/docs`)
- [x] **Fumadocs:** Next.js tabanlı, yüksek performanslı ve modern dokümantasyon.
- [x] **Interactive Guides:** "Getting Started", "Payments" ve "Utilities" rehberleri.
- [x] **Content Structure:** Kullanıcı dostu bilgi mimarisi.

### 🛠️ CLI Tool (`apps/cli`)
Geliştirici deneyimini (DX) maksimize eden terminal aracı.
- [x] `iyzi init`: Proje konfigürasyonu ve `.env` oluşturma.
- [x] `iyzi pay`: Hızlı ödeme testi yapma.
- [x] `iyzi cards`: Test kartı sihirbazı (Panoya kopyalama).
- [x] `iyzi check`: Taksit tablosu sorgulama ve görselleştirme.
- [x] `iyzi generate`: React/Next.js için **Checkout Form** (Shadcn/Tailwind) kod üreticisi.
- [x] `iyzi whoami`: API bağlantı ve gecikme (latency) testi.

---

## 🚧 Faz 3: Production Readiness (Sıradaki Hedef)
Kütüphaneyi gerçek dünyada, canlı e-ticaret sitelerinde kullanılabilir hale getirmek.

- [ ] **3D Secure Entegrasyonu:**
    - [ ] `payment.create3dsInitialize`: HTML/Base64 çıktı yönetimi.
    - [ ] `payment.create3dsComplete`: 3D dönüşünü doğrulama ve tamamlama.
- [ ] **Checkout Form (Hosted Page):**
    - [ ] Iyzico Ortak Ödeme Sayfası (Hosted) başlatma desteği.
- [ ] **CI/CD Pipelines:**
    - [ ] GitHub Actions ile her PR'da otomatik test ve lint.
    - [ ] Semantic Release ile otomatik versiyonlama ve changelog.
- [ ] **Advanced CLI:**
    - [ ] **Webhook Tunneling:** `iyzi listen` komutu ile Iyzico webhooklarını `localhost`a yönlendirme (WebSocket).

---

## 🧪 Faz 4: Framework Integrations & Enterprise
Daha spesifik ihtiyaçlar ve pazar yeri özellikleri.

- [ ] **Marketplace (Pazar Yeri) Desteği:** Alt satıcı (Sub-merchant) oluşturma ve para dağıtma özellikleri.
- [ ] **Framework Wrappers:**
    - `iyzipay-next`: Next.js Server Actions ve API Routes için helperlar.
    - `iyzipay-hono`: Edge uyumlu middleware desteği.
- [ ] **Fluent API:** Builder pattern yerine zincirleme metod desteği (`iyzipay.payment.price(100).charge()`).

---

## 🤝 Katkıda Bulunma

Bu proje açık kaynaklıdır ve topluluk katkılarına açıktır. Roadmap üzerindeki bir maddeyi üstlenmek isterseniz lütfen bir Issue açın!