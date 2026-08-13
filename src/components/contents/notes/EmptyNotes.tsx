"use client";

import {
  FileSearch,
  FileText,
  Plus,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyNotesState =
  | "empty"
  | "filtered";

type PrimaryAction =
  | "create"
  | "clear";

interface EmptyNotesProps {
  state?: EmptyNotesState;

  onCreate?: () => void;

  onClearFilters?: () => void;
}

interface EmptyNotesConfig {
  icon: LucideIcon;

  title: string;

  description: string;

  buttonLabel?: string;

  buttonIcon?: LucideIcon;

  primaryAction?: PrimaryAction;
}

const EMPTY_CONFIG: Record<
  EmptyNotesState,
  EmptyNotesConfig
> = {
  empty: {
    icon: FileText,

    title:
      "Construa sua base de conhecimento",

    description:
      "Registre resumos, conceitos importantes, macetes e qualquer informação que facilite suas revisões e ajude na fixação do conteúdo.",

    buttonLabel:
      "Criar primeira anotação",

    buttonIcon: Plus,

    primaryAction: "create",
  },

  filtered: {
    icon: FileSearch,

    title:
      "Nenhuma anotação encontrada",

    description:
      "Nenhuma anotação corresponde aos filtros ou à pesquisa realizada. Ajuste os filtros ou refine sua busca para encontrar o conteúdo desejado.",

    buttonLabel:
      "Limpar filtros",

    buttonIcon: FileSearch,

    primaryAction: "clear",
  },
};

export function EmptyNotes({
  state = "empty",
  onCreate,
  onClearFilters,
}: EmptyNotesProps) {
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