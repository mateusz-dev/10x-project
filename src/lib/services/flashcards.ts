import type { SupabaseClient } from "@supabase/supabase-js";
import type { FlashcardsListResponseDto, FlashcardDto } from "../../types";
import type { FlashcardsListQueryParams } from "../schemas/flashcards";
import { logger } from "../utils/logger";

export const getFlashcards = async (
  supabase: SupabaseClient,
  userId: string,
  params: FlashcardsListQueryParams,
  correlationId?: string
): Promise<FlashcardsListResponseDto> => {
  const startTime = performance.now();
  const { page, limit, sort_by, sort_order, origin_type } = params;
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  logger.info("flashcards-service", "Fetching flashcards", {
    correlationId,
    userId: userId.slice(0, 8),
    queryParams: { page, limit, sort_by, sort_order, origin_type },
  });

  try {
    let query = supabase
      .from("flashcards")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order(sort_by, { ascending: sort_order === "asc" })
      .range(start, end);

    if (origin_type) {
      query = query.eq("origin_type", origin_type);
    }

    const { data, count, error } = await query;

    if (error) {
      logger.error("flashcards-service", "Database query failed", {
        correlationId,
        error: error.message,
        code: error.code,
        queryParams: { page, limit, sort_by, sort_order, origin_type },
      });
      throw new Error(`Failed to fetch flashcards: ${error.message}`);
    }

    const endTime = performance.now();
    logger.info("flashcards-service", "Successfully fetched flashcards", {
      correlationId,
      durationMs: Math.round(endTime - startTime),
      resultCount: data?.length ?? 0,
      totalCount: count ?? 0,
    });

    const total = count ?? 0;
    const pages = Math.ceil(total / limit);

    return {
      data: data as FlashcardDto[],
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    };
  } catch (error) {
    logger.error("flashcards-service", "Unexpected error", {
      correlationId,
      error: error instanceof Error ? error.message : "Unknown error",
      queryParams: { page, limit, sort_by, sort_order, origin_type },
    });
    throw error;
  }
};
