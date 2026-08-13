"use client";

import {
  BarChart3,
  PlayCircle,
  SearchX,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyPerformanceState =
  | "empty"
  | "filtered";

type EmptyPerformanceAction =
  | "primary"
  | "clear";

interface EmptyPerformanceProps {
  state?: EmptyPerformanceState;

  onPrimaryAction?: () => void;

  onClearFilters?: () => void;
}

interface EmptyPerformanceConfig {
  icon: LucideIcon;

  title: string;

  description: string;

  buttonLabel?: string;

  buttonIcon?: LucideIcon;

  action?: EmptyPerformanceAction;
}

const EMPTY_CONFIG: Record<
  EmptyPerformanceState,
  EmptyPerformanceConfig
> = {
  empty: {
    icon: BarChart3,

    title:
      "Ainda não há dados de desempenho",

    description:
      "Conclua sessões de estudo, responda questões e acompanhe suas metas para visualizar seus indicadores de desempenho.",

    buttonLabel:
      "Ir para sessões",

    buttonIcon: PlayCircle,

    action: "primary",
  },

  filtered: {
    icon: SearchX,

    title:
      "Nenhum indicador encontrado",

    description:
      "Nenhum indicador corresponde aos filtros aplicados. Ajuste os filtros para visualizar os resultados.",

    buttonLabel:
      "Limpar filtros",

    buttonIcon: SearchX,

    action: "clear",
  },
};

export function EmptyPerformance({
  state = "empty",
  onPrimaryAction,
  onClearFilters,
}: EmptyPerformanceProps) {
  const config =
    EMPTY_CONFIG[state];

  const Icon =
    config.icon;

  const ButtonIcon =
    config.buttonIcon;

  function handlePrimaryAction() {
    switch (config.action) {
      case "primary":
        onPrimaryAction?.();
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