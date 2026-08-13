"use client";

import { useEffect } from "react";

import { z } from "zod";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import type {
  NoteFormData,
  NoteFormInitialData,
  NoteTopicOption,
} from "./types";

const noteFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      3,
      "O título deve possuir pelo menos 3 caracteres."
    )
    .max(
      120,
      "O título deve possuir no máximo 120 caracteres."
    ),

  topicId: z
    .string()
    .min(
      1,
      "Selecione um tópico."
    ),

  content: z
    .string()
    .trim()
    .min(
      10,
      "A anotação deve possuir pelo menos 10 caracteres."
    )
    .max(
      10000,
      "A anotação deve possuir no máximo 10.000 caracteres."
    ),
});

type NoteFormSchema = z.infer<
  typeof noteFormSchema
>;

interface NoteFormDialogProps {
  mode:
    | "create"
    | "edit";

  open: boolean;

  note?:
    | NoteFormInitialData
    | null;

  topics?:
    NoteTopicOption[];

  onOpenChange: (
    open: boolean
  ) => void;

  onSubmit: (
    values: NoteFormData
  ) => void | Promise<void>;
}

const MODE_CONFIG = {
  create: {
    title:
      "Nova anotação",

    description:
      "Registre um novo resumo para consultar durante seus estudos.",

    submitLabel:
      "Criar anotação",
  },

  edit: {
    title:
      "Editar anotação",

    description:
      "Atualize as informações desta anotação.",

    submitLabel:
      "Salvar alterações",
  },
} as const;

export function NoteFormDialog({
  mode,
  open,
  note,
  topics = [],
  onOpenChange,
  onSubmit,
}: NoteFormDialogProps) {
  const config =
    MODE_CONFIG[mode];

  const form =
    useForm<NoteFormSchema>({
      resolver:
        zodResolver(
          noteFormSchema
        ),

      defaultValues: {
        title: "",

        topicId: "",

        content: "",
      },
    });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (
      mode === "edit" &&
      note
    ) {
      form.reset({
        title:
          note.title,

        topicId:
          note.topicId,

        content:
          note.content,
      });

      return;
    }

    form.reset({
      title: "",

      topicId: "",

      content: "",
    });
  }, [
    open,
    mode,
    note,
    form,
  ]);

  async function handleSubmit(
    values: NoteFormSchema
  ) {
    const formData: NoteFormData =
      {
        title:
          values.title,

        topicId:
          values.topicId,

        content:
          values.content,
      };

    await onSubmit(
      formData
    );

    form.reset();

    onOpenChange(false);
  }

  const hasTopics =
    topics.length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {config.title}
          </DialogTitle>

          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(
              handleSubmit
            )}
            className="space-y-6"
          >
            {/* ------------------------------------------------------------------ */}
            {/* TITLE */}
            {/* ------------------------------------------------------------------ */}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Ex.: Revisão sobre Atos Administrativos"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------------------------------------------------------------ */}
            {/* TOPIC */}
            {/* ------------------------------------------------------------------ */}

            <FormField
              control={form.control}
              name="topicId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tópico
                  </FormLabel>

                  <Select
                    value={field.value}
                    onValueChange={
                      field.onChange
                    }
                    disabled={
                      !hasTopics
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            hasTopics
                              ? "Selecione um tópico"
                              : "Nenhum tópico disponível"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {topics.map(
                        (
                          topic
                        ) => (
                          <SelectItem
                            key={
                              topic.id
                            }
                            value={
                              topic.id
                            }
                          >
                            {
                              topic.title
                            }
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>

                  {!hasTopics && (
                    <FormDescription>
                      Crie um tópico antes de registrar
                      uma anotação.
                    </FormDescription>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------------------------------------------------------------ */}
            {/* CONTENT */}
            {/* ------------------------------------------------------------------ */}

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Conteúdo
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      rows={12}
                      placeholder="Escreva aqui seus resumos, conceitos importantes e observações..."
                      {...field}
                    />
                  </FormControl>

                  <div className="flex items-center justify-between">
                    <FormDescription>
                      Utilize este espaço para registrar
                      tudo o que pode ajudar nas suas
                      próximas revisões.
                    </FormDescription>

                    <span className="text-xs text-muted-foreground">
                      {field.value?.length ??
                        0}{" "}
                      / 10.000
                    </span>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------------------------------------------------------------ */}
            {/* ACTIONS */}
            {/* ------------------------------------------------------------------ */}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(
                    false
                  )
                }
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={
                  !hasTopics ||
                  form.formState
                    .isSubmitting
                }
              >
                {form.formState
                  .isSubmitting
                  ? "Salvando..."
                  : config.submitLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}