"use client";

import {
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Progress,
} from "@/components/ui/progress";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

interface GoalDetailsDialogProps {
  open: boolean;

  goal: GoalCardData | null;

  onOpenChange: (
    open: boolean
  ) => void;

  onEdit?: (
    goal: GoalCardData
  ) => void;

  onDelete?: (
    goal: GoalCardData
  ) => void;
}

export function GoalDetailsDialog({
  open,
  goal,
  onOpenChange,
  onEdit,
  onDelete,
}: GoalDetailsDialogProps) {
  if (!goal) {
    return null;
  }

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

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="
                flex
                size-10
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

            <span>{goal.title}</span>
          </DialogTitle>

          <DialogDescription>
            Acompanhe o progresso da sua meta.
          </DialogDescription>
        </DialogHeader>

        {/* ------------------------------------------------------------------ */}
        {/* STATUS */}
        {/* ------------------------------------------------------------------ */}

        <div>
          <Badge
            variant="secondary"
            className={status.className}
          >
            {status.label}
          </Badge>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PROGRESS */}
        {/* ------------------------------------------------------------------ */}

        <section
          className="
            space-y-4
            rounded-lg
            border
            bg-muted/30
            p-5
          "
        >
          <div className="text-center">
            <p
              className="
                text-3xl
                font-bold
                text-primary
              "
            >
              {progress}
            </p>

            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              concluído
            </p>
          </div>

          <Progress
            value={goal.progress}
          />

          <p
            className="
              text-center
              text-sm
              text-muted-foreground
            "
          >
            {progressLabel}
          </p>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* INFORMATION */}
        {/* ------------------------------------------------------------------ */}

        <section
          className="
            grid
            gap-4
            rounded-lg
            border
            p-5
            sm:grid-cols-2
          "
        >
          <div className="space-y-1">
            <span
              className="
                text-sm
                text-muted-foreground
              "
            >
              Tipo
            </span>

            <div className="flex items-center gap-2">
              <GoalIcon
                className="
                  size-4
                  text-primary
                "
              />

              <span className="font-medium">
                {goalType.label}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span
              className="
                text-sm
                text-muted-foreground
              "
            >
              Prazo
            </span>

            <span className="font-medium">
              {dueDate}
            </span>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* ACTIONS */}
        {/* ------------------------------------------------------------------ */}

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() =>
              onEdit?.(goal)
            }
          >
            <Pencil className="mr-2 size-4" />

            Editar
          </Button>

          <Button
            variant="destructive"
            onClick={() =>
              onDelete?.(goal)
            }
          >
            <Trash2 className="mr-2 size-4" />

            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}