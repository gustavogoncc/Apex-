"use client";

import {
  BookOpen,
  Plus,
  SearchX,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyTopicsState =
  | "empty"
  | "filtered";

type PrimaryAction =
  | "create"
  | "clear";

interface EmptyTopicsProps {
  state?: EmptyTopicsState;

  onCreate?: () => void;

  onClearFilters?: () => void;
}

interface EmptyTopicsConfig {
  icon: LucideIcon;

  title: string;

  description: string;

  buttonLabel?: string;

  buttonIcon?: LucideIcon;

  primaryAction?: PrimaryAction;
}

const EMPTY_CONFIG: Record<
  EmptyTopicsState,
  EmptyTopicsConfig
> = {
  empty: {
    icon: BookOpen,

    title:
      "Organize seus estudos por tópicos",

    description:
      "Crie tópicos para dividir o conteúdo desta disciplina em partes menores. Assim você poderá acompanhar seu progresso, registrar sessões de estudo, responder questões e visualizar sua evolução.",

    buttonLabel:
      "Criar primeiro tópico",

    buttonIcon: Plus,

    primaryAction: "create",
  },

  filtered: {
    icon: SearchX,

    title:
      "Nenhum tópico encontrado",

    description:
      "Nenhum tópico corresponde aos filtros ou à pesquisa realizada. Tente ajustar os filtros para visualizar outros resultados.",

    buttonLabel:
      "Limpar filtros",

    buttonIcon: SearchX,

    primaryAction: "clear",
  },
};

export function EmptyTopics({
  state = "empty",
  onCreate,
  onClearFilters,
}: EmptyTopicsProps) {
  const config =
    EMPTY_CONFIG[state];

  const Icon = config.icon;

  const ButtonIcon =
    config.buttonIcon;

  function handlePrimaryAction() {
    switch (config.primaryAction) {
      case "create":
        onCreate?.();
        break;

      case "clear":
        onClearFilters?.();
        break;
    }
  }

  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        bg-card
        px-8
        py-14
        text-center
      "
    >
      <div
        className="
          mb-6
          flex
          size-16
          items-center
          justify-center
          rounded-full
          bg-primary/10
        "
      >
        <Icon
          className="
            size-8
            text-primary
          "
        />
      </div>

      <h2
        className="
          text-xl
          font-semibold
          tracking-tight
        "
      >
        {config.title}
      </h2>

      <p
        className="
          mt-3
          max-w-md
          text-sm
          leading-6
          text-muted-foreground
        "
      >
        {config.description}
      </p>

      {config.buttonLabel &&
        ButtonIcon && (
          <Button
            onClick={
              handlePrimaryAction
            }
            className="mt-8 gap-2"
          >
            <ButtonIcon className="size-4" />

            {config.buttonLabel}
          </Button>
        )}
    </div>
  );
}