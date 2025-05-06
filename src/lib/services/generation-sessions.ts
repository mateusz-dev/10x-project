import type { SupabaseClient } from "@supabase/supabase-js";
import { type CreateGenerationSessionResponseDto, type CreationGenerationSessionCommand } from "../../types";
import { generateFlashcards, AIError } from "./ai";
import type { Database } from "../../db/database.types";
import type { AcceptFlashcardsCommand, AcceptFlashcardsResponseDto, FlashcardOriginType } from "../../types";

export class GenerationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message);
    this.name = "GenerationError";
  }
}

interface SessionData {
  userId: string;
  sourceTextSize: number;
  generationTimeMs: number;
  totalFlashcardsGenerated: number;
}

interface SuggestedFlashcard {
  id: string;
  front: string;
  back: string;
}

async function createSessionWithTransaction(
  supabase: SupabaseClient<Database>,
  data: SessionData
): Promise<Database["public"]["Tables"]["generation_sessions"]["Row"]> {
  const result = await supabase
    .from("generation_sessions")
    .insert({
      user_id: data.userId,
      source_text_size: data.sourceTextSize,
      generation_time_ms: data.generationTimeMs,
      total_flashcards_generated: data.totalFlashcardsGenerated,
      flashcards_accepted_original: 0,
      flashcards_accepted_edited: 0,
      flashcards_rejected: 0,
    })
    .select("*")
    .single();

  if (result.error) {
    throw new GenerationError("Failed to create generation session", 500);
  }

  if (!result.data) {
    throw new GenerationError("Failed to create generation session - no data returned", 500);
  }

  return result.data;
}

export async function createGenerationSession(
  supabase: SupabaseClient<Database>,
  userId: string,
  command: CreationGenerationSessionCommand
): Promise<CreateGenerationSessionResponseDto> {
  const startTime = performance.now();

  try {
    // Generate flashcards using AI
    const generatedFlashcards = await generateFlashcards(command.source_text);

    const endTime = performance.now();
    const generationTimeMs = Math.round(endTime - startTime);

    // Create session in transaction
    const session = await createSessionWithTransaction(supabase, {
      userId,
      sourceTextSize: command.source_text.length,
      generationTimeMs,
      totalFlashcardsGenerated: generatedFlashcards.length,
    });

    // Map AI response to suggested flashcards with temp IDs
    const suggestedFlashcards: SuggestedFlashcard[] = generatedFlashcards.map((card) => ({
      id: crypto.randomUUID(),
      front: card.front,
      back: card.back,
    }));

    const response: CreateGenerationSessionResponseDto = {
      session: {
        id: session.id,
        source_text_size: session.source_text_size,
        generation_time_ms: session.generation_time_ms,
        total_flashcards_generated: session.total_flashcards_generated,
        created_at: session.created_at,
      },
      suggested_flashcards: suggestedFlashcards,
    };

    return response;
  } catch (error) {
    if (error instanceof AIError) {
      throw new GenerationError(error.message, error.statusCode);
    }
    throw error;
  }
}

/**
 * Accepts, edits, or rejects flashcards generated in a session
 * @param supabase The Supabase client instance
 * @param sessionId The ID of the generation session
 * @param userId The ID of the authenticated user
 * @param command The command containing flashcard actions
 * @returns Updated session statistics and created flashcards
 * @throws Error if session not found or unauthorized
 */
export async function acceptFlashcards(
  supabase: SupabaseClient<Database>,
  sessionId: string,
  userId: string,
  command: AcceptFlashcardsCommand
): Promise<AcceptFlashcardsResponseDto> {
  const { data: session, error: sessionError } = await supabase
    .from("generation_sessions")
    .select()
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();

  if (sessionError || !session) {
    throw new Error("Session not found");
  }

  const counts = command.flashcards.reduce(
    (acc, card) => {
      acc[`flashcards_${card.action}`] = (acc[`flashcards_${card.action}`] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const { data: newStats, error: updateError } = await supabase
    .from("generation_sessions")
    .update({
      flashcards_accepted_original: session.flashcards_accepted_original + (counts.flashcards_accept_original || 0),
      flashcards_accepted_edited: session.flashcards_accepted_edited + (counts.flashcards_accept_edited || 0),
      flashcards_rejected: session.flashcards_rejected + (counts.flashcards_reject || 0),
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (updateError) {
    throw updateError;
  }

  const flashcardsToInsert = command.flashcards
    .filter((card) => card.action !== "reject")
    .map((card) => {
      if (!card.front || !card.back) {
        throw new Error("Front and back are required for accepted flashcards");
      }
      return {
        user_id: userId,
        generation_session_id: sessionId,
        front: card.front,
        back: card.back,
        origin_type: `ai_generated_${card.action}` as FlashcardOriginType,
        review_count: 0,
        successful_reviews: 0,
      };
    });

  const { data: createdFlashcards, error: insertError } = await supabase
    .from("flashcards")
    .insert(flashcardsToInsert)
    .select("id, front, back, origin_type");

  if (insertError) {
    throw insertError;
  }

  if (!createdFlashcards) {
    throw new Error("Failed to create flashcards");
  }

  return {
    session: {
      id: sessionId,
      flashcards_accepted_original: newStats.flashcards_accepted_original,
      flashcards_accepted_edited: newStats.flashcards_accepted_edited,
      flashcards_rejected: newStats.flashcards_rejected,
    },
    created_flashcards: createdFlashcards.map((card) => ({
      ...card,
      origin_type: card.origin_type as FlashcardOriginType,
    })),
  };
}
