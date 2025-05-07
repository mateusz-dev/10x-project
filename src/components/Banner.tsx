import { cn } from "@/lib/utils";

interface BannerProps {
  message: string;
  className?: string;
}

export function Banner({ message, className }: BannerProps) {
  return (
    <div className={cn("w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 text-center", className)}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
