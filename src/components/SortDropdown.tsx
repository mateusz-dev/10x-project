import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface SortDropdownProps {
  sortOrder: "asc" | "desc";
  onSortChange: (order: "asc" | "desc") => void;
}

export function SortDropdown({ sortOrder, onSortChange }: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort by date
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => onSortChange(value as "asc" | "desc")}>
          <DropdownMenuRadioItem value="desc">Newest first</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="asc">Oldest first</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
