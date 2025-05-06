import React from "react";
import { useId } from "react";
import { Textarea } from "./ui/textarea";
import { CharacterCounter } from "./CharacterCounter";

interface SourceTextInputProps {
  value: string;
  onChange: (value: string) => void;
  minLength: number;
  maxLength: number;
  disabled?: boolean;
}

export function SourceTextInput({ value, onChange, minLength, maxLength, disabled }: SourceTextInputProps) {
  const labelId = useId();
  const descriptionId = useId();
  const counterId = useId();

  const charCount = value.length;
  const isValid = charCount >= minLength && charCount <= maxLength;

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <label
          htmlFor={labelId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Source Text
        </label>
        <p id={descriptionId} className="text-sm text-muted-foreground">
          Enter text to generate flashcards from ({minLength}-{maxLength} characters)
        </p>
      </div>

      <Textarea
        id={labelId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
        aria-required="true"
        aria-invalid={charCount > 0 && !isValid}
        aria-describedby={`${descriptionId} ${counterId}`}
        className="min-h-[200px] resize-y"
        placeholder="Paste or type your text here..."
      />

      <CharacterCounter count={charCount} minLength={minLength} maxLength={maxLength} counterId={counterId} />
    </div>
  );
}
