import { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

type MetricCardProps = {
  title: string;
  value: string | number;
  description?: string;

  icon: LucideIcon;

  accent?: "primary" | "success" | "warning" | "danger";

  className?: string;
};

const accentVariants = {
  primary: {
    wrapper: "bg-primary/10 text-primary",
  },

  success: {
    wrapper: "bg-emerald-500/10 text-emerald-500",
  },

  warning: {
    wrapper: "bg-amber-500/10 text-amber-500",
  },

  danger: {
    wrapper: "bg-red-500/10 text-red-500",
  },
};

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  accent = "primary",
  className,
}: MetricCardProps) {
  const colors = accentVariants[accent];

  return (
    <Card
      className={cn(
        "group overflow-hidden",
        "transition-all duration-300",
        "hover:-translate-y-1",
        "hover:border-primary/20",
        "hover:shadow-xl",
        className
      )}
    >
      <CardContent className="p-6">

        <div className="flex items-start justify-between">

          <div className="space-y-3">

            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>

            <h3 className="heading text-4xl font-bold tracking-tight">
              {value}
            </h3>

            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}

          </div>

          <div
            className={cn(
              "flex size-14 items-center justify-center",
              "rounded-3xl",
              "transition-all duration-300",
              "group-hover:scale-105",
              colors.wrapper
            )}
          >
            <Icon className="size-7" />
          </div>

        </div>

      </CardContent>
    </Card>
  );
}