"use client";

import type {
  GoalCardData,
} from "@/components/contents/goals/types";

import {
  CreateGoalCard,
} from "@/components/contents/goals/CreateGoalCard";

import {
  EmptyGoals,
} from "@/components/contents/goals/EmptyGoals";

import {
  GoalCard,
} from "@/components/contents/goals/GoalsCard";

interface GoalsPanelProps {
  goals: GoalCardData[];

  onCreate: () => void;

  onSelect: (
    goal: GoalCardData
  ) => void;

  onUpdateProgress: (
    goal: GoalCardData
  ) => void;
}

export function GoalsPanel({
  goals,
  onCreate,
  onSelect,
  onUpdateProgress,
}: GoalsPanelProps) {
  if (goals.length === 0) {
    return (
      <section className="space-y-6">

        <CreateGoalCard
          onCreate={onCreate}
        />

        <EmptyGoals
          onCreate={onCreate}
        />

      </section>
    );
  }

  return (
    <section className="space-y-6">

      <CreateGoalCard
        onCreate={onCreate}
      />

      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-3
        "
      >

        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onClick={onSelect}
            onUpdateProgress={
              onUpdateProgress
            }
          />
        ))}

      </div>

    </section>
  );
}