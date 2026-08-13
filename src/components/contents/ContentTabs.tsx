"use client";

import {
  BookOpen,
  NotebookPen,
  Target,
} from "lucide-react";

import {
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function ContentTabs() {
  return (
    <TabsList className="w-full justify-start gap-2">
      <TabsTrigger value="content">
        <BookOpen className="mr-2 size-4" />
        Conteúdo
      </TabsTrigger>

      <TabsTrigger value="goals">
        <Target className="mr-2 size-4" />
        Objetivos
      </TabsTrigger>

      <TabsTrigger value="notes">
        <NotebookPen className="mr-2 size-4" />
        Anotações
      </TabsTrigger>
    </TabsList>
  );
}