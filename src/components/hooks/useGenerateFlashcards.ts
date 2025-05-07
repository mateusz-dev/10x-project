import { useState, useCallback } from "react";
import type { CreateGenerationSessionResponseDto, AcceptFlashcardAction, AcceptFlashcardsCommand } from "../../types";

export interface SuggestedFlashcardViewModel {
  temp_id: string;
  front: string;
  originalFront: string;
  back: string;
  originalBack: string;
  action: AcceptFlashcardAction | null;
  isEditing: boolean;
}

export function useGenerateFlashcards() {
  // Text input state
  const [sourceText, setSourceText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isValidText, setIsValidText] = useState(false);

  // Session state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [suggestedFlashcards, setSuggestedFlashcards] = useState<SuggestedFlashcardViewModel[]>([]);

  // Loading states
  const [isLoadingGeneration, setIsLoadingGeneration] = useState(false);
  const [isLoadingSaving, setIsLoadingSaving] = useState(false);

  // Message states
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [savingError, setSavingError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Text change handler
  const handleSourceTextChange = useCallback((text: string) => {
    setSourceText(text);
    const count = text.length;
    setCharCount(count);
    setIsValidText(count >= 1000 && count <= 10000);
    // Clear any existing errors when text changes
    setGenerationError(null);
  }, []);

  // Generation handler
  const handleGenerateClick = useCallback(async () => {
    if (!isValidText) return;

    setIsLoadingGeneration(true);
    setGenerationError(null);
    setSuggestedFlashcards([]);

    try {
      const response = await fetch("/api/generation-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_text: sourceText }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data: CreateGenerationSessionResponseDto = await response.json();
      setSessionId(data.session.id);

      // Transform API response to view model
      const flashcards = data.suggested_flashcards.map((card) => ({
        temp_id: card.id,
        front: card.front,
        originalFront: card.front,
        back: card.back,
        originalBack: card.back,
        action: null as AcceptFlashcardAction | null,
        isEditing: false,
      }));

      setSuggestedFlashcards(flashcards);
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Failed to generate flashcards. Please try again.");
    } finally {
      setIsLoadingGeneration(false);
    }
  }, [sourceText, isValidText]);

  // Update proposal handler
  const handleUpdateProposal = useCallback((updatedProposal: SuggestedFlashcardViewModel) => {
    setSuggestedFlashcards((prev) => prev.map((p) => (p.temp_id === updatedProposal.temp_id ? updatedProposal : p)));
  }, []);

  // Save handler
  const handleSaveClick = useCallback(async () => {
    if (!sessionId) return;

    setIsLoadingSaving(true);
    setSavingError(null);

    try {
      const command: AcceptFlashcardsCommand = {
        flashcards: suggestedFlashcards
          .filter((card) => card.action !== null)
          .map((card) => ({
            temp_id: card.temp_id,
            action: card.action as AcceptFlashcardAction,
            ...(card.action === "edited" || card.action === "original"
              ? {
                  front: card.front,
                  back: card.back,
                }
              : {}),
          })),
      };

      const response = await fetch(`/api/generation-sessions/${sessionId}/flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(command),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setSuccessMessage("Flashcards saved successfully!");
      // Reset the form
      setSourceText("");
      setCharCount(0);
      setIsValidText(false);
      setSuggestedFlashcards([]);
      setSessionId(null);
      window.location.href = "/flashcards";
    } catch (error) {
      setSavingError(error instanceof Error ? error.message : "Failed to save flashcards. Please try again.");
    } finally {
      setIsLoadingSaving(false);
    }
  }, [sessionId, suggestedFlashcards]);

  // Clear messages handler
  const clearMessages = useCallback(() => {
    setGenerationError(null);
    setSavingError(null);
    setSuccessMessage(null);
  }, []);

  return {
    // Text input state
    sourceText,
    charCount,
    isValidText,

    // Flashcard state
    suggestedFlashcards,

    // Loading states
    isLoadingGeneration,
    isLoadingSaving,

    // Message states
    generationError,
    savingError,
    successMessage,

    // Handlers
    handleSourceTextChange,
    handleGenerateClick,
    handleUpdateProposal,
    handleSaveClick,
    clearMessages,
  };
}
