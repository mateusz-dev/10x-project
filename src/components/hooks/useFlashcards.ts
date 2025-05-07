import { useState, useEffect } from "react";
import type { FlashcardsListResponseDto } from "@/types";

interface UseFlashcardsOptions {
  initialPage?: number;
  initialSortOrder?: "asc" | "desc";
  limit?: number;
}

export function useFlashcards({ initialPage = 1, initialSortOrder = "desc", limit = 5 }: UseFlashcardsOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<FlashcardsListResponseDto | null>(null);

  useEffect(() => {
    async function fetchFlashcards() {
      try {
        setIsLoading(true);
        setError(null);

        const searchParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sort_by: "created_at",
          sort_order: sortOrder,
        });

        const response = await fetch(`/api/flashcards?${searchParams}`);
        if (!response.ok) {
          throw new Error("Failed to load flashcards");
        }

        const newData = (await response.json()) as FlashcardsListResponseDto;
        setData(newData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while loading flashcards");
      } finally {
        setIsLoading(false);
      }
    }

    fetchFlashcards();
  }, [page, sortOrder, limit]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSortChange = (newOrder: "asc" | "desc") => {
    setSortOrder(newOrder);
    setPage(1); // Reset to first page when sorting changes
  };

  return {
    flashcards: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    error,
    page,
    sortOrder,
    onPageChange: handlePageChange,
    onSortChange: handleSortChange,
  };
}
