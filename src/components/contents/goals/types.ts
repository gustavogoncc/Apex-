/* -------------------------------------------------------------------------- */
/*                                 GOAL TYPES                                 */
/* -------------------------------------------------------------------------- */

export type GoalStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "OVERDUE";

export type GoalType =
  | "STUDY_TIME"
  | "SESSIONS"
  | "QUESTIONS"
  | "TOPICS";

export type GoalUnit =
  | "horas"
  | "sessões"
  | "questões"
  | "tópicos";

/* -------------------------------------------------------------------------- */
/*                                 GOAL CARD                                  */
/* -------------------------------------------------------------------------- */

export interface GoalCardData {
  id: string;

  title: string;

  type: GoalType;

  status: GoalStatus;

  currentValue: number;

  targetValue: number;

  unit: GoalUnit;

  progress: number;

  dueDate: string;
}

/* -------------------------------------------------------------------------- */
/*                                GOAL FORM                                   */
/* -------------------------------------------------------------------------- */

export interface GoalFormData {
  title: string;

  type: GoalType;

  targetValue: number;

  dueDate: string;
}

export interface GoalFormInitialData
  extends GoalFormData {
  id: string;
}