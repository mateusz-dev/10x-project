import { Button } from "./ui/button";
import { useState } from "react";
import { logger } from "@/lib/utils/logger";

export function Navigation() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      // Redirect to login page after successful logout
      window.location.href = "/login";
    } catch (error) {
      logger.error("navigation", "Logout failed", { error });
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-4 flex-1">
          <a href="/generate" className="text-sm font-medium transition-colors hover:text-primary">
            Generate
          </a>
          <a href="/flashcards" className="text-sm font-medium transition-colors hover:text-primary">
            Flashcards
          </a>
        </div>
        <Button variant="outline" disabled={isLoggingOut} onClick={handleLogout}>
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </nav>
  );
}
