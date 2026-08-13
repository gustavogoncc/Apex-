"use client";

import { useMemo, useState } from "react";

import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Target,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  calculateAccuracy,
  formatAccuracy,
  formatDuration,
  formatHour,
  getGoalConfig,
  getModeConfig,
  getResultConfig,
  type StudySession,
} from "@/lib/study-session";

interface SessionHistoryCardProps {
  session: StudySession;
}

export function SessionHistoryCard({
  session,
}: SessionHistoryCardProps) {
  const [expanded, setExpanded] =
    useState(false);

  const goal = useMemo(
    () => getGoalConfig(session.goal),
    [session.goal]
  );

  const mode = useMemo(
    () => getModeConfig(session.mode),
    [session.mode]
  );

  const result = useMemo(
    () => getResultConfig(session.result),
    [session.result]
  );

  const duration = useMemo(
    () =>
      formatDuration(
        session.duration_seconds
      ),
    [session.duration_seconds]
  );

  const hour = useMemo(
    () =>
      formatHour(session.started_at),
    [session.started_at]
  );

  const accuracy = useMemo(() => {
    return calculateAccuracy(
      session.correct_answers,
      session.questions_answered
    );
  }, [
    session.correct_answers,
    session.questions_answered,
  ]);

  const hasQuestions =
    session.questions_answered > 0;

  const hasNotes =
    !!session.notes?.trim();

  const hasResult =
    session.result !== null;


  return (
    <Card
      onClick={() => setExpanded((value) => !value)}
      className="cursor-pointer overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-sm"
    >
      <CardContent className="p-0">

        {/* ------------------------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex items-start justify-between p-5">

          <div className="space-y-4 flex-1">

            <div className="flex items-center gap-2 text-sm text-muted-foreground">

              <Clock3 className="size-4" />

              <span>{hour}</span>

              <span>•</span>

              <span>{duration}</span>

            </div>

            <div className="flex flex-wrap gap-2">

              <Badge
                variant="outline"
                className={goal.badgeClassName}
              >
                <goal.icon className="mr-1 size-3" />

                {goal.label}
              </Badge>

              <Badge
                variant="outline"
                className={mode.badgeClassName}
              >
                <mode.icon className="mr-1 size-3" />

                {mode.label}
              </Badge>

            </div>

            {(hasQuestions || hasResult) && (

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">

                {hasQuestions && (
                  <>
                    <div className="flex items-center gap-1">

                      <BookOpen className="size-4" />

                      {session.questions_answered} questões

                    </div>

                    <div className="flex items-center gap-1">

                      <CheckCircle2 className="size-4" />

                      {session.correct_answers} acertos

                    </div>

                    <div className="flex items-center gap-1">

                      <Target className="size-4" />

                      {formatAccuracy(accuracy)}

                    </div>
                  </>
                )}

              </div>

            )}

          </div>

          <div className="ml-6 shrink-0">

            {expanded ? (
              <ChevronUp className="size-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-5 text-muted-foreground" />
            )}

          </div>

        </div>

        {/* ------------------------------------------------------------------ */}
        {/* EXPANDED */}
        {/* ------------------------------------------------------------------ */}

        {expanded && (

          <div className="space-y-6 border-t bg-muted/20 p-5">

            {hasNotes && (

              <section className="space-y-2">

                <h4 className="text-sm font-semibold">

                  Resumo da sessão

                </h4>

                <p className="text-sm leading-6 text-muted-foreground whitespace-pre-wrap">

                  {session.notes}

                </p>

              </section>

            )}

            {hasResult && (

              <section className="space-y-2">

                <h4 className="text-sm font-semibold">

                  Resultado

                </h4>

                <Badge
                  variant="outline"
                  className={result.badgeClassName}
                >
                  <result.icon className="mr-1 size-3" />

                  {result.label}

                </Badge>

              </section>

            )}

            <section className="space-y-2">

              <h4 className="text-sm font-semibold">

                Tópicos estudados

              </h4>

              <p className="text-sm text-muted-foreground">

                Em breve será possível visualizar os tópicos
                estudados nesta sessão.

              </p>

            </section>

          </div>

        )}

      </CardContent>

    </Card>
  );
}