"use client";

import {
  FolderPlus,
  LucideIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { ReactNode } from "react";

type EmptyRoutesProps = {
  icon?: LucideIcon;

  title?: string;

  description?: string;

  action?: ReactNode;
};

export function EmptyRoutes({
  icon: Icon = FolderPlus,
  title = "Você ainda não possui nenhuma rota",
  description = "Crie sua primeira rota de estudos para organizar disciplinas, conteúdos e acompanhar sua evolução dentro do Apex.",
  action,
}: EmptyRoutesProps) {
  return (
    <Card>

      <CardContent className="flex flex-col items-center px-8 py-16 text-center">

        <div
          className="
            mb-8
            flex
            size-20
            items-center
            justify-center
            rounded-full
            bg-primary/10
            text-primary
          "
        >
          <Icon className="size-12" />
        </div>

        <h2 className="heading text-3xl font-bold tracking-tight">
          {title}
        </h2>

        <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
          {description}
        </p>

        {action && (
          <div className="mt-10">
            {action}
          </div>
        )}

      </CardContent>

    </Card>
  );
}