"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Clock3,
  Pause,
  Play,
  Timer,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { supabase } from "@/lib/supabase";

export interface FinishedSessionData {
  sessionId: string;

  routeId: string;

  subjectId: string;

  mode: SessionMode;

  goal: SessionGoal;

  startedAt: string;

  finishedAt: string;

  durationSeconds: number;
}

interface SessionRunnerProps {
  routeId: string;

  subjectId: string;

  subjectName: string;

  onFinish: (
    session: FinishedSessionData
  ) => void;
}

type SessionStatus =
  | "READY"
  | "RUNNING"
  | "PAUSED";

type SessionMode =
  | "FREE"
  | "POMODORO";

type SessionGoal =
  | "THEORY"
  | "QUESTIONS"
  | "REVIEW"
  | "READING"
  | "VIDEO"
  | "CUSTOM";

const GOALS = [
  {
    value: "THEORY",
    label: "Teoria",
  },
  {
    value: "QUESTIONS",
    label: "Questões",
  },
  {
    value: "REVIEW",
    label: "Revisão",
  },
  {
    value: "READING",
    label: "Leitura",
  },
  {
    value: "VIDEO",
    label: "Videoaula",
  },
  {
    value: "CUSTOM",
    label: "Outro",
  },
] as const;

export function SessionRunner({
  routeId,
  subjectId,
  subjectName,
  onFinish,
}: SessionRunnerProps) {
  const [status, setStatus] =
    useState<SessionStatus>("READY");

  const [mode, setMode] =
    useState<SessionMode>("FREE");

  const [goal, setGoal] =
    useState<SessionGoal>("THEORY");

  const [sessionId, setSessionId] =
    useState<string | null>(null);

  const [startedAt, setStartedAt] =
    useState<Date | null>(null);

  const [pauseStartedAt, setPauseStartedAt] =
    useState<Date | null>(null);

  const [totalPausedSeconds, setTotalPausedSeconds] =
    useState(0);

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  /* -------------------------------------------------------------------------- */
  /* TIMER */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (
      status !== "RUNNING" ||
      !startedAt
    ) {
      return;
    }

    const interval = setInterval(() => {
      const diff = Math.floor(
        (Date.now() - startedAt.getTime()) /
          1000
      );

      setElapsedSeconds(
        Math.max(
          0,
          diff - totalPausedSeconds
        )
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [
    status,
    startedAt,
    totalPausedSeconds,
  ]);

  /* -------------------------------------------------------------------------- */
  /* FORMATADOR */
  /* -------------------------------------------------------------------------- */

  const formattedTime =
    useMemo(() => {
      const hours = Math.floor(
        elapsedSeconds / 3600
      );

      const minutes = Math.floor(
        (elapsedSeconds % 3600) / 60
      );

      const seconds =
        elapsedSeconds % 60;

      return [
        hours,
        minutes,
        seconds,
      ]
        .map((value) =>
          value
            .toString()
            .padStart(2, "0")
        )
        .join(":");
    }, [elapsedSeconds]);

      /* -------------------------------------------------------------------------- */
  /* START */
  /* -------------------------------------------------------------------------- */

  async function handleStart() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error(
        "Usuário não autenticado."
      );
      return;
    }

    console.log("Usuário:", user);

    const started = new Date();

    const { data, error } =
      await supabase
        .from("study_sessions")
        .insert({
          user_id: user.id,
          route_id: routeId,
          subject_id: subjectId,

          mode,
          goal,

          status: "IN_PROGRESS",

          started_at:
            started.toISOString(),

          duration_seconds: 0,
          questions_answered: 0,
          correct_answers: 0,
        })
        .select("id")
        .single();

    if (error) {
      console.error(error);
      return;
    }

    setSessionId(data.id);

    setStartedAt(started);

    setElapsedSeconds(0);

    setPauseStartedAt(null);

    setTotalPausedSeconds(0);

    setStatus("RUNNING");
  }

  /* -------------------------------------------------------------------------- */
  /* PAUSE */
  /* -------------------------------------------------------------------------- */

  function handlePause() {
    setPauseStartedAt(new Date());

    setStatus("PAUSED");
  }

  /* -------------------------------------------------------------------------- */
  /* RESUME */
  /* -------------------------------------------------------------------------- */

  function handleResume() {
    if (pauseStartedAt) {
      const pausedSeconds =
        Math.floor(
          (
            Date.now() -
            pauseStartedAt.getTime()
          ) / 1000
        );

      setTotalPausedSeconds(
        (current) =>
          current + pausedSeconds
      );
    }

    setPauseStartedAt(null);

    setStatus("RUNNING");
  }

  /* -------------------------------------------------------------------------- */
  /* FINISH */
  /* -------------------------------------------------------------------------- */

  async function handleFinish() {
    if (
      !sessionId ||
      !startedAt
    ) {
      return;
    }

    const finished =
      new Date();

    const duration =
      elapsedSeconds;

    const { error } =
      await supabase
        .from("study_sessions")
        .update({
          finished_at:
            finished.toISOString(),

          duration_seconds:
            duration,

          status:
            "COMPLETED",
        })
        .eq("id", sessionId);

    if (error) {
      console.error(error);
      return;
    }

    setStatus("READY");

    setSessionId(null);

    setStartedAt(null);

    setPauseStartedAt(null);

    setTotalPausedSeconds(0);
    const finishedSession: FinishedSessionData = {
  sessionId,

  routeId,

  subjectId,

  mode,

  goal,

  startedAt: startedAt.toISOString(),

  finishedAt: finished.toISOString(),

  durationSeconds: duration,
};

setStatus("READY");

setSessionId(null);

setStartedAt(null);

setPauseStartedAt(null);

setTotalPausedSeconds(0);

setElapsedSeconds(0);

onFinish(finishedSession);
  }

  return (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Clock3 className="size-5 text-primary" />

        Sessão de Estudos
      </CardTitle>

      <CardDescription>
        Inicie uma sessão para registrar seu tempo de estudo nesta disciplina.
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-8">
      {/* ------------------------------------------------------------------ */}
      {/* CONFIGURAÇÕES */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Modo
          </label>

          <Select
            value={mode}
            disabled={status !== "READY"}
            onValueChange={(value) =>
              setMode(
                value as SessionMode
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="FREE">
                Cronômetro Livre
              </SelectItem>

              <SelectItem value="POMODORO">
                Pomodoro
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Objetivo
          </label>

          <Select
            value={goal}
            disabled={status !== "READY"}
            onValueChange={(value) =>
              setGoal(
                value as SessionGoal
              )
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {GOALS.map((goal) => (
                <SelectItem
                  key={goal.value}
                  value={goal.value}
                >
                  {goal.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* TIMER */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          rounded-2xl
          border
          bg-muted/30
          p-10
          text-center
          space-y-5
        "
      >
        <Timer className="mx-auto size-10 text-primary" />

        <h2 className="font-mono text-5xl font-bold tracking-tight">
          {formattedTime}
        </h2>

        <p className="text-sm text-muted-foreground">
          {status === "READY" &&
            "Pronto para iniciar"}

          {status === "RUNNING" &&
            "Sessão em andamento"}

          {status === "PAUSED" &&
            "Sessão pausada"}
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* AÇÕES */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-wrap justify-center gap-3">
        {status === "READY" && (
          <Button
            size="lg"
            onClick={handleStart}
          >
            <Play className="mr-2 size-5" />

            Iniciar Sessão
          </Button>
        )}

        {status === "RUNNING" && (
          <>
            <Button
              variant="secondary"
              size="lg"
              onClick={handlePause}
            >
              <Pause className="mr-2 size-5" />

              Pausar
            </Button>

            <Button
              size="lg"
              onClick={handleFinish}
            >
              Finalizar
            </Button>
          </>
        )}

        {status === "PAUSED" && (
          <>
            <Button
              size="lg"
              onClick={handleResume}
            >
              <Play className="mr-2 size-5" />

              Continuar
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={handleFinish}
            >
              Finalizar
            </Button>
          </>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* INFORMAÇÕES */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-4 rounded-2xl border bg-muted/20 p-5 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Disciplina
          </p>

          <p className="mt-1 font-medium">
            {subjectName}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Modo
          </p>

          <p className="mt-1 font-medium">
            {mode === "FREE"
              ? "Cronômetro Livre"
              : "Pomodoro"}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Objetivo
          </p>

          <p className="mt-1 font-medium">
            {
              GOALS.find(
                (item) =>
                  item.value === goal
              )?.label
            }
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
}