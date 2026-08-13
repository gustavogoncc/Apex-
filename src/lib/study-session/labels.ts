import type { LucideIcon } from "lucide-react";

import {
  BookOpen,
  Brain,
  CircleHelp,
  FileText,
  GraduationCap,
  ListChecks,
  MonitorPlay,
  RefreshCcw,
  Timer,
  Trophy,
} from "lucide-react";

import type {
  SessionGoal,
  SessionMode,
  SessionResult,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface SessionVisualConfig {
  label: string;

  icon: LucideIcon;

  badgeClassName: string;
}

/* -------------------------------------------------------------------------- */
/*                                   CONFIGS                                  */
/* -------------------------------------------------------------------------- */

const GOAL_CONFIG: Record<
  SessionGoal,
  SessionVisualConfig
> = {
  THEORY: {
    label: "Teoria",
    icon: BookOpen,
    badgeClassName:
      "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },

  REVIEW: {
    label: "Revisão",
    icon: RefreshCcw,
    badgeClassName:
      "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },

  QUESTIONS: {
    label: "Questões",
    icon: CircleHelp,
    badgeClassName:
      "bg-violet-500/10 text-violet-500 border-violet-500/20",
  },

  VIDEO: {
    label: "Videoaula",
    icon: MonitorPlay,
    badgeClassName:
      "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  },

  READING: {
    label: "Leitura",
    icon: FileText,
    badgeClassName:
      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },

  CUSTOM: {
    label: "Outro",
    icon: GraduationCap,
    badgeClassName:
      "bg-muted text-muted-foreground border-border",
  },
};

const MODE_CONFIG: Record<
  SessionMode,
  SessionVisualConfig
> = {
  FREE: {
    label: "Cronômetro Livre",
    icon: Timer,
    badgeClassName:
      "bg-primary/10 text-primary border-primary/20",
  },

  POMODORO: {
    label: "Pomodoro",
    icon: Brain,
    badgeClassName:
      "bg-red-500/10 text-red-500 border-red-500/20",
  },
};

const RESULT_CONFIG: Record<
  SessionResult,
  SessionVisualConfig
> = {
  THEORY_COMPLETED: {
    label: "Teoria concluída",
    icon: Trophy,
    badgeClassName:
      "bg-green-500/10 text-green-500 border-green-500/20",
  },

  REVIEW_COMPLETED: {
    label: "Revisão concluída",
    icon: RefreshCcw,
    badgeClassName:
      "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },

  QUESTIONS_SOLVED: {
    label: "Questões resolvidas",
    icon: CircleHelp,
    badgeClassName:
      "bg-violet-500/10 text-violet-500 border-violet-500/20",
  },

  TOPICS_COMPLETED: {
    label: "Tópicos concluídos",
    icon: ListChecks,
    badgeClassName:
      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },

  CONTENT_COMPLETED: {
    label: "Conteúdo concluído",
    icon: Trophy,
    badgeClassName:
      "bg-green-500/10 text-green-500 border-green-500/20",
  },

  CUSTOM: {
    label: "Outro",
    icon: GraduationCap,
    badgeClassName:
      "bg-muted text-muted-foreground border-border",
  },
};

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

export function getGoalConfig(
  goal: SessionGoal
): SessionVisualConfig {
  return GOAL_CONFIG[goal];
}

export function getModeConfig(
  mode: SessionMode
): SessionVisualConfig {
  return MODE_CONFIG[mode];
}

export function getResultConfig(
  result: SessionResult | null
): SessionVisualConfig {
  if (!result) {
    return {
      label: "Não informado",
      icon: FileText,
      badgeClassName:
        "bg-muted text-muted-foreground border-border",
    };
  }

  return RESULT_CONFIG[result];
}

export function getGoalLabel(
  goal: SessionGoal
) {
  return getGoalConfig(goal).label;
}

export function getModeLabel(
  mode: SessionMode
) {
  return getModeConfig(mode).label;
}

export function getResultLabel(
  result: SessionResult | null
) {
  return getResultConfig(result).label;
}