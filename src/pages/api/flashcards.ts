import type { APIRoute } from "astro";
import { flashcardsListQuerySchema } from "../../lib/schemas/flashcards";
import { getFlashcards } from "../../lib/services/flashcards";
import { logger } from "../../lib/utils/logger";
import { randomUUID } from "crypto";
import { SampleUserId } from "@/db/supabase.client";

export const prerender = false;

export const GET: APIRoute = async ({ url, locals }) => {
  const correlationId = randomUUID();
  const startTime = performance.now();

  try {
    const { supabase } = locals;

    logger.info("flashcards-api", "Processing request", {
      correlationId,
      path: url.pathname,
      query: Object.fromEntries(url.searchParams),
    });

    //TODO: Uncomment and implement authentication middleware
    // if (!user) {
    //   logger.warn("flashcards-api", "Unauthorized request", {
    //     correlationId,
    //     path: url.pathname,
    //   });
    //   return new Response(JSON.stringify({ message: "Unauthorized" }), {
    //     status: 401,
    //     headers: { "Content-Type": "application/json" },
    //   });
    // }

    const params = Object.fromEntries(url.searchParams);
    const result = flashcardsListQuerySchema.safeParse(params);

    if (!result.success) {
      logger.warn("flashcards-api", "Invalid request parameters", {
        correlationId,
        validation_errors: result.error.format(),
      });
      return new Response(
        JSON.stringify({
          message: "Invalid parameters",
          errors: result.error.format(),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const response = await getFlashcards(supabase, SampleUserId, result.data, correlationId);
    const endTime = performance.now();

    logger.info("flashcards-api", "Request completed successfully", {
      correlationId,
      durationMs: Math.round(endTime - startTime),
      resultCount: response.data.length,
      totalCount: response.pagination.total,
    });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Correlation-ID": correlationId,
      },
    });
  } catch (error) {
    const endTime = performance.now();
    logger.error("flashcards-api", "Request failed", {
      correlationId,
      error: error instanceof Error ? error.message : "Unknown error",
      durationMs: Math.round(endTime - startTime),
    });

    return new Response(
      JSON.stringify({
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "X-Correlation-ID": correlationId,
        },
      }
    );
  }
};
