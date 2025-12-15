import { Iyzipay, Inputs, TestCards, IyzipayErrorCode } from '../src/index.js';

async function main() {
  console.log('🚀 Iyzico Sandbox Test Başlatılıyor...');

  const iyzipay = Iyzipay.fromEnv();

  console.log('💳 Ödeme isteği');

  // Hızlıca test verisi oluşturuyoruz
  const buyer = Inputs.buyer({
    id: 'USER-123',
    name: 'Namık',
    surname: 'Korona',
    identityNumber: '11111111111',
    email: 'namik@test.com'
  });

  const address = Inputs.address('Nidakule Göztepe, Kadıköy', 'Namık Korona');

  // ÖDEME İSTEĞİ (Zod Validation + HTTP Request)
  const { data, error } = await iyzipay.payment.create({
    price: '100.00',
    paidPrice: '100.00',
    currency: 'TRY',
    basketId: 'B' + Date.now(),
    
    // 1. Inputs Helper ile Kart (Manuel giriş)
    /* paymentCard: Inputs.card({
        cardHolderName: 'Test User',
        cardNumber: '...',
        expireMonth: '12',
        expireYear: '2030',
        cvc: '123'
    }), 
    */

    // 2. VEYA Preset (Hazır Test Kartı) Kullanımı:
    paymentCard: TestCards.Success.GarantiDebit,

    buyer: buyer,
    shippingAddress: address,
    billingAddress: address,
    
    basketItems: [
      Inputs.basketItem('Mavi Ayakkabı', '100.00', 'Giyim')
    ]
  });

  // HATA YÖNETİMİ
  if (error) {
    console.error('❌ Hata Oluştu!');
    console.error('Mesaj:', error.message);
    
    // Enum kullanımı (Type-Safe Hata Kontrolü)
    if ('errorCode' in error && error.errorCode === IyzipayErrorCode.NOT_SUFFICIENT_FUNDS) {
        console.warn('⚠️ Bakiyeniz yetersiz.');
    }
    return;
  }

  // BAŞARI
  console.log('✅ ÖDEME BAŞARILI!');
  console.log('--------------------------------');
  console.log('Payment ID:', data.paymentId);
  console.log('Tutar:', data.price + ' ' + data.currency);
  console.log('Kart Ailesi:', data.cardFamily);
  console.log('--------------------------------');
  console.log("RAW RESPONSE:", data);
}

main();