"use client";

import {
  BookOpen,
  Calendar,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  formatStudyDate,
} from "@/lib/study-session";

import type {
  NoteCardData,
} from "./types";

interface NoteDetailsDialogProps {
  open: boolean;

  note: NoteCardData | null;

  onOpenChange: (
    open: boolean
  ) => void;

  onEdit?: (
    note: NoteCardData
  ) => void;

  onDelete?: (
    note: NoteCardData
  ) => void;
}

export function NoteDetailsDialog({
  open,
  note,
  onOpenChange,
  onEdit,
  onDelete,
}: NoteDetailsDialogProps) {
  if (!note) {
    return null;
  }

  const createdAt =
    formatStudyDate(
      note.createdAt
    );

  const updatedAt =
    formatStudyDate(
      note.updatedAt
    );

  const context =
    note.subjectName
      ? `${note.subjectName} • ${note.topicName}`
      : note.topicName;

  const wasUpdated =
    note.updatedAt !==
    note.createdAt;


      return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {note.title}
          </DialogTitle>

          <DialogDescription>
            Visualize os detalhes desta anotação.
          </DialogDescription>
        </DialogHeader>

        {/* ------------------------------------------------------------------ */}
        {/* CONTEXT */}
        {/* ------------------------------------------------------------------ */}

        <section
          className="
            flex
            items-center
            gap-2
            rounded-lg
            border
            bg-muted/30
            px-4
            py-3
            text-sm
            text-muted-foreground
          "
        >
          <BookOpen className="size-4 shrink-0" />

          <span className="truncate">
            {context}
          </span>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* CONTENT */}
        {/* ------------------------------------------------------------------ */}

        <section className="space-y-3">
          <h3 className="text-sm font-medium">
            Conteúdo
          </h3>

          <div
            className="
              max-h-[50vh]
              overflow-y-auto
              rounded-lg
              border
              bg-muted/30
              p-4
              text-sm
              leading-7
              whitespace-pre-wrap
              break-words
            "
          >
            {note.content}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* METADATA */}
        {/* ------------------------------------------------------------------ */}

        <section
          className="
            flex
            flex-col
            gap-3
            rounded-lg
            border
            p-4
            text-sm
            sm:flex-row
            sm:justify-between
          "
        >
          <div className="flex items-center gap-2">
            <Calendar
              className="
                size-4
                text-muted-foreground
              "
            />

            <div className="flex flex-col">
              <span className="text-muted-foreground">
                Criada
              </span>

              <span>{createdAt}</span>
            </div>
          </div>

          {wasUpdated && (
            <div className="flex items-center gap-2">
              <Calendar
                className="
                  size-4
                  text-muted-foreground
                "
              />

              <div className="flex flex-col">
                <span className="text-muted-foreground">
                  Atualizada
                </span>

                <span>{updatedAt}</span>
              </div>
            </div>
          )}
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* ACTIONS */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={() =>
              onEdit?.(note)
            }
          >
            <Pencil className="mr-2 size-4" />

            Editar
          </Button>

          <Button
            variant="destructive"
            onClick={() =>
              onDelete?.(note)
            }
          >
            <Trash2 className="mr-2 size-4" />

            Excluir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}