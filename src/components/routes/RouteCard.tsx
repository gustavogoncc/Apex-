"use client";

import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  Folder,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";

type RouteCardProps = {
  id: string;

  name: string;

  createdAt: string;

  updatedAt?: string | null;

  completed?: boolean;

  onDelete: () => void;

  onToggleComplete: () => void;
};

function formatLastUpdate(date: string) {
  const current = new Date();
  const target = new Date(date);

  const today = new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate()
  );

  const targetDay = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  const diff =
    (today.getTime() - targetDay.getTime()) /
    (1000 * 60 * 60 * 24);

  if (diff === 0) {
    return "Hoje";
  }

  if (diff === 1) {
    return "Ontem";
  }

  return target.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function RouteCard({
  id,
  name,
  createdAt,
  updatedAt,
  completed = false,
  onDelete,
  onToggleComplete,
}: RouteCardProps) {
  const lastUpdate = updatedAt ?? createdAt;

  return (
    <Card
      className={cn(
        "group h-full transition-all duration-300",
        "hover:-translate-y-1",
        "hover:border-primary/20",
        "hover:shadow-xl",
        completed && "opacity-70"
      )}
    >
      <CardHeader>

        <div className="flex items-start gap-4">

          <div
            className="
              flex
              size-14
              shrink-0
              items-center
              justify-center
              rounded-3xl
              bg-primary/10
              text-primary
              transition-transform
              duration-300
              group-hover:scale-105
            "
          >
            <Folder className="size-7" />
          </div>

          <div className="min-w-0 flex-1">

            <div className="flex items-start justify-between gap-3">

              <CardTitle
                className={cn(
                  "heading line-clamp-2 text-xl",
                  completed &&
                    "text-muted-foreground line-through"
                )}
              >
                {name}
              </CardTitle>

              {completed && (
                <span
                  className="
                    shrink-0
                    rounded-full
                    bg-emerald-500/10
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-emerald-500
                  "
                >
                  Concluída
                </span>
              )}

            </div>

            <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">

              <CalendarDays className="size-4 shrink-0" />

              <span>Última atualização</span>

            </div>

            <p className="mt-1 text-sm font-medium">
              {formatLastUpdate(lastUpdate)}
            </p>

          </div>

        </div>

      </CardHeader>

      <CardContent className="flex-1" />

      <CardFooter className="justify-between">

        <div className="flex items-center gap-2">

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleComplete}
            title={
              completed
                ? "Desmarcar conclusão"
                : "Marcar como concluída"
            }
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
            title="Excluir rota"
            className="hover:text-destructive"
          >
            <Trash2 />
          </Button>

        </div>

        <Button
          asChild
          variant="ghost"
        >
          <Link
            href={`/rotas/${id}`}
            className="gap-2"
          >
            Abrir

            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>

      </CardFooter>

    </Card>
  );
}