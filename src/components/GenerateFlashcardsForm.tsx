import React from "react";
import { useGenerateFlashcards } from "./hooks/useGenerateFlashcards";
import { SourceTextInput } from "./SourceTextInput";
import { GenerateButton } from "./GenerateButton";
import { FlashcardProposalList } from "./FlashcardProposalList";
import { SaveProposalsButton } from "./SaveProposalsButton";
import { StickyBanner } from "./StickyBanner";

export function GenerateFlashcardsForm() {
  const {
    sourceText,
    isValidText,
    suggestedFlashcards,
    isLoadingGeneration,
    isLoadingSaving,
    generationError,
    savingError,
    successMessage,
    handleSourceTextChange,
    handleGenerateClick,
    handleUpdateProposal,
    handleSaveClick,
    clearMessages,
  } = useGenerateFlashcards();

  return (
    <div className="flex flex-col gap-6">
      {generationError && <StickyBanner message={generationError} type="error" onClose={clearMessages} />}
      {savingError && <StickyBanner message={savingError} type="error" onClose={clearMessages} />}
      {successMessage && <StickyBanner message={successMessage} type="success" onClose={clearMessages} />}

      <div className="space-y-4">
        <SourceTextInput
          value={sourceText}
          onChange={handleSourceTextChange}
          minLength={1000}
          maxLength={10000}
          disabled={isLoadingGeneration}
        />
        <GenerateButton
          onClick={handleGenerateClick}
          disabled={!isValidText || isLoadingGeneration}
          isLoading={isLoadingGeneration}
        />
      </div>

      {suggestedFlashcards.length > 0 && (
        <div className="space-y-4">
          <FlashcardProposalList proposals={suggestedFlashcards} onUpdateProposal={handleUpdateProposal} />
          <SaveProposalsButton
            onClick={handleSaveClick}
            disabled={isLoadingSaving || suggestedFlashcards.every((p) => p.action === "reject" || p.action === null)}
            isLoading={isLoadingSaving}
          />
        </div>
      )}
    </div>
  );
}
