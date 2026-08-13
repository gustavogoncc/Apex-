/* -------------------------------------------------------------------------- */
/*                             PERFORMANCE TYPES                              */
/* -------------------------------------------------------------------------- */

export type PerformanceType =
  | "STUDY_TIME"
  | "SESSIONS"
  | "QUESTIONS"
  | "ACCURACY"
  | "GOALS";

export type PerformanceTrend =
  | "UP"
  | "DOWN"
  | "NEUTRAL";

/* -------------------------------------------------------------------------- */
/*                             PERFORMANCE CARD                               */
/* -------------------------------------------------------------------------- */

export interface PerformanceCardData {
  id: string;

  type: PerformanceType;

  title: string;

  value: string;

  subtitle: string;

  trend: PerformanceTrend;

  variation: number;
}

/* -------------------------------------------------------------------------- */
/*                           PERFORMANCE DETAILS                              */
/* -------------------------------------------------------------------------- */

export interface PerformanceDetailsData
  extends PerformanceCardData {
  description: string;
}