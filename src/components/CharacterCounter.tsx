import React from "react";

interface CharacterCounterProps {
  count: number;
  minLength: number;
  maxLength: number;
  counterId: string;
}

export function CharacterCounter({ count, minLength, maxLength, counterId }: CharacterCounterProps) {
  const isValid = count >= minLength && count <= maxLength;
  const isEmpty = count === 0;

  return (
    <div
      id={counterId}
      className={`text-sm ${
        isEmpty
          ? "text-muted-foreground"
          : isValid
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
      }`}
      aria-live="polite"
    >
      {count} / {maxLength} characters
      {count > 0 && !isValid && (
        <span className="ml-2">
          {count < minLength
            ? `(${minLength - count} more needed)`
            : count > maxLength
              ? `(${count - maxLength} too many)`
              : ""}
        </span>
      )}
    </div>
  );
}
