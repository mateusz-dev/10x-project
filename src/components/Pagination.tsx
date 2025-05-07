import { Button } from "@/components/ui/button";
import { type Pagination as PaginationType } from "@/types";

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, pages, total } = pagination;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className="flex items-center justify-between border-t border-muted pt-4 mt-8"
    >
      <div className="text-sm text-muted-foreground">
        Showing page {page} of {pages} ({total} items)
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
