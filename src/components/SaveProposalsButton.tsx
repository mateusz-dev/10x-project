import React from "react";
import { Button } from "./ui/button";
import { Loader2, Save } from "lucide-react";

interface SaveProposalsButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function SaveProposalsButton({ onClick, disabled, isLoading }: SaveProposalsButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full sm:w-auto min-w-[200px]"
      size="lg"
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Save Selected Flashcards
        </>
      )}
    </Button>
  );
}
