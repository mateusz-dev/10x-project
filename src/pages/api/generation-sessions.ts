import type { APIRoute } from "astro";
import { z } from "zod";
import { createGenerationSession, GenerationError } from "../../lib/services/generation-sessions";
import { SampleUserId } from "@/db/supabase.client";

export const prerender = false;

const createGenerationSessionSchema = z.object({
  source_text: z
    .string()
    .min(1000, "Source text must be at least 1000 characters")
    .max(10000, "Source text cannot exceed 10000 characters"),
});

export const POST: APIRoute = async ({ request, locals }): Promise<Response> => {
  try {
    // TODO: Add authentication middleware to ensure user is logged in
    const { supabase } = locals;
    // if (!user?.id) {
    //   return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    // }

    const body = await request.json();
    const result = createGenerationSessionSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          details: result.error.format(),
        }),
        { status: 400 }
      );
    }

    const response = await createGenerationSession(supabase, SampleUserId, result.data);

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: new Headers({ "Content-Type": "application/json" }),
    });
  } catch (error: unknown) {
    if (error instanceof GenerationError) {
      return new Response(JSON.stringify({ error: error.message }), { status: error.statusCode });
    }

    // Log error but don't expose details to client
    // eslint-disable-next-line no-console
    console.error("[API Error]:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
};
