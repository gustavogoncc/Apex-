"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  PERFORMANCE_TYPE_CONFIG,
} from "./performanceType";

import type {
  PerformanceCardData,
} from "./types";

interface PerformanceCardProps {
  performance: PerformanceCardData;

  onClick?: (
    performance: PerformanceCardData
  ) => void;
}

export function PerformanceCard({
  performance,
  onClick,
}: PerformanceCardProps) {
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
    performance.trend === "UP"
      ? ArrowUpRight
      : performance.trend === "DOWN"
        ? ArrowDownRight
        : Minus;

  const trendClassName =
    performance.trend === "UP"
      ? "text-emerald-600"
      : performance.trend === "DOWN"
        ? "text-red-600"
        : "text-muted-foreground";

  return (
    <Card
      onClick={() =>
        onClick?.(performance)
      }
      className="
        group
        cursor-pointer
        overflow-hidden
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-primary/40
        hover:shadow-lg
      "
    >
      <CardContent className="p-6">

        {/* ------------------------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex items-start justify-between">

          <div
            className={`
              flex
              size-12
              items-center
              justify-center
              rounded-xl
              ${performanceType.color}
            `}
          >
            <Icon
              className="
                size-6
              "
            />
          </div>

          <div
            className={`
              flex
              items-center
              gap-1
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

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* CONTENT */}
        {/* ------------------------------------------------------------------ */}

        <div className="mt-6 space-y-2">

          <p
            className="
              text-sm
              text-muted-foreground
            "
          >
            {performanceType.label}
          </p>

          <h3
            className="
              text-3xl
              font-bold
              tracking-tight
            "
          >
            {performance.value}
          </h3>

          <p
            className="
              text-sm
              text-muted-foreground
            "
          >
            {performance.subtitle}
          </p>

        </div>

      </CardContent>
    </Card>
  );
}