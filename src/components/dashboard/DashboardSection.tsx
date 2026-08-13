import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type DashboardSectionProps = {
  title: string;
  description?: string;

  children: ReactNode;

  className?: string;

  action?: ReactNode;
};

export function DashboardSection({
  title,
  description,
  children,
  className,
  action,
}: DashboardSectionProps) {
  return (
    <section
      className={cn(
        "space-y-6",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">

        <div>

          <h2 className="heading text-2xl font-semibold tracking-tight">
            {title}
          </h2>

          {description && (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          )}

        </div>

        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}

      </div>

      {children}

    </section>
  );
}