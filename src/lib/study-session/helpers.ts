import { formatStudyDate } from "./formatters";

import type {
  SessionGroup,
  SessionMode,
  SessionSummaryData,
  StudySession,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface SessionStatsData {
  totalSessions: number;

  totalStudyTime: number;

  averageDuration: number;

  averageAccuracy: number;

  totalQuestions: number;

  totalCorrectAnswers: number;

  longestSession: number;
}

/* -------------------------------------------------------------------------- */
/*                                GROUPING                                    */
/* -------------------------------------------------------------------------- */

export function groupSessionsByDay(
  sessions: StudySession[]
): SessionGroup[] {
  const groups = new Map<string, SessionGroup>();

  for (const session of sessions) {
    const label = formatStudyDate(session.started_at);

    const current = groups.get(label);

    if (current) {
      current.sessions.push(session);
      current.totalSessions++;
      current.totalDuration += session.duration_seconds;

      continue;
    }

    groups.set(label, {
      label,
      totalSessions: 1,
      totalDuration: session.duration_seconds,
      sessions: [session],
    });
  }

  return Array.from(groups.values());
}

/* -------------------------------------------------------------------------- */
/*                              CALCULATIONS                                  */
/* -------------------------------------------------------------------------- */

export function calculateAccuracy(
  correctAnswers: number,
  totalQuestions: number
): number {
  if (totalQuestions === 0) {
    return 0;
  }

  return (correctAnswers / totalQuestions) * 100;
}

export function calculateStudyTime(
  sessions: StudySession[]
): number {
  return sessions.reduce(
    (total, session) =>
      total + session.duration_seconds,
    0
  );
}

export function calculateQuestionRate(
  correctAnswers: number,
  totalQuestions: number
): number {
  if (totalQuestions === 0) {
    return 0;
  }

  return correctAnswers / totalQuestions;
}

/* -------------------------------------------------------------------------- */
/*                              SESSION STATS                                 */
/* -------------------------------------------------------------------------- */

export function calculateSessionStats(
  sessions: StudySession[]
): SessionStatsData {
  const totalSessions = sessions.length;

  const totalStudyTime =
    calculateStudyTime(sessions);

  const totalQuestions = sessions.reduce(
    (total, session) =>
      total + session.questions_answered,
    0
  );

  const totalCorrectAnswers = sessions.reduce(
    (total, session) =>
      total + session.correct_answers,
    0
  );

  const averageDuration =
    totalSessions === 0
      ? 0
      : Math.round(
          totalStudyTime / totalSessions
        );

  const averageAccuracy =
    calculateAccuracy(
      totalCorrectAnswers,
      totalQuestions
    );

  const longestSession = sessions.reduce(
    (longest, session) =>
      Math.max(
        longest,
        session.duration_seconds
      ),
    0
  );

  return {
    totalSessions,

    totalStudyTime,

    averageDuration,

    averageAccuracy,

    totalQuestions,

    totalCorrectAnswers,

    longestSession,
  };
}

/* -------------------------------------------------------------------------- */
/*                                 SESSION                                    */
/* -------------------------------------------------------------------------- */

export function isPomodoro(
  mode: SessionMode
): boolean {
  return mode === "POMODORO";
}

export function isFreeSession(
  mode: SessionMode
): boolean {
  return mode === "FREE";
}

export function isSessionFinished(
  session: StudySession
): boolean {
  return session.finished_at !== null;
}

/* -------------------------------------------------------------------------- */
/*                                VALIDATION                                  */
/* -------------------------------------------------------------------------- */

export function validateCorrectAnswers(
  correctAnswers: number,
  totalQuestions: number
): boolean {
  return (
    correctAnswers >= 0 &&
    correctAnswers <= totalQuestions
  );
}

export function isSessionSummaryDirty(
  data: Pick<
    SessionSummaryData,
    | "questionsAnswered"
    | "correctAnswers"
    | "notes"
    | "topicIds"
  >
): boolean {
  return (
    data.questionsAnswered > 0 ||
    data.correctAnswers > 0 ||
    data.notes.trim().length > 0 ||
    data.topicIds.length > 0
  );
}