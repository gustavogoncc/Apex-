/**
 * ============================================================================
 * Study Session Module Types
 * ============================================================================
 *
 * Todos os tipos compartilhados do módulo de Sessões de Estudo.
 *
 * Runner
 * Summary
 * History
 * Stats
 * Dashboard
 * Heatmap
 * Insights
 *
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/*                                   ENUMS                                    */
/* -------------------------------------------------------------------------- */

export type SessionMode =
  | "FREE"
  | "POMODORO";

export type SessionGoal =
  | "THEORY"
  | "REVIEW"
  | "QUESTIONS"
  | "VIDEO"
  | "READING"
  | "CUSTOM";

export type SessionResult =
  | "THEORY_COMPLETED"
  | "REVIEW_COMPLETED"
  | "QUESTIONS_SOLVED"
  | "TOPICS_COMPLETED"
  | "CONTENT_COMPLETED"
  | "CUSTOM";

/* -------------------------------------------------------------------------- */
/*                                  ENTITIES                                  */
/* -------------------------------------------------------------------------- */

export interface StudySession {
  id: string;

  subject_id: string;

  duration_seconds: number;

  mode: SessionMode;

  goal: SessionGoal;

  result: SessionResult | null;

  questions_answered: number;

  correct_answers: number;

  notes: string | null;

  started_at: string;

  finished_at: string | null;

  created_at: string;

  updated_at: string;
}

export interface StudyTopic {
  id: string;

  title: string;
}

/* -------------------------------------------------------------------------- */
/*                                  HISTORY                                   */
/* -------------------------------------------------------------------------- */

export interface SessionHistoryItem {
  session: StudySession;

  formattedDuration: string;

  formattedHour: string;

  accuracy: number | null;
}

export interface SessionGroup {
  label: string;

  totalSessions: number;

  totalDuration: number;

  sessions: StudySession[];
}

/* -------------------------------------------------------------------------- */
/*                                  DASHBOARD                                 */
/* -------------------------------------------------------------------------- */

export interface StudyDaySummary {
  date: string;

  totalSessions: number;

  totalDuration: number;

  totalQuestions: number;

  totalCorrectAnswers: number;
}

/* -------------------------------------------------------------------------- */
/*                                  PAYLOADS                                  */
/* -------------------------------------------------------------------------- */

export interface SessionSummaryData {
  questionsAnswered: number;

  correctAnswers: number;

  notes: string;

  result: SessionResult;

  topicIds: string[];
}