"use client";

import type {
  TopicCardData,
} from "@/components/contents/topics/types";

import {
  CreateTopicCard,
} from "@/components/contents/topics/CreateTopicCard";

import {
  EmptyTopics,
} from "@/components/contents/topics/EmptyTopics";

import {
  TopicCard,
} from "@/components/contents/topics/TopicCard";

interface ContentPanelProps {
  topics: TopicCardData[];

  onCreate: () => void;

  onSelect: (
    topic: TopicCardData
  ) => void;
}

export function ContentPanel({
  topics,
  onCreate,
  onSelect,
}: ContentPanelProps) {
  if (topics.length === 0) {
    return (
      <section className="space-y-6">

        <CreateTopicCard
          onCreate={onCreate}
        />

        <EmptyTopics
          onCreate={onCreate}
        />

      </section>
    );
  }

  return (
    <section className="space-y-6">

      <CreateTopicCard
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

        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onClick={onSelect}
          />
        ))}

      </div>

    </section>
  );
}