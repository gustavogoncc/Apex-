"use client";

import {
  Plus,
  SearchX,
  Target,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyGoalsState =
  | "empty"
  | "filtered";

type PrimaryAction =
  | "create"
  | "clear";

interface EmptyGoalsProps {
  state?: EmptyGoalsState;

  onCreate?: () => void;

  onClearFilters?: () => void;
}

interface EmptyGoalsConfig {
  icon: LucideIcon;

  title: string;

  description: string;

  buttonLabel?: string;

  buttonIcon?: LucideIcon;

  primaryAction?: PrimaryAction;
}

const EMPTY_CONFIG: Record<
  EmptyGoalsState,
  EmptyGoalsConfig
> = {
  empty: {
    icon: Target,

    title:
      "Defina seus próximos objetivos",

    description:
      "Estabeleça metas para acompanhar sua evolução, manter a consistência dos estudos e visualizar seu progresso ao longo do tempo.",

    buttonLabel:
      "Criar primeira meta",

    buttonIcon: Plus,

    primaryAction: "create",
  },

  filtered: {
    icon: SearchX,

    title:
      "Nenhuma meta encontrada",

    description:
      "Nenhuma meta corresponde aos filtros aplicados. Ajuste os filtros para visualizar outros resultados.",

    buttonLabel:
      "Limpar filtros",

    buttonIcon: SearchX,

    primaryAction: "clear",
  },
};

export function EmptyGoals({
  state = "empty",
  onCreate,
  onClearFilters,
}: EmptyGoalsProps) {
  const config =
    EMPTY_CONFIG[state];

  const Icon =
    config.icon;

  const ButtonIcon =
    config.buttonIcon;

  function handlePrimaryAction() {
    switch (
      config.primaryAction
    ) {
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