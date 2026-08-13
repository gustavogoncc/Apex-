"use client";

import {
  EmptyPerformance,
} from "./EmptyPerformance";

import {
  PerformanceCard,
} from "./PerformanceCard";

import type {
  PerformanceCardData,
} from "./types";

interface PerformanceGridProps {
  performances: PerformanceCardData[];

  onPerformanceClick?: (
    performance: PerformanceCardData
  ) => void;
}

export function PerformanceGrid({
  performances,
  onPerformanceClick,
}: PerformanceGridProps) {
  if (
    performances.length === 0
  ) {
    return (
      <EmptyPerformance />
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        md:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {performances.map(
        (
          performance
        ) => (
          <PerformanceCard
            key={performance.id}
            performance={performance}
            onClick={
              onPerformanceClick
            }
          />
        )
      )}
    </div>
  );
}