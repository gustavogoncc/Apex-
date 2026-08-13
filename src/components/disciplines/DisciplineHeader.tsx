"use client";

import Link from "next/link";

import {
  ChevronLeft,
  BookOpen,
  Layers3,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

type DisciplineHeaderProps = {
  routeName: string;

  totalDisciplines: number;
};

export function DisciplineHeader({
  routeName,
  totalDisciplines,
}: DisciplineHeaderProps) {
  return (
    <header className="space-y-8">

      <Link
        href="/rotas"
        className="
          inline-flex
          items-center
          gap-2
          text-sm
          text-muted-foreground
          transition-colors
          hover:text-foreground
        "
      >
        <ChevronLeft className="size-4" />

        Voltar para rotas
      </Link>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-5">

          <div
            className="
              flex
              size-14
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              text-primary
            "
          >
            <BookOpen className="size-7" />
          </div>

          <div>

            <h1 className="heading text-4xl font-bold tracking-tight">
              {routeName}
            </h1>

            <p className="mt-2 text-muted-foreground">
              Organize as disciplinas e acompanhe a evolução desta rota de estudos.
            </p>

          </div>

        </div>

        <Card className="px-6 py-4">

          <CardContent className="p-0">

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary/10
                  text-primary
                "
              >
                <Layers3 className="size-5" />
              </div>

              <div>

                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Total de disciplinas
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {totalDisciplines}
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>

    </header>
  );
}