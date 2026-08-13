"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

import {
  SessionHistory,
  SessionRunner,
  SessionStats,
  SessionSummaryDialog,
} from ".";

import type {
  SessionSummaryData,
} from "./SessionSummaryDialog";

interface FinishedSessionData {
  sessionId: string;

  durationSeconds: number;

  goal: string;

  mode: string;
}

type StudySessionProps = {
  routeId: string;

  subjectId: string;

  subjectName: string;

  /**
   * Executado depois que a sessão e os
   * tópicos relacionados forem salvos
   * com sucesso.
   *
   * A página utiliza esse callback para
   * atualizar os dados dos TopicCards.
   */
  onSessionSaved?: () => void | Promise<void>;
};

export function StudySession({
  routeId,
  subjectId,
  subjectName,
  onSessionSaved,
}: StudySessionProps) {
  const [
    openSummary,
    setOpenSummary,
  ] = useState(false);

  const [
    refreshKey,
    setRefreshKey,
  ] = useState(0);

  const [
    finishedSession,
    setFinishedSession,
  ] = useState<FinishedSessionData | null>(
    null
  );

  /* -------------------------------------------------------------------------- */
  /* SESSION FINISHED                                                           */
  /* -------------------------------------------------------------------------- */

  function handleSessionFinished(
    data: FinishedSessionData
  ) {
    setFinishedSession(data);

    setOpenSummary(true);
  }

  /* -------------------------------------------------------------------------- */
  /* SAVE SUMMARY                                                               */
  /* -------------------------------------------------------------------------- */

  async function handleSaveSummary(
    data: SessionSummaryData
  ) {
    if (!finishedSession) {
      return;
    }

    /* ------------------------------------------------------------------------ */
    /* UPDATE SESSION                                                            */
    /* ------------------------------------------------------------------------ */

    const {
      error: sessionError,
    } = await supabase
      .from("study_sessions")
      .update({
        finished_at:
          new Date().toISOString(),

        duration_seconds:
          finishedSession.durationSeconds,

        questions_answered:
          data.questionsAnswered,

        correct_answers:
          data.correctAnswers,

        notes:
          data.notes,

        result:
          data.result,

        status:
          "COMPLETED",

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        finishedSession.sessionId
      );

    if (sessionError) {
      console.error(
        "ERRO AO ATUALIZAR SESSÃO"
      );

      console.error(
        "code:",
        sessionError.code
      );

      console.error(
        "message:",
        sessionError.message
      );

      console.error(
        "details:",
        sessionError.details
      );

      console.error(
        "hint:",
        sessionError.hint
      );

      return;
    }

    /* ------------------------------------------------------------------------ */
    /* REMOVE OLD TOPIC RELATIONSHIPS                                           */
    /* ------------------------------------------------------------------------ */

    const {
      error: deleteTopicsError,
    } = await supabase
      .from("study_session_topics")
      .delete()
      .eq(
        "session_id",
        finishedSession.sessionId
      );

    if (deleteTopicsError) {
      console.error(
        "ERRO AO REMOVER TÓPICOS DA SESSÃO"
      );

      console.error(
        "code:",
        deleteTopicsError.code
      );

      console.error(
        "message:",
        deleteTopicsError.message
      );

      console.error(
        "details:",
        deleteTopicsError.details
      );

      console.error(
        "hint:",
        deleteTopicsError.hint
      );

      return;
    }

    /* ------------------------------------------------------------------------ */
    /* SAVE STUDIED TOPICS                                                      */
    /* ------------------------------------------------------------------------ */

    if (data.topicIds.length > 0) {
      const rows =
        data.topicIds.map(
          (topicId) => ({
            session_id:
              finishedSession.sessionId,

            topic_id:
              topicId,
          })
        );

      console.log(
        "Tópicos que serão vinculados:",
        rows
      );

      const {
        error: topicsError,
      } = await supabase
        .from("study_session_topics")
        .insert(rows);

      if (topicsError) {
        console.error(
          "ERRO AO SALVAR TÓPICOS DA SESSÃO"
        );

        console.error(
          "code:",
          topicsError.code
        );

        console.error(
          "message:",
          topicsError.message
        );

        console.error(
          "details:",
          topicsError.details
        );

        console.error(
          "hint:",
          topicsError.hint
        );

        console.error(
          "rows:",
          rows
        );

        return;
      }

      console.log(
        "Tópicos da sessão salvos com sucesso:",
        rows
      );
    }

    /* ------------------------------------------------------------------------ */
    /* UPDATE INTERNAL COMPONENTS                                               */
    /* ------------------------------------------------------------------------ */

    setRefreshKey(
      (current) => current + 1
    );

    /* ------------------------------------------------------------------------ */
    /* UPDATE TOPIC CARDS IN PARENT PAGE                                        */
    /* ------------------------------------------------------------------------ */

    try {
      await onSessionSaved?.();
    } catch (error) {
      console.error(
        "ERRO AO ATUALIZAR OS TÓPICOS APÓS SALVAR A SESSÃO:",
        error
      );
    }

    /* ------------------------------------------------------------------------ */
    /* CLOSE SUMMARY                                                            */
    /* ------------------------------------------------------------------------ */

    setOpenSummary(false);

    setFinishedSession(null);
  }

  /* -------------------------------------------------------------------------- */
  /* RENDER                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <section className="space-y-8">

      {/* ---------------------------------------------------------------------- */}
      {/* SESSION RUNNER                                                         */}
      {/* ---------------------------------------------------------------------- */}

      <SessionRunner
        routeId={routeId}
        subjectId={subjectId}
        subjectName={subjectName}
        onFinish={
          handleSessionFinished
        }
      />

      {/* ---------------------------------------------------------------------- */}
      {/* SESSION STATS                                                          */}
      {/* ---------------------------------------------------------------------- */}

      <SessionStats
        key={`stats-${refreshKey}`}
        subjectId={subjectId}
      />

      {/* ---------------------------------------------------------------------- */}
      {/* SESSION HISTORY                                                        */}
      {/* ---------------------------------------------------------------------- */}

      <SessionHistory
        key={`history-${refreshKey}`}
        subjectId={subjectId}
      />

      {/* ---------------------------------------------------------------------- */}
      {/* SESSION SUMMARY                                                        */}
      {/* ---------------------------------------------------------------------- */}

      {finishedSession && (
        <SessionSummaryDialog
          open={
            openSummary
          }
          onOpenChange={
            setOpenSummary
          }
          subjectId={
            subjectId
          }
          durationSeconds={
            finishedSession.durationSeconds
          }
          goal={
            finishedSession.goal
          }
          mode={
            finishedSession.mode
          }
          onSave={
            handleSaveSummary
          }
        />
      )}
    </section>
  );
}