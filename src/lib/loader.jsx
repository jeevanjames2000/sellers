import { cn } from "@/lib/utils";

export function Loading({ className, size = 8, color = "blue-600", ...props }) {
  return (
    <div
      className={cn(
        "animate-spin inline-block border-3 border-current border-t-transparent rounded-full",
        `size-${size}`,
        `text-${color}`,
        "dark:text-blue-500",
        className
      )}
      role="status"
      aria-label="loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}