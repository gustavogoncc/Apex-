import type {
  LucideIcon,
} from "lucide-react";

import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Target,
  Trophy,
} from "lucide-react";

import type {
  PerformanceType,
} from "./types";

interface PerformanceTypeConfig {
  label: string;

  icon: LucideIcon;

  color: string;
}

export const PERFORMANCE_TYPE_CONFIG: Record<
  PerformanceType,
  PerformanceTypeConfig
> = {
  STUDY_TIME: {
    label: "Tempo de estudo",

    icon: Clock3,

    color:
      "text-blue-600 bg-blue-500/10",
  },

  SESSIONS: {
    label: "Sessões",

    icon: BookOpen,

    color:
      "text-violet-600 bg-violet-500/10",
  },

  QUESTIONS: {
    label: "Questões",

    icon: Target,

    color:
      "text-orange-600 bg-orange-500/10",
  },

  ACCURACY: {
    label: "Precisão",

    icon: CheckCircle2,

    color:
      "text-emerald-600 bg-emerald-500/10",
  },

  GOALS: {
    label: "Metas",

    icon: Trophy,

    color:
      "text-amber-600 bg-amber-500/10",
  },
};