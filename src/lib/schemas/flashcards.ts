import { z } from "zod";

export const flashcardsListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort_by: z.enum(["created_at", "updated_at", "last_studied_at", "next_review_at"]).default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
  origin_type: z.enum(["manual", "ai_generated_original", "ai_generated_edited"] as const).optional(),
});

export type FlashcardsListQueryParams = z.infer<typeof flashcardsListQuerySchema>;
