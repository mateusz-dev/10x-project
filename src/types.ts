// Import base types from database models
import type { Tables, TablesInsert } from "./db/database.types";

// Generic pagination types
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Paginated<T> {
  data: T[];
  pagination: Pagination;
}

// Strict flashcard origin types
export type FlashcardOriginType = "manual" | "ai_generated_original" | "ai_generated_edited";
export type GenerationSessionId = Tables<"generation_sessions">["id"];

// Flashcard DTOs and Command Models
export type FlashcardDto = Pick<
  Tables<"flashcards">,
  | "id"
  | "front"
  | "back"
  | "created_at"
  | "updated_at"
  | "last_studied_at"
  | "next_review_at"
  | "review_count"
  | "successful_reviews"
> & { origin_type: FlashcardOriginType };

export type FlashcardDetailDto = FlashcardDto & {
  generation_session_id: GenerationSessionId | null;
};

export type CreateFlashcardCommand = Pick<TablesInsert<"flashcards">, "front" | "back">;
export type UpdateFlashcardCommand = CreateFlashcardCommand;

export interface DeleteResponseDto {
  success: boolean;
  message: string;
}

export interface ReviewFlashcardCommand {
  success: boolean;
}

export type ReviewFlashcardResponseDto = Pick<
  Tables<"flashcards">,
  "id" | "next_review_at" | "review_count" | "successful_reviews" | "last_studied_at"
>;

export type FlashcardsListResponseDto = Paginated<FlashcardDto>;
export type FlashcardsDueResponseDto = Paginated<FlashcardDto>;
export type FlashcardDetailResponseDto = FlashcardDetailDto;

// Generation Session DTOs and Command Models
export interface CreationGenerationSessionCommand {
  source_text: string;
}

export type CreatedGenerationSessionDto = Pick<
  Tables<"generation_sessions">,
  "id" | "source_text_size" | "generation_time_ms" | "total_flashcards_generated" | "created_at"
>;

export interface CreateGenerationSessionResponseDto {
  session: CreatedGenerationSessionDto;
  suggested_flashcards: {
    id: string;
    front: string;
    back: string;
  }[];
}

export type GenerationSessionDto = Pick<
  Tables<"generation_sessions">,
  | "id"
  | "source_text_size"
  | "generation_time_ms"
  | "total_flashcards_generated"
  | "flashcards_accepted_original"
  | "flashcards_accepted_edited"
  | "flashcards_rejected"
  | "created_at"
>;

export type GenerationSessionsListResponseDto = Paginated<GenerationSessionDto>;

export type GenerationSessionDetailResponseDto = GenerationSessionDto & {
  flashcards: (Pick<Tables<"flashcards">, "id" | "front" | "back"> & { origin_type: FlashcardOriginType })[];
};

export type AcceptFlashcardAction = "original" | "edited" | "reject";
export interface AcceptFlashcardDto {
  temp_id: string;
  action: AcceptFlashcardAction;
  front?: string;
  back?: string;
}

export interface AcceptFlashcardsCommand {
  flashcards: AcceptFlashcardDto[];
}

export interface AcceptFlashcardsResponseDto {
  session: Pick<
    Tables<"generation_sessions">,
    "id" | "flashcards_accepted_original" | "flashcards_accepted_edited" | "flashcards_rejected"
  >;
  created_flashcards: (Pick<Tables<"flashcards">, "id" | "front" | "back"> & { origin_type: FlashcardOriginType })[];
}

export type GenerationSessionDeleteResponseDto = DeleteResponseDto;
