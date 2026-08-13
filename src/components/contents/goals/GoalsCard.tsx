"use client";

import type {
  MouseEvent,
} from "react";

import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  PencilLine,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Progress,
} from "@/components/ui/progress";

import {
  formatPercentage,
  formatStudyDate,
} from "@/lib/study-session";

import {
  GOAL_STATUS_CONFIG,
} from "./status";

import {
  GOAL_TYPE_CONFIG,
} from "./goalType";

import type {
  GoalCardData,
} from "./types";

interface GoalCardProps {
  goal: GoalCardData;

  onClick?: (
    goal: GoalCardData
  ) => void;

  onUpdateProgress?: (
    goal: GoalCardData
  ) => void;
}

export function GoalCard({
  goal,
  onClick,
  onUpdateProgress,
}: GoalCardProps) {
  const status =
    GOAL_STATUS_CONFIG[
      goal.status
    ];

  const goalType =
    GOAL_TYPE_CONFIG[
      goal.type
    ];

  const GoalIcon =
    goalType.icon;

  const progress =
    formatPercentage(
      goal.progress
    );

  const progressLabel =
    `${goal.currentValue} de ${goal.targetValue} ${goal.unit}`;

  const dueDate =
    formatStudyDate(
      goal.dueDate
    );

  const isCompleted =
    goal.status ===
    "COMPLETED";

  /* -------------------------------------------------------------------------- */
  /* CARD CLICK                                                                 */
  /* -------------------------------------------------------------------------- */

  function handleCardClick() {
    onClick?.(goal);
  }

  /* -------------------------------------------------------------------------- */
  /* UPDATE PROGRESS                                                            */
  /* -------------------------------------------------------------------------- */

  function handleUpdateProgress(
    event: MouseEvent<HTMLButtonElement>
  ) {
    /*
     * Impede que o clique no botão
     * também abra os detalhes da meta.
     */
    event.stopPropagation();

    if (isCompleted) {
      return;
    }

    onUpdateProgress?.(
      goal
    );
  }

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <Card
      onClick={
        handleCardClick
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
        {/* HEADER                                                             */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-start gap-3">

            <div
              className="
                flex
                size-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-primary/10
              "
            >
              <GoalIcon
                className="
                  size-5
                  text-primary
                "
              />
            </div>

            <div className="min-w-0">

              <Badge
                variant="secondary"
                className={
                  status.className
                }
              >
                {status.label}
              </Badge>

              <h3
                className="
                  mt-2
                  truncate
                  text-lg
                  font-semibold
                  transition-colors
                  duration-200
                  group-hover:text-primary
                "
              >
                {goal.title}
              </h3>

            </div>

          </div>

          <ChevronRight
            className="
              mt-1
              size-5
              shrink-0
              text-muted-foreground
              transition-transform
              duration-200
              group-hover:translate-x-1
            "
          />

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PROGRESS                                                            */}
        {/* ------------------------------------------------------------------ */}

        <div className="mt-6 space-y-3">

          <div className="flex items-center justify-between">

            <span className="text-sm font-medium">
              Progresso
            </span>

            <span
              className="
                text-sm
                font-semibold
                text-primary
              "
            >
              {progress}
            </span>

          </div>

          <Progress
            value={
              goal.progress
            }
          />

          <p
            className="
              text-sm
              text-muted-foreground
            "
          >
            {progressLabel}
          </p>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* ACTION                                                              */}
        {/* ------------------------------------------------------------------ */}

        <div className="mt-5">

          {isCompleted ? (
            <div
              className="
                flex
                items-center
                justify-center
                gap-2
                rounded-md
                border
                border-emerald-500/20
                bg-emerald-500/10
                px-4
                py-2
                text-sm
                font-medium
                text-emerald-600
              "
            >
              <CheckCircle2 className="size-4" />

              Meta concluída
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="
                w-full
                gap-2
              "
              onClick={
                handleUpdateProgress
              }
            >
              <PencilLine className="size-4" />

              Atualizar progresso
            </Button>
          )}

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* FOOTER                                                             */}
        {/* ------------------------------------------------------------------ */}

        <div
          className="
            mt-6
            flex
            items-center
            justify-between
            border-t
            pt-4
            text-sm
            text-muted-foreground
          "
        >

          <div className="flex items-center gap-2">

            <Clock3 className="size-4" />

            <span>
              Prazo
            </span>

          </div>

          <span>
            {dueDate}
          </span>

        </div>

      </CardContent>
    </Card>
  );
}