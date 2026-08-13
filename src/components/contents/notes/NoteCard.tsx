"use client";

import { ChevronRight, FileText, FolderOpen } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  formatStudyDate,
} from "@/lib/study-session";

import type {
  NoteCardData,
} from "./types";

interface NoteCardProps {
  note: NoteCardData;

  onClick?: (
    note: NoteCardData
  ) => void;
}

const MAX_PREVIEW_LENGTH = 180;

export function NoteCard({
  note,
  onClick,
}: NoteCardProps) {
  const preview =
    note.content.length >
    MAX_PREVIEW_LENGTH
      ? `${note.content.slice(
          0,
          MAX_PREVIEW_LENGTH
        )}...`
      : note.content;

  const updatedAt =
    formatStudyDate(
      note.updatedAt
    );

  return (
    <Card
      onClick={() => onClick?.(note)}
      className="
        group
        h-full
        cursor-pointer
        overflow-hidden
        transition-all
        duration-200
        hover:-translate-y-1
        hover:border-primary/40
        hover:shadow-lg
      "
    >
      <CardContent
        className="
          flex
          h-full
          flex-col
          p-6
        "
      >
        {/* ------------------------------------------------------------------ */}
        {/* HEADER */}
        {/* ------------------------------------------------------------------ */}

        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className="
                flex
                size-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-primary/10
              "
            >
              <FileText
                className="
                  size-5
                  text-primary
                "
              />
            </div>

            <div className="min-w-0">
              <h3
                className="
                  truncate
                  text-lg
                  font-semibold
                  transition-colors
                  duration-200
                  group-hover:text-primary
                "
              >
                {note.title}
              </h3>
            </div>
          </div>

          <ChevronRight
            className="
              mt-1
              size-5
              shrink-0
              text-muted-foreground
              transition-transform
              duration-200
              group-hover:translate-x-1
            "
          />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PREVIEW */}
        {/* ------------------------------------------------------------------ */}

        <div className="mt-5 flex-1">
          <p
            className="
              line-clamp-3
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            {preview}
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* FOOTER */}
        {/* ------------------------------------------------------------------ */}

        <div
          className="
            mt-auto
            flex
            items-center
            justify-between
            border-t
            pt-4
            text-sm
            text-muted-foreground
          "
        >
          <div className="flex items-center gap-2">
            <FolderOpen className="size-4" />

            <span className="truncate">
              {note.topicName}
            </span>
          </div>

          <span className="shrink-0">
            {updatedAt}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}