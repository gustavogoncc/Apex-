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
  TopicCardData,
  TopicFormData,
} from "./types";

import {
  TOPIC_STATUS_OPTIONS,
} from "./status";

const topicFormSchema = z.object({
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

  subtitle: z
    .string()
    .trim()
    .max(
      180,
      "O subtítulo deve possuir no máximo 180 caracteres."
    )
    .optional(),

  description: z
    .string()
    .trim()
    .max(
      1000,
      "A descrição deve possuir no máximo 1000 caracteres."
    )
    .optional(),

  status: z.enum(
    TOPIC_STATUS_OPTIONS.map(
      (status) => status.value
    ) as [
      (typeof TOPIC_STATUS_OPTIONS)[number]["value"],
      ...(typeof TOPIC_STATUS_OPTIONS)[number]["value"][],
    ]
  ),
});

type TopicFormSchema = z.infer<
  typeof topicFormSchema
>;

interface TopicFormDialogProps {
  mode:
    | "create"
    | "edit";

  open: boolean;

  topic?:
    | TopicCardData
    | null;

  onOpenChange: (
    open: boolean
  ) => void;

  onSubmit: (
    values: TopicFormData
  ) => void | Promise<void>;
}

const MODE_CONFIG = {
  create: {
    title: "Novo tópico",

    description:
      "Crie um novo tópico para organizar seus estudos.",

    submitLabel:
      "Criar tópico",
  },

  edit: {
    title:
      "Editar tópico",

    description:
      "Atualize as informações deste tópico.",

    submitLabel:
      "Salvar alterações",
  },
} as const;

export function TopicFormDialog({
  mode,
  open,
  topic,
  onOpenChange,
  onSubmit,
}: TopicFormDialogProps) {
  const config =
    MODE_CONFIG[mode];

  const form = useForm({
    resolver:
      zodResolver(
        topicFormSchema
      ),

    defaultValues: {
      title: "",

      subtitle: "",

      description: "",

      status:
        "A_ESTUDAR",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (
      mode === "edit" &&
      topic
    ) {
      form.reset({
        title:
          topic.title,

        subtitle:
          topic.subtitle ??
          "",

        description:
          topic.description ??
          "",

        status:
          topic.status,
      });

      return;
    }

    form.reset({
      title: "",

      subtitle: "",

      description: "",

      status:
        "A_ESTUDAR",
    });
  }, [
    open,
    mode,
    topic,
    form,
  ]);

  async function handleSubmit(
    values: TopicFormSchema
  ) {
    const formData: TopicFormData =
      {
        title:
          values.title,

        subtitle:
          values.subtitle,

        description:
          values.description,

        status:
          values.status,
      };

    await onSubmit(
      formData
    );

    form.reset();

    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-xl">
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
                      placeholder="Ex.: Atos Administrativos"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------------------------------------------------------------ */}
            {/* SUBTITLE */}
            {/* ------------------------------------------------------------------ */}

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subtítulo
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Ex.: Lei nº 8.112/90"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    Opcional.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------------------------------------------------------------ */}
            {/* DESCRIPTION */}
            {/* ------------------------------------------------------------------ */}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Descrição
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      rows={5}
                      placeholder="Adicione observações ou informações importantes sobre este tópico..."
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>
                    Opcional.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------------------------------------------------------------ */}
            {/* STATUS */}
            {/* ------------------------------------------------------------------ */}

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Status
                  </FormLabel>

                  <Select
                    value={
                      field.value
                    }
                    onValueChange={
                      field.onChange
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um status" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {TOPIC_STATUS_OPTIONS.map(
                        (
                          status
                        ) => (
                          <SelectItem
                            key={
                              status.value
                            }
                            value={
                              status.value
                            }
                          >
                            {
                              status.label
                            }
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>

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