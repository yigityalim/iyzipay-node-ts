export const SHADCN_TEMPLATE = `
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IyzipayValidators } from 'iyzipay-node-ts';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  cardHolderName: z.string().min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
  cardNumber: IyzipayValidators.creditCard,
  expireDate: z.string().regex(/^(0[1-9]|1[0-2])\\/?([0-9]{2})$/, 'AA/YY formatında giriniz'),
  cvc: z.string().length(3, 'CVC 3 haneli olmalıdır'),
  identityNumber: IyzipayValidators.tcKimlikNo,
});

export function PaymentForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardHolderName: '',
      cardNumber: '',
      expireDate: '',
      cvc: '',
      identityNumber: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Ödeme Başlatılıyor:', values);
    // Buradan API route'unuza istek atabilirsiniz.
    // en: Send to your API route
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md border p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Güvenli Ödeme</h2>
        
        <FormField
          control={form.control}
          name="cardHolderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kart Sahibi</FormLabel>
              <FormControl>
                <Input placeholder="Ad Soyad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kart Numarası</FormLabel>
              <FormControl>
                <Input placeholder="0000 0000 0000 0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expireDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Son Kullanma (AA/YY)</FormLabel>
                <FormControl>
                  <Input placeholder="12/30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cvc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVC</FormLabel>
                <FormControl>
                  <Input placeholder="123" maxLength={3} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">Ödemeyi Tamamla</Button>
      </form>
    </Form>
  );
}
`;

export const TAILWIND_TEMPLATE = `
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { IyzipayValidators } from 'iyzipay-node-ts';

const formSchema = z.object({
  cardHolderName: z.string().min(3, 'Ad Soyad en az 3 karakter olmalıdır'),
  cardNumber: IyzipayValidators.creditCard,
  expireDate: z.string().regex(/^(0[1-9]|1[0-2])\\/?([0-9]{2})$/, 'AA/YY formatında giriniz'),
  cvc: z.string().length(3, 'CVC 3 haneli olmalıdır'),
});

export function PaymentForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (data: any) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md p-6 border rounded-lg">
      <h2 className="text-lg font-bold">Ödeme Formu</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Kart Sahibi</label>
        <input 
          {...register('cardHolderName')} 
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
          placeholder="Ad Soyad" 
        />
        {errors.cardHolderName && <p className="text-red-500 text-xs mt-1">{String(errors.cardHolderName.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Kart Numarası</label>
        <input 
          {...register('cardNumber')} 
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
          placeholder="0000 0000 0000 0000" 
        />
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{String(errors.cardNumber.message)}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">SKT (AA/YY)</label>
          <input 
            {...register('expireDate')} 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="12/30" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">CVC</label>
          <input 
            {...register('cvc')} 
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="123" 
          />
        </div>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Öde
      </button>
    </form>
  );
}
`;
