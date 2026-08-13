import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type RoutesGridProps = {
  children: ReactNode;
  className?: string;
};

export function RoutesGrid({
  children,
  className,
}: RoutesGridProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        "grid-cols-1",
        "md:grid-cols-2",
        "2xl:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}