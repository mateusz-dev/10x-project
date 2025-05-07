/// <reference types="astro/client" />
import type { APIRoute } from "astro";
import type { APIContext } from "../../../../types";
import { acceptFlashcardsCommandSchema } from "../../../../lib/schemas/flashcards";
import { acceptFlashcards } from "../../../../lib/services/generation-sessions";
import { logger } from "../../../../lib/utils/logger";

export const prerender = false;

export const POST: APIRoute = async ({ params, request, locals }: APIContext) => {
  try {
    // Early auth check
    const { user, supabase } = locals;

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Validate session ID
    const { id: sessionId } = params;
    if (!sessionId || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionId)) {
      return new Response("Invalid session ID", { status: 400 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = acceptFlashcardsCommandSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: validationResult.error.issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Process flashcards
    const result = await acceptFlashcards(supabase, sessionId, user.id, validationResult.data);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error("Error processing flashcards acceptance:", errorMessage);

    if (error instanceof Error && error.message === "Session not found") {
      return new Response("Session not found", { status: 404 });
    }

    return new Response("Internal server error", { status: 500 });
  }
};
