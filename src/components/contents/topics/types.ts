import type { TopicStatus } from "./status";

/* -------------------------------------------------------------------------- */
/*                                 TOPIC CARD                                 */
/* -------------------------------------------------------------------------- */

export interface TopicCardData {
  id: string;

  title: string;

  subtitle?: string;

  description?: string;

  status: TopicStatus;

  totalStudyTimeSeconds: number;

  questionsAnswered: number;

  accuracy: number; // percentual (0-100)

  notesCount: number;

  lastSessionAt: string | null;
}

/* -------------------------------------------------------------------------- */
/*                              TOPIC FORM DATA                               */
/* -------------------------------------------------------------------------- */

export interface TopicFormData {
  title: string;

  subtitle?: string;

  description?: string;

  status: TopicStatus;
}