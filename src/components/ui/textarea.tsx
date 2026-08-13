import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        [
          "flex",
          "w-full",
          "min-h-32",
          "resize-y",

          "rounded-xl",

          "border",
          "border-border",

          "bg-card",

          "px-4",
          "py-3",

          "text-sm",
          "text-foreground",

          "leading-6",

          "placeholder:text-muted-foreground",

          "transition-all",
          "duration-200",
          "ease-out",

          "outline-none",

          "focus-visible:border-primary",
          "focus-visible:ring-2",
          "focus-visible:ring-primary/20",

          "disabled:pointer-events-none",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",
          "disabled:bg-muted",

          "aria-invalid:border-destructive",
          "aria-invalid:ring-2",
          "aria-invalid:ring-destructive/20",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
}

export { Textarea };