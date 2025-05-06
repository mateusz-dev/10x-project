import React from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

import { Check, X, Edit2, RotateCcw } from "lucide-react";
import type { SuggestedFlashcardViewModel } from "./hooks/useGenerateFlashcards";
import { Card, CardContent, CardFooter } from "./ui/card";

interface FlashcardProposalItemProps {
  proposal: SuggestedFlashcardViewModel;
  onUpdateProposal: (updatedProposal: SuggestedFlashcardViewModel) => void;
}

export function FlashcardProposalItem({ proposal, onUpdateProposal }: FlashcardProposalItemProps) {
  const handleTextChange = (field: "front" | "back", value: string) => {
    const originalField = field === "front" ? "originalFront" : "originalBack";
    onUpdateProposal({
      ...proposal,
      [field]: value,
      action: value !== proposal[originalField] ? "edited" : null,
    });
  };

  const handleActionClick = (action: "original" | "edited" | "reject") => {
    onUpdateProposal({
      ...proposal,
      action,
      ...(action === "original"
        ? {
            front: proposal.originalFront,
            back: proposal.originalBack,
          }
        : {}),
    });
  };

  const toggleEdit = () => {
    onUpdateProposal({
      ...proposal,
      isEditing: !proposal.isEditing,
    });
  };

  const isEdited = proposal.front !== proposal.originalFront || proposal.back !== proposal.originalBack;

  return (
    <Card
      className={`border-2 ${
        proposal.action === "original"
          ? "border-green-500"
          : proposal.action === "edited"
            ? "border-blue-500"
            : proposal.action === "reject"
              ? "border-red-500"
              : "border-gray-200"
      }`}
    >
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor={`front-${proposal.temp_id}`}>
              Front Side
            </label>
            {proposal.isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTextChange("front", proposal.originalFront)}
                className="h-8 px-2"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            ) : null}
          </div>
          {proposal.isEditing ? (
            <Textarea
              id={`front-${proposal.temp_id}`}
              value={proposal.front}
              onChange={(e) => handleTextChange("front", e.target.value)}
              className="min-h-[100px]"
              aria-label="Front side of flashcard"
            />
          ) : (
            <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">{proposal.front}</div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor={`back-${proposal.temp_id}`}>
              Back Side
            </label>
            {proposal.isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleTextChange("back", proposal.originalBack)}
                className="h-8 px-2"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            ) : null}
          </div>
          {proposal.isEditing ? (
            <Textarea
              id={`back-${proposal.temp_id}`}
              value={proposal.back}
              onChange={(e) => handleTextChange("back", e.target.value)}
              className="min-h-[100px]"
              aria-label="Back side of flashcard"
            />
          ) : (
            <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">{proposal.back}</div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 flex flex-wrap gap-2 items-center justify-between border-t">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={proposal.action === "original" ? "default" : "outline"}
            size="sm"
            onClick={() => handleActionClick("original")}
            disabled={proposal.isEditing}
            aria-pressed={proposal.action === "original"}
          >
            <Check className="w-4 h-4 mr-1" />
            Accept Original
          </Button>

          {isEdited && (
            <Button
              variant={proposal.action === "edited" ? "default" : "outline"}
              size="sm"
              onClick={() => handleActionClick("edited")}
              disabled={proposal.isEditing}
              aria-pressed={proposal.action === "edited"}
            >
              <Check className="w-4 h-4 mr-1" />
              Accept Edited
            </Button>
          )}

          <Button
            variant={proposal.action === "reject" ? "destructive" : "outline"}
            size="sm"
            onClick={() => handleActionClick("reject")}
            disabled={proposal.isEditing}
            aria-pressed={proposal.action === "reject"}
          >
            <X className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleEdit}
          aria-pressed={proposal.isEditing}
          aria-label={proposal.isEditing ? "Finish editing" : "Edit flashcard"}
        >
          <Edit2 className="w-4 h-4 mr-1" />
          {proposal.isEditing ? "Done" : "Edit"}
        </Button>
      </CardFooter>
    </Card>
  );
}
