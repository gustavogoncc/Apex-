"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  calculateAccuracy,
  calculateStudyTime,
  formatDuration,
  formatPercentage,
} from "@/lib/study-session";

import type {
  StudySession,
} from "@/lib/study-session";

interface SessionStatsProps {
  subjectId: string;
}

interface SessionStatsData {
  totalSessions: number;
  totalStudyTime: number;
  averageDuration: number;
  averageAccuracy: number;
  totalQuestions: number;
  totalCorrectAnswers: number;
  longestSession: number;
}

export function SessionStats({
  subjectId,
}: SessionStatsProps) {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] =
    useState<SessionStatsData | null>(null);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);

      const { data, error } =
        await supabase
          .from("study_sessions")
          .select("*")
          .eq("subject_id", subjectId);

      if (error || !data) {
        console.error(error);
        setLoading(false);
        return;
      }

      const sessions = data as StudySession[];

      const totalSessions = sessions.length;

      const totalStudyTime =
        calculateStudyTime(sessions);

      const totalQuestions =
        sessions.reduce(
          (total, session) =>
            total +
            session.questions_answered,
          0
        );

      const totalCorrectAnswers =
        sessions.reduce(
          (total, session) =>
            total +
            session.correct_answers,
          0
        );

      const averageDuration =
        totalSessions === 0
          ? 0
          : Math.round(
              totalStudyTime /
                totalSessions
            );

      const averageAccuracy =
        calculateAccuracy(
          totalCorrectAnswers,
          totalQuestions
        );

      const longestSession =
        sessions.reduce(
          (longest, session) =>
            Math.max(
              longest,
              session.duration_seconds
            ),
          0
        );

      setStats({
        totalSessions,
        totalStudyTime,
        averageDuration,
        averageAccuracy,
        totalQuestions,
        totalCorrectAnswers,
        longestSession,
      });

      setLoading(false);
    }

    loadStats();
  }, [subjectId]);

  if (loading || !stats) {
    return (
      <section className="space-y-6">
        <header className="space-y-2">
          <div className="h-6 w-40 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
        </header>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border p-6"
            >
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="mt-5 h-8 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight">
          Estatísticas
        </h2>

        <p className="text-sm text-muted-foreground">
          Indicadores da sua evolução nesta disciplina.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Tempo estudado
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            {formatDuration(
              stats.totalStudyTime
            )}
          </h3>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Sessões
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            {stats.totalSessions}
          </h3>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Tempo médio
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            {formatDuration(
              stats.averageDuration
            )}
          </h3>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Aproveitamento
          </p>

          <h3 className="mt-3 text-3xl font-bold">
            {formatPercentage(
              stats.averageAccuracy
            )}
          </h3>
        </div>
      </div>
    </section>
  );
}