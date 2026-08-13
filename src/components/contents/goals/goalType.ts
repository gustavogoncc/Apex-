import type {
  LucideIcon,
} from "lucide-react";

import {
  BookOpen,
  CircleHelp,
  Clock3,
  Target,
} from "lucide-react";

import type {
  GoalType,
  GoalUnit,
} from "./types";

interface GoalTypeConfig {
  label: string;

  icon: LucideIcon;

  unit: GoalUnit;
}

export const GOAL_TYPE_CONFIG: Record<
  GoalType,
  GoalTypeConfig
> = {
  STUDY_TIME: {
    label: "Tempo de estudo",

    icon: Clock3,

    unit: "horas",
  },

  SESSIONS: {
    label: "Sessões",

    icon: BookOpen,

    unit: "sessões",
  },

  QUESTIONS: {
    label: "Questões",

    icon: CircleHelp,

    unit: "questões",
  },

  TOPICS: {
    label: "Tópicos",

    icon: Target,

    unit: "tópicos",
  },
};