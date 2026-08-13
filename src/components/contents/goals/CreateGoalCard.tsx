"use client";

import type { KeyboardEvent } from "react";

import { Plus } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface CreateGoalCardProps {
  onCreate?: () => void;
}

export function CreateGoalCard({
  onCreate,
}: CreateGoalCardProps) {
  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>
  ) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      onCreate?.();
    }
  }

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onCreate}
      onKeyDown={handleKeyDown}
      className="
        group
        h-full
        cursor-pointer
        border-dashed
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-primary/40
        hover:shadow-lg
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
        focus-visible:ring-offset-2
      "
    >
      <CardContent
        className="
          flex
          h-full
          flex-col
          items-center
          justify-center
          p-8
          text-center
        "
      >
        <div
          className="
            flex
            size-16
            items-center
            justify-center
            rounded-full
            bg-primary/10
            transition-all
            duration-300
            group-hover:scale-110
            group-hover:rotate-90
            group-hover:bg-primary/20
          "
        >
          <Plus
            className="
              size-8
              text-primary
            "
          />
        </div>

        <h3
          className="
            mt-6
            text-lg
            font-semibold
            transition-colors
            duration-200
            group-hover:text-primary
          "
        >
          Nova meta
        </h3>

        <p
          className="
            mt-3
            max-w-xs
            text-sm
            leading-6
            text-muted-foreground
          "
        >
          Defina objetivos para acompanhar sua
          evolução, manter a consistência dos
          estudos e alcançar melhores resultados.
        </p>
      </CardContent>
    </Card>
  );
}