"use client";

import { useEffect, useMemo, useState } from "react";

import {
  BookOpen,
  CheckCircle2,
  Loader2,
  Trophy,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { Textarea } from "@/components/ui/textarea";

export type SessionResult =
  | "THEORY_COMPLETED"
  | "REVIEW_COMPLETED"
  | "QUESTIONS_SOLVED"
  | "TOPICS_COMPLETED"
  | "CONTENT_COMPLETED"
  | "CUSTOM";

export interface SessionSummaryData {
  questionsAnswered: number;

  correctAnswers: number;

  notes: string;

  result: SessionResult;

  topicIds: string[];
}

interface Topic {
  id: string;

  title: string;
}

interface SessionSummaryDialogProps {
  open: boolean;

  onOpenChange: (
    open: boolean
  ) => void;

  subjectId: string;

  durationSeconds: number;

  goal: string;

  mode: string;

  onSave: (
    data: SessionSummaryData
  ) => Promise<void>;
}

const RESULTS = [
  {
    value: "THEORY_COMPLETED",
    label: "Completei toda a teoria",
  },
  {
    value: "REVIEW_COMPLETED",
    label: "Fiz revisão",
  },
  {
    value: "QUESTIONS_SOLVED",
    label: "Resolvi questões",
  },
  {
    value: "TOPICS_COMPLETED",
    label: "Concluí tópicos",
  },
  {
    value: "CONTENT_COMPLETED",
    label: "Concluí todo o conteúdo",
  },
  {
    value: "CUSTOM",
    label: "Outro",
  },
] as const;

export function SessionSummaryDialog({
  open,
  onOpenChange,
  subjectId,
  durationSeconds,
  goal,
  mode,
  onSave,
}: SessionSummaryDialogProps) {
  const [loading, setLoading] =
    useState(false);

  const [confirmCloseOpen, setConfirmCloseOpen] =
    useState(false);

  const [topics, setTopics] =
    useState<Topic[]>([]);

  const [selectedTopics, setSelectedTopics] =
    useState<string[]>([]);

  const [questionsAnswered, setQuestionsAnswered] =
    useState(0);

  const [correctAnswers, setCorrectAnswers] =
    useState(0);

  const [notes, setNotes] =
    useState("");

  const [result, setResult] =
    useState<SessionResult>(
      "THEORY_COMPLETED"
    );

  useEffect(() => {
    if (!open) return;

    async function loadTopics() {
      const { data } = await supabase
        .from("topics")
        .select("id, title")
        .eq("subject_id", subjectId)
        .order("created_at");

      if (data) {
        setTopics(data);
      }
    }

    loadTopics();
  }, [open, subjectId]);

  const isDirty = useMemo(() => {
    return (
      questionsAnswered > 0 ||
      correctAnswers > 0 ||
      notes.trim().length > 0 ||
      selectedTopics.length > 0
    );
  }, [
    questionsAnswered,
    correctAnswers,
    notes,
    selectedTopics,
  ]);

  function resetForm() {
    setQuestionsAnswered(0);

    setCorrectAnswers(0);

    setNotes("");

    setSelectedTopics([]);

    setResult(
      "THEORY_COMPLETED"
    );
  }

  function toggleTopic(
    topicId: string
  ) {
    setSelectedTopics((current) =>
      current.includes(topicId)
        ? current.filter(
            (id) => id !== topicId
          )
        : [...current, topicId]
    );
  }

  function handleClose() {
    if (loading) return;

    if (!isDirty) {
      onOpenChange(false);
      return;
    }

    setConfirmCloseOpen(true);
  }

  function handleDiscard() {
    resetForm();

    setConfirmCloseOpen(false);

    onOpenChange(false);
  }

  async function handleSubmit() {
    setLoading(true);

    try {
      await onSave({
        questionsAnswered,
        correctAnswers,
        notes,
        result,
        topicIds: selectedTopics,
      });

      resetForm();

      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  function formatDuration() {
    const hours = Math.floor(
      durationSeconds / 3600
    );

    const minutes = Math.floor(
      (durationSeconds % 3600) / 60
    );

    if (hours === 0) {
      return `${minutes} min`;
    }

    return `${hours}h ${minutes}min`;
  }


    return (
    <>
      {/* Dialog Principal */}

      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!value) {
            handleClose();
            return;
          }

          onOpenChange(true);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">

          <DialogHeader>

            <DialogTitle className="flex items-center gap-2">

              <Trophy className="size-5 text-primary" />

              Sessão concluída

            </DialogTitle>

            <DialogDescription>

              Revise as informações da sua sessão antes de salvá-la.

            </DialogDescription>

          </DialogHeader>

          <div className="space-y-8">

            {/* Resumo */}

            <section>

              <div className="grid gap-4 md:grid-cols-3">

                <div className="rounded-xl border bg-muted/30 p-5">

                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Tempo
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {formatDuration()}
                  </p>

                </div>

                <div className="rounded-xl border bg-muted/30 p-5">

                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Modo
                  </p>

                  <p className="mt-2 text-lg font-semibold">

                    {mode === "FREE"
                      ? "Cronômetro Livre"
                      : "Pomodoro"}

                  </p>

                </div>

                <div className="rounded-xl border bg-muted/30 p-5">

                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Objetivo
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {goal}
                  </p>

                </div>

              </div>

            </section>

            {/* Desempenho */}

            <section className="space-y-5">

              <h3 className="font-semibold">
                Desempenho
              </h3>

              <div className="grid gap-5 md:grid-cols-2">

                <div className="space-y-2">

                  <Label>
                    Questões resolvidas
                  </Label>

                  <Input
                    type="number"
                    min={0}
                    value={questionsAnswered}
                    onChange={(e) =>
                      setQuestionsAnswered(
                        Number(e.target.value)
                      )
                    }
                  />

                </div>

                <div className="space-y-2">

                  <Label>
                    Acertos
                  </Label>

                  <Input
                    type="number"
                    min={0}
                    max={questionsAnswered}
                    value={correctAnswers}
                    onChange={(e) =>
                      setCorrectAnswers(
                        Number(e.target.value)
                      )
                    }
                  />

                </div>

              </div>

            </section>

            {/* Tópicos */}

            <section className="space-y-5">

              <h3 className="flex items-center gap-2 font-semibold">

                <BookOpen className="size-4 text-primary" />

                Tópicos estudados

              </h3>

              <div className="grid gap-3">

                {topics.map((topic) => (

                  <div
                    key={topic.id}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/30"
                  >

                    <Checkbox
                      checked={selectedTopics.includes(topic.id)}
                      onCheckedChange={() =>
                        toggleTopic(topic.id)
                      }
                    />

                    <Label className="cursor-pointer">
                      {topic.title}
                    </Label>

                  </div>

                ))}

              </div>

            </section>

            {/* Resumo */}

            <section className="space-y-4">

              <h3 className="font-semibold">
                Resumo da sessão
              </h3>

              <Textarea
                rows={5}
                value={notes}
                onChange={(e) =>
                  setNotes(e.target.value)
                }
                placeholder="Ex.: Revisei Poder Constituinte, finalizei Direitos Fundamentais e identifiquei que ainda preciso reforçar Controle de Constitucionalidade."
              />

            </section>

            {/* Resultado */}

            <section className="space-y-5">

              <h3 className="flex items-center gap-2 font-semibold">

                <CheckCircle2 className="size-4 text-primary" />

                Resultado da sessão

              </h3>

              <RadioGroup
                value={result}
                onValueChange={(value) =>
                  setResult(value as SessionResult)
                }
                className="space-y-3"
              >

                {RESULTS.map((item) => (

                  <div
                    key={item.value}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/30"
                  >

                    <RadioGroupItem
                      id={item.value}
                      value={item.value}
                    />

                    <Label htmlFor={item.value}>
                      {item.label}
                    </Label>

                  </div>

                ))}

              </RadioGroup>

            </section>

          </div>

          <DialogFooter className="mt-8">

            <Button
              variant="outline"
              onClick={handleClose}
            >
              Fechar
            </Button>

            <Button
              disabled={loading}
              onClick={handleSubmit}
            >

              {loading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Sessão"
              )}

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

      {/* Dialog de confirmação */}

      <Dialog
        open={confirmCloseOpen}
        onOpenChange={setConfirmCloseOpen}
      >

        <DialogContent className="sm:max-w-md">

          <DialogHeader>

            <DialogTitle>
              Descartar alterações?
            </DialogTitle>

            <DialogDescription>

              Você ainda não salvou esta sessão.

              <br />

              Se fechar agora, todas as informações preenchidas serão perdidas.

            </DialogDescription>

          </DialogHeader>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() =>
                setConfirmCloseOpen(false)
              }
            >
              Continuar editando
            </Button>

            <Button
              variant="destructive"
              onClick={handleDiscard}
            >
              Descartar
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>
    </>
  );
}