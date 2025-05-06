import React from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { Button } from "./ui/button";

export type BannerType = "success" | "error" | "info";

interface StickyBannerProps {
  message: string | null;
  type: BannerType;
  onClose?: () => void;
}

export function StickyBanner({ message, type, onClose }: StickyBannerProps) {
  if (!message) return null;

  const iconMap = {
    success: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    error: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  };

  const variantMap = {
    success: "border-green-200 bg-green-50",
    error: "destructive",
    info: "border-blue-200 bg-blue-50",
  };

  const textColorMap = {
    success: "text-green-800",
    error: "text-destructive-foreground",
    info: "text-blue-800",
  };

  return (
    <Alert
      variant={type === "error" ? "destructive" : undefined}
      className={type !== "error" ? variantMap[type] : undefined}
      role={type === "error" ? "alert" : "status"}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {iconMap[type]}
          <AlertDescription className={textColorMap[type]}>{message}</AlertDescription>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose} aria-label="Close message">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
}
