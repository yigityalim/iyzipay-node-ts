import { z } from "zod";

export const CreateInstallmentInfoSchema = z.object({
	locale: z.enum(["tr", "en"]).optional().default("tr"),
	conversationId: z.string().optional(),
	binNumber: z.string().min(6).max(8), // Kartın ilk 6 hanesi
	price: z.string().min(1), // Sorgulanacak tutar
});

export type CreateInstallmentInfoRequest = z.infer<
	typeof CreateInstallmentInfoSchema
>;
