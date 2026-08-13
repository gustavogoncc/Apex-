"use client";

import type {
  NoteCardData,
} from "@/components/contents/notes/types";

import {
  CreateNoteCard,
} from "@/components/contents/notes/CreateNoteCard";

import {
  EmptyNotes,
} from "@/components/contents/notes/EmptyNotes";

import {
  NoteCard,
} from "@/components/contents/notes/NoteCard";

interface NotesPanelProps {
  notes: NoteCardData[];

  onCreate: () => void;

  onSelect: (
    note: NoteCardData
  ) => void;
}

export function NotesPanel({
  notes,
  onCreate,
  onSelect,
}: NotesPanelProps) {
  if (notes.length === 0) {
    return (
      <section className="space-y-6">

        <CreateNoteCard
          onCreate={onCreate}
        />

        <EmptyNotes
          onCreate={onCreate}
        />

      </section>
    );
  }

  return (
    <section className="space-y-6">

      <CreateNoteCard
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

        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={onSelect}
          />
        ))}

      </div>

    </section>
  );
}