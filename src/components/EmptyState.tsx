import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <div className="text-3xl mb-4">📚</div>
        <h2 className="text-lg font-semibold mb-2">No flashcards found</h2>
        <p className="text-sm text-muted-foreground">
          You haven&apos;t created any flashcards yet. Generate some flashcards to get started!
        </p>
      </CardContent>
    </Card>
  );
}
