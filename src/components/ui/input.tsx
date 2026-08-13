import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        [
          "flex",
          "h-11",
          "w-full",
          "min-w-0",

          "rounded-xl",

          "border",
          "border-border",

          "bg-card",

          "px-4",
          "py-2",

          "text-sm",
          "text-foreground",

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

          "file:border-0",
          "file:bg-transparent",
          "file:text-sm",
          "file:font-medium",
          "file:text-foreground",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
}

export { Input };