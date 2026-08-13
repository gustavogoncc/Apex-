"use client";

import Link from "next/link";

import {
  BookOpen,
  ChevronLeft,
  ListChecks,
  Target,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

type ContentHeaderProps = {
  routeId: string;

  routeName: string;

  subjectName: string;

  totalTopics: number;

  performance: number;
};

export function ContentHeader({
  routeId,
  routeName,
  subjectName,
  totalTopics,
  performance,
}: ContentHeaderProps) {
  return (
    <header className="space-y-8">

      <Link
        href={`/rotas/${routeId}`}
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

        Voltar para disciplinas
      </Link>

      <div
        className="
          flex
          flex-col
          gap-8

          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >

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

            <p className="text-sm font-medium text-muted-foreground">
              {routeName}
            </p>

            <h1 className="mt-1 heading text-4xl font-bold tracking-tight">
              {subjectName}
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
              Gerencie os tópicos do edital, acompanhe seu desempenho,
              registre anotações importantes e defina metas para
              evoluir continuamente neste conteúdo.
            </p>

          </div>

        </div>

        <div
          className="
            grid
            gap-4

            sm:grid-cols-2
          "
        >

          <Card className="min-w-[180px]">

            <CardContent className="flex items-center gap-4 p-5">

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
                <ListChecks className="size-5" />
              </div>

              <div>

                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Tópicos
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {totalTopics}
                </p>

              </div>

            </CardContent>

          </Card>

          <Card className="min-w-[180px]">

            <CardContent className="flex items-center gap-4 p-5">

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
                <Target className="size-5" />
              </div>

              <div>

                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Aproveitamento
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {performance}%
                </p>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>

    </header>
  );
}