"use client";

import {
  BookOpen,
  ChevronRight,
  Clock3,
  FileText,
  Target,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  formatDuration,
  formatPercentage,
  formatStudyDate,
} from "@/lib/study-session";

import type {
  TopicCardData,
} from "./types";

import {
  STATUS_CONFIG,
} from "./status";

interface TopicCardProps {
  topic: TopicCardData;

  onClick?: (
    topic: TopicCardData
  ) => void;
}

export function TopicCard({
  topic,
  onClick,
}: TopicCardProps) {
  const status =
    STATUS_CONFIG[topic.status];

  const studyTime =
    formatDuration(
      topic.totalStudyTimeSeconds
    );

  const accuracy =
    formatPercentage(
      topic.accuracy
    );

  const lastSession =
    topic.lastSessionAt
      ? formatStudyDate(
          topic.lastSessionAt
        )
      : "Nunca estudado";

  return (
    <Card
      onClick={() =>
        onClick?.(topic)
      }
      className="
        group
        h-full
        cursor-pointer
        overflow-hidden
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-primary/40
        hover:shadow-lg
      "
    >
      <CardContent className="flex h-full flex-col p-6">
        {/* ------------------------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Badge
              variant={status.variant}
              className={status.className}
            >
              {status.label}
            </Badge>

            <div>
              <h3
                className="
                  text-lg
                  font-semibold
                  leading-tight
                  transition-colors
                  duration-200
                  group-hover:text-primary
                "
              >
                {topic.title}
              </h3>

              {topic.subtitle && (
                <p
                  className="
                    mt-1
                    text-sm
                    text-muted-foreground
                  "
                >
                  {topic.subtitle}
                </p>
              )}
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
        {/* METRICS */}
        {/* ------------------------------------------------------------------ */}

        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-5
          "
        >
          <div className="flex items-start gap-3">
            <Clock3
              className="
                mt-1
                size-5
                text-primary
              "
            />

            <div>
              <p className="text-lg font-semibold">
                {studyTime}
              </p>

              <p className="text-xs text-muted-foreground">
                Tempo estudado
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Target
              className="
                mt-1
                size-5
                text-primary
              "
            />

            <div>
              <p className="text-lg font-semibold">
                {accuracy}
              </p>

              <p className="text-xs text-muted-foreground">
                Taxa de acerto
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen
              className="
                mt-1
                size-5
                text-primary
              "
            />

            <div>
              <p className="text-lg font-semibold">
                {topic.questionsAnswered}
              </p>

              <p className="text-xs text-muted-foreground">
                Questões respondidas
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText
              className="
                mt-1
                size-5
                text-primary
              "
            />

            <div>
              <p className="text-lg font-semibold">
                {topic.notesCount}
              </p>

              <p className="text-xs text-muted-foreground">
                Anotações
              </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* FOOTER */}
        {/* ------------------------------------------------------------------ */}

        <div
          className="
            mt-auto
            flex
            items-center
            justify-between
            border-t
            pt-4
            text-sm
            text-muted-foreground
          "
        >
          <span>
            Última sessão
          </span>

          <span className="font-medium">
            {lastSession}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}