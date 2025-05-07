import { Card, CardContent } from "./ui/card";
import { Banner } from "./Banner";
import { EmptyState } from "./EmptyState";
import { Pagination } from "./Pagination";
import { SortDropdown } from "./SortDropdown";
import { useFlashcards } from "./hooks/useFlashcards";
import type { FlashcardDto } from "@/types";

interface FlashcardItemProps {
  flashcard: FlashcardDto;
}

function FlashcardItem({ flashcard }: FlashcardItemProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Front</h3>
            <p className="text-sm text-muted-foreground">{flashcard.front}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Back</h3>
            <p className="text-sm text-muted-foreground">{flashcard.back}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
          <span>Reviews: {flashcard.review_count}</span>
          <span>Successful: {flashcard.successful_reviews}</span>
          <span>
            Next review:{" "}
            {flashcard.next_review_at ? new Date(flashcard.next_review_at).toLocaleDateString() : "Not scheduled"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export function FlashcardList() {
  const { flashcards, pagination, isLoading, error, sortOrder, onPageChange, onSortChange } = useFlashcards();

  if (isLoading) {
    return <div className="animate-pulse">Loading flashcards...</div>;
  }

  if (error) {
    return <Banner message={error} />;
  }

  if (!flashcards || flashcards.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <SortDropdown sortOrder={sortOrder} onSortChange={onSortChange} />
      </div>

      <ul className="space-y-4" aria-label="Flashcards list">
        {flashcards.map((flashcard) => (
          <li key={flashcard.id}>
            <FlashcardItem flashcard={flashcard} />
          </li>
        ))}
      </ul>

      {pagination && <Pagination pagination={pagination} onPageChange={onPageChange} />}
    </div>
  );
}
