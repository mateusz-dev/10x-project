﻿import { z } from "zod";
import type { AcceptFlashcardAction } from "../../types";

export const flashcardsListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sort_by: z.enum(["created_at", "updated_at", "last_studied_at", "next_review_at"]).default("created_at"),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
  origin_type: z.enum(["manual", "ai_generated_original", "ai_generated_edited"] as const).optional(),
});

export type FlashcardsListQueryParams = z.infer<typeof flashcardsListQuerySchema>;

export const acceptFlashcardSchema = z
  .object({
    temp_id: z.string().uuid(),
    action: z.enum(["original", "edited", "reject"] as const satisfies readonly AcceptFlashcardAction[]),
    front: z.string().max(1000).optional(),
    back: z.string().max(1000).optional(),
  })
  .refine(
    (data) => {
      if (data.action === "reject") return true;
      return data.front != null && data.back != null;
    },
    {
      message: "front and back are required when action is accept_original or accept_edited",
      path: ["front", "back"],
    }
  );

export const acceptFlashcardsCommandSchema = z.object({
  flashcards: z.array(acceptFlashcardSchema).min(1),
});
