import type { SupabaseClient } from "@supabase/supabase-js";
import { type CreateGenerationSessionResponseDto, type CreationGenerationSessionCommand } from "../../types";
import { generateFlashcards, AIError } from "./ai";
import type { Database } from "../../db/database.types";

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
