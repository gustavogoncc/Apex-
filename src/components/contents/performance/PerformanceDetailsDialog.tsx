"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  PERFORMANCE_TYPE_CONFIG,
} from "./performanceType";

import type {
  PerformanceDetailsData,
} from "./types";

interface PerformanceDetailsDialogProps {
  open: boolean;

  performance:
    | PerformanceDetailsData
    | null;

  onOpenChange: (
    open: boolean
  ) => void;
}

export function PerformanceDetailsDialog({
  open,
  performance,
  onOpenChange,
}: PerformanceDetailsDialogProps) {
  if (!performance) {
    return null;
  }

  const performanceType =
    PERFORMANCE_TYPE_CONFIG[
      performance.type
    ];

  const Icon =
    performanceType.icon;

  const formattedVariation =
    `${
      performance.variation > 0
        ? "+"
        : ""
    }${performance.variation}%`;

  const TrendIcon =
    performance.variation > 0
      ? ArrowUpRight
      : performance.variation < 0
        ? ArrowDownRight
        : Minus;

  const trendClassName =
    performance.variation > 0
      ? "text-emerald-600"
      : performance.variation < 0
        ? "text-red-600"
        : "text-muted-foreground";

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="sm:max-w-lg">

        <DialogHeader>

          <DialogTitle className="flex items-center gap-3">

            <div
              className={`
                flex
                size-10
                items-center
                justify-center
                rounded-lg
                ${performanceType.color}
              `}
            >
              <Icon
                className="
                  size-5
                "
              />
            </div>

            <span>
              {performanceType.label}
            </span>

          </DialogTitle>

          <DialogDescription>
            Indicadores detalhados do seu desempenho.
          </DialogDescription>

        </DialogHeader>

        {/* ------------------------------------------------------------------ */}
        {/* VALUE                                                              */}
        {/* ------------------------------------------------------------------ */}

        <section
          className="
            rounded-lg
            border
            bg-muted/30
            p-6
            text-center
          "
        >
          <h2
            className="
              text-4xl
              font-bold
              tracking-tight
            "
          >
            {performance.value}
          </h2>

          <div
            className={`
              mt-3
              inline-flex
              items-center
              gap-2
              rounded-full
              px-3
              py-1
              text-sm
              font-medium
              ${trendClassName}
            `}
          >
            <TrendIcon className="size-4" />

            <span>
              {formattedVariation}
            </span>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* DESCRIPTION                                                        */}
        {/* ------------------------------------------------------------------ */}

        <section
          className="
            rounded-lg
            border
            p-5
          "
        >
          <h3
            className="
              text-sm
              font-semibold
            "
          >
            Resumo
          </h3>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            {performance.description}
          </p>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* PERIOD                                                             */}
        {/* ------------------------------------------------------------------ */}

        <section
          className="
            rounded-lg
            border
            p-5
          "
        >
          <h3
            className="
              text-sm
              font-semibold
            "
          >
            Período
          </h3>

          <p
            className="
              mt-2
              text-sm
              text-muted-foreground
            "
          >
            {performance.subtitle}
          </p>
        </section>

      </DialogContent>
    </Dialog>
  );
}