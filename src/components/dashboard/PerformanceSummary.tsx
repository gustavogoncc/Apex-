import { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

type Accent =
  | "primary"
  | "success"
  | "warning"
  | "danger";

type SummaryItem = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: Accent;
};

type PerformanceSummaryProps = {
  title?: string;
  description?: string;

  items: SummaryItem[];
};

const accentVariants = {
  primary: "bg-primary/10 text-primary",

  success:
    "bg-emerald-500/10 text-emerald-500",

  warning:
    "bg-amber-500/10 text-amber-500",

  danger:
    "bg-red-500/10 text-red-500",
};

export function PerformanceSummary({
  title = "Resumo",
  description = "Indicadores rápidos.",
  items,
}: PerformanceSummaryProps) {
  return (
    <Card className="h-full">

      <CardHeader>

        <CardTitle className="heading">
          {title}
        </CardTitle>

        <CardDescription>
          {description}
        </CardDescription>

      </CardHeader>

      <CardContent className="space-y-6">

        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
            >
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-muted-foreground">
                    {item.label}
                  </p>

                  <h3 className="mt-2 text-3xl font-bold tracking-tight">
                    {item.value}
                  </h3>

                </div>

                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-2xl",
                    accentVariants[item.accent ?? "primary"]
                  )}
                >
                  <Icon className="size-6" />
                </div>

              </div>

              {index < items.length - 1 && (
                <div className="mt-6 h-px bg-border" />
              )}
            </div>
          );
        })}

      </CardContent>

    </Card>
  );
}