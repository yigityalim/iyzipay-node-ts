import { z } from "zod";
import { Locale } from "../types/enums.js";

/**
 * Validation schema for BIN number check request.
 *
 * BIN number must be exactly 6 digits.
 */
export const BinNumberSchema = z.object({
	locale: z.nativeEnum(Locale).optional(),
	conversationId: z.string().optional(),
	binNumber: z.string().regex(/^\d{6}$/, "BIN number must be exactly 6 digits"),
});
