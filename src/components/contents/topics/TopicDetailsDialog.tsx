"use client";

import {
  BookOpen,
  Clock3,
  FileText,
  Pencil,
  Play,
  Target,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  formatDuration,
  formatPercentage,
  formatStudyDate,
} from "@/lib/study-session";

import { STATUS_CONFIG } from "./status";

import type { TopicCardData } from "./types";

interface TopicDetailsDialogProps {
  open: boolean;

  topic: TopicCardData | null;

  onOpenChange: (
    open: boolean
  ) => void;

  onEdit?: (
    topic: TopicCardData
  ) => void;

  onDelete?: (
    topic: TopicCardData
  ) => void;

  onStartStudy?: (
    topic: TopicCardData
  ) => void;
}

export function TopicDetailsDialog({
  open,
  topic,
  onOpenChange,
  onEdit,
  onDelete,
  onStartStudy,
}: TopicDetailsDialogProps) {
  if (!topic) {
    return null;
  }

  const status =
    STATUS_CONFIG[topic.status];

  const accuracy =
    formatPercentage(
      topic.accuracy
    );

  const studyTime =
    formatDuration(
      topic.totalStudyTimeSeconds
    );

  const lastSession =
    topic.lastSessionAt
      ? formatStudyDate(
          topic.lastSessionAt
        )
      : "Nunca estudado";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-3xl">
        {/* ------------------------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------------------------ */}

        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>
              {topic.title}
            </span>

            <Badge
              variant={status.variant}
              className={status.className}
            >
              {status.label}
            </Badge>
          </DialogTitle>

          <DialogDescription>
            Informações detalhadas deste tópico.
          </DialogDescription>
        </DialogHeader>

        {/* ------------------------------------------------------------------ */}
        {/* DESCRIPTION */}
        {/* ------------------------------------------------------------------ */}

        <section
          className="
            rounded-xl
            border
            bg-muted/30
            p-5
          "
        >
          <h4
            className="
              mb-2
              text-sm
              font-semibold
            "
          >
            Descrição
          </h4>

          <p
            className="
              text-sm
              leading-relaxed
              text-muted-foreground
            "
          >
            {topic.description ??
              "Nenhuma descrição cadastrada para este tópico."}
          </p>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* METRICS */}
        {/* ------------------------------------------------------------------ */}

        <section
          className="
            grid
            grid-cols-2
            gap-4
          "
        >
          <div className="rounded-xl border p-4">
            <div
              className="
                flex
                items-center
                gap-2
                text-muted-foreground
              "
            >
              <Clock3 className="size-4" />

              <span className="text-sm">
                Tempo estudado
              </span>
            </div>

            <p
              className="
                mt-2
                text-2xl
                font-semibold
              "
            >
              {studyTime}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <div
              className="
                flex
                items-center
                gap-2
                text-muted-foreground
              "
            >
              <BookOpen className="size-4" />

              <span className="text-sm">
                Questões respondidas
              </span>
            </div>

            <p
              className="
                mt-2
                text-2xl
                font-semibold
              "
            >
              {topic.questionsAnswered}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <div
              className="
                flex
                items-center
                gap-2
                text-muted-foreground
              "
            >
              <Target className="size-4" />

              <span className="text-sm">
                Taxa de acerto
              </span>
            </div>

            <p
              className="
                mt-2
                text-2xl
                font-semibold
              "
            >
              {accuracy}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <div
              className="
                flex
                items-center
                gap-2
                text-muted-foreground
              "
            >
              <FileText className="size-4" />

              <span className="text-sm">
                Anotações
              </span>
            </div>

            <p
              className="
                mt-2
                text-2xl
                font-semibold
              "
            >
              {topic.notesCount}
            </p>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* LAST SESSION */}
        {/* ------------------------------------------------------------------ */}

        <section
          className="
            rounded-xl
            border
            p-4
          "
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Última sessão de estudo
            </span>

            <span className="font-medium">
              {lastSession}
            </span>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* ACTIONS */}
        {/* ------------------------------------------------------------------ */}

        <div
          className="
            flex
            flex-col-reverse
            gap-3
            sm:flex-row
            sm:justify-between
          "
        >
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() =>
                onEdit?.(topic)
              }
            >
              <Pencil className="mr-2 size-4" />
              Editar
            </Button>

            <Button
              variant="destructive"
              onClick={() =>
                onDelete?.(topic)
              }
            >
              <Trash2 className="mr-2 size-4" />
              Excluir
            </Button>
          </div>

          <Button
            onClick={() =>
              onStartStudy?.(topic)
            }
          >
            <Play className="mr-2 size-4" />
            Iniciar sessão
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}