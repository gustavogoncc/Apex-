"use client";

import { Folder } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

type RoutesHeaderProps = {
  title?: string;
  description?: string;
};

export function RoutesHeader({
  title = "Minhas Rotas de Estudo",
  description = "Gerencie e organize seus caminhos de aprendizado para concursos e projetos.",
}: RoutesHeaderProps) {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <header className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

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
          <Folder className="size-7" />
        </div>

        <div>

          <h1 className="heading text-4xl font-bold tracking-tight">
            {title}
          </h1>

          <p className="mt-2 text-muted-foreground">
            {description}
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
              <Folder className="size-5" />
            </div>

            <div>

              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Total de Rotas
              </p>

              <p className="mt-1 font-medium capitalize">
                Organize seus objetivos
              </p>

            </div>

          </div>

        </CardContent>

      </Card>

    </header>
  );
}