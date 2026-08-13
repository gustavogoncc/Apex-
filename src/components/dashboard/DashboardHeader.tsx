import { CalendarDays, LayoutDashboard } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

type DashboardHeaderProps = {
  title: string;
  description: string;
};

export function DashboardHeader({
  title,
  description,
}: DashboardHeaderProps) {
  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <header className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

      <div className="flex items-center gap-5">

        <div
          className="
            flex
            size-14
            items-center
            justify-center
            rounded-3xl
            bg-primary/10
            text-primary
          "
        >
          <LayoutDashboard className="size-7" />
        </div>

        <div>

          <h1 className="heading text-4xl font-bold tracking-tight">
            {title}
          </h1>

          <p className="mt-2 max-w-xl text-muted-foreground">
            {description}
          </p>

        </div>

      </div>

      <Card className="w-full lg:w-auto">

        <CardContent className="flex items-center gap-4 p-5">

          <div
            className="
              flex
              size-11
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              text-primary
            "
          >
            <CalendarDays className="size-5" />
          </div>

          <div>

            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Hoje
            </p>

            <p className="mt-1 font-medium capitalize">
              {today}
            </p>

          </div>

        </CardContent>

      </Card>

    </header>
  );
}