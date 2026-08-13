"use client";

import { ReactNode } from "react";

import {
  BookOpen,
  LucideIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

type EmptyDisciplinesProps = {
  icon?: LucideIcon;

  title?: string;

  description?: string;

  action?: ReactNode;
};

export function EmptyDisciplines({
  icon: Icon = BookOpen,
  title = "Nenhuma disciplina cadastrada",
  description = "As disciplinas representam os grandes blocos de estudo da sua rota. Depois de criá-las, você poderá organizar conteúdos, tópicos e acompanhar sua evolução de forma estruturada.",
  action,
}: EmptyDisciplinesProps) {
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