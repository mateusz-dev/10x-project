import React from "react";
import { FlashcardProposalItem } from "./FlashcardProposalItem";
import type { SuggestedFlashcardViewModel } from "./hooks/useGenerateFlashcards";

interface FlashcardProposalListProps {
  proposals: SuggestedFlashcardViewModel[];
  onUpdateProposal: (updatedProposal: SuggestedFlashcardViewModel) => void;
}

export function FlashcardProposalList({ proposals, onUpdateProposal }: FlashcardProposalListProps) {
  if (proposals.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4" role="list" aria-label="Generated flashcard proposals">
      {proposals.map((proposal) => (
        <div key={proposal.temp_id} role="listitem">
          <FlashcardProposalItem proposal={proposal} onUpdateProposal={onUpdateProposal} />
        </div>
      ))}
    </div>
  );
}
