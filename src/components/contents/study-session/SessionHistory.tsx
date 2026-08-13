"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

import {
  SessionHistoryCard,
} from "./SessionHistoryCard";

import {
  SessionEmpty,
} from "./SessionEmpty";

import type {
  StudySession,
} from "@/lib/study-session";

interface SessionGroup {
  label: string;

  totalSessions: number;

  totalDuration: number;

  sessions: StudySession[];
}

interface SessionHistoryProps {
  subjectId: string;
}

export function SessionHistory({
  subjectId,
}: SessionHistoryProps) {
  const [loading, setLoading] =
    useState(true);

  const [sessions, setSessions] =
    useState<StudySession[]>([]);

  useEffect(() => {
    async function loadSessions() {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("study_sessions")
        .select(`
          id,
          subject_id,
          started_at,
          finished_at,
          duration_seconds,
          mode,
          goal,
          result,
          questions_answered,
          correct_answers,
          notes,
          created_at,
          updated_at
        `)
        .eq(
          "subject_id",
          subjectId
        )
        .order("started_at", {
          ascending: false,
        });

      if (!error && data) {
        setSessions(data);
      }

      setLoading(false);
    }

    loadSessions();
  }, [subjectId]);

  /* ------------------------------------------------------------------------ */
  /* GROUP LABEL                                                              */
  /* ------------------------------------------------------------------------ */

  function getGroupLabel(
    date: Date
  ) {
    const today = new Date();

    const yesterday =
      new Date();

    yesterday.setDate(
      today.getDate() - 1
    );

    if (
      date.toDateString() ===
      today.toDateString()
    ) {
      return "Hoje";
    }

    if (
      date.toDateString() ===
      yesterday.toDateString()
    ) {
      return "Ontem";
    }

    const diff =
      today.getTime() -
      date.getTime();

    const diffDays =
      Math.floor(
        diff /
          (1000 *
            60 *
            60 *
            24)
      );

    if (diffDays < 7) {
      return date.toLocaleDateString(
        "pt-BR",
        {
          weekday: "long",
        }
      );
    }

    return date.toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  }

  /* ------------------------------------------------------------------------ */
  /* DURATION                                                                 */
  /* ------------------------------------------------------------------------ */

  function formatDuration(
    seconds: number
  ) {
    const hours =
      Math.floor(
        seconds / 3600
      );

    const minutes =
      Math.floor(
        (seconds % 3600) / 60
      );

    if (hours === 0) {
      return `${minutes} min`;
    }

    return `${hours}h ${minutes}min`;
  }

  /* ------------------------------------------------------------------------ */
  /* GROUPS                                                                   */
  /* ------------------------------------------------------------------------ */

  const groups =
    useMemo<SessionGroup[]>(
      () => {
        const map = new Map<
          string,
          SessionGroup
        >();

        for (const session of sessions) {
          const label =
            getGroupLabel(
              new Date(
                session.started_at
              )
            );

          const group =
            map.get(label);

          if (group) {
            group.sessions.push(
              session
            );

            group.totalSessions++;

            group.totalDuration +=
              session.duration_seconds;
          } else {
            map.set(label, {
              label,

              totalSessions: 1,

              totalDuration:
                session.duration_seconds,

              sessions: [session],
            });
          }
        }

        return Array.from(
          map.values()
        );
      },
      [sessions]
    );

  /* ------------------------------------------------------------------------ */
  /* LOADING                                                                  */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <section className="space-y-6">

        <header className="space-y-2">

          <div className="h-6 w-56 animate-pulse rounded-md bg-muted" />

          <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />

        </header>

        <div className="space-y-5">

          {Array.from({
            length: 3,
          }).map(
            (_, index) => (
              <div
                key={index}
                className="rounded-2xl border p-5"
              >

                <div className="h-5 w-40 animate-pulse rounded bg-muted" />

                <div className="mt-4 h-4 w-60 animate-pulse rounded bg-muted" />

                <div className="mt-3 h-4 w-32 animate-pulse rounded bg-muted" />

              </div>
            )
          )}

        </div>

      </section>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* EMPTY                                                                    */
  /* ------------------------------------------------------------------------ */

  if (sessions.length === 0) {
    return <SessionEmpty />;
  }

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <section className="space-y-8">

      <header className="space-y-2">

        <h2 className="text-xl font-semibold tracking-tight">
          Histórico de Sessões
        </h2>

        <p className="text-sm text-muted-foreground">
          Consulte todas as sessões
          realizadas nesta disciplina
          e acompanhe sua evolução.
        </p>

      </header>

      <div className="space-y-8">

        {groups.map(
          (group) => (
            <section
              key={group.label}
              className="space-y-4"
            >

              <div className="flex items-center gap-4">

                <div className="space-y-1">

                  <h3 className="font-semibold">
                    {group.label}
                  </h3>

                  <p className="text-sm text-muted-foreground">

                    {group.totalSessions}

                    {group.totalSessions ===
                    1
                      ? " sessão"
                      : " sessões"}

                    {" • "}

                    {formatDuration(
                      group.totalDuration
                    )}

                    {" estudadas"}

                  </p>

                </div>

                <div className="h-px flex-1 bg-border" />

              </div>

              <div className="space-y-4">

                {group.sessions.map(
                  (session) => (
                    <SessionHistoryCard
                      key={session.id}
                      session={session}
                    />
                  )
                )}

              </div>

            </section>
          )
        )}

      </div>

    </section>
  );
}