"use client";

import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

type DisciplineCardProps = {
  id: string;

  routeId: string;

  name: string;

  createdAt: string;

  updatedAt?: string | null;

  completed?: boolean;

  onDelete: () => void;

  onToggleComplete: () => void;
};

export function DisciplineCard({
  id,
  routeId,
  name,
  createdAt,
  updatedAt,
  completed = false,
  onDelete,
  onToggleComplete,
}: DisciplineCardProps) {
  const formattedDate = new Date(
    updatedAt ?? createdAt
  ).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:-translate-y-1 hover:shadow-xl",
        completed && "opacity-70"
      )}
    >
      <CardContent className="flex h-full flex-col justify-between p-0">

        <div className="p-8">

          <div className="flex items-start gap-5">

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

            <div className="flex-1">

              <h3
                className={cn(
                  "text-2xl font-semibold tracking-tight",
                  completed &&
                    "text-muted-foreground line-through"
                )}
              >
                {name}
              </h3>

              <div className="mt-8 space-y-5">

                <div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">

                    <Calendar className="size-4" />

                    Última atualização

                  </div>

                  <p className="mt-2 font-medium">
                    {formattedDate}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-muted-foreground">
                    Status
                  </p>

                  <div
                    className={cn(
                      "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                      completed
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    {completed
                      ? "Concluída"
                      : "Em andamento"}
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-border
            px-6
            py-4
          "
        >

          <div className="flex items-center gap-2">

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleComplete}
            >
              {completed ? (
                <CheckCircle2 className="text-emerald-500" />
              ) : (
                <Circle />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
            >
              <Trash2 className="text-destructive" />
            </Button>

          </div>

          <Button
            asChild
            variant="ghost"
          >
            <Link
              href={`/rotas/${routeId}/${id}`}
            >
              Conteúdos

              <ArrowRight className="size-4" />
            </Link>
          </Button>

        </div>

      </CardContent>

    </Card>
  );
}