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

import {
  GOAL_TYPE_CONFIG,
} from "./goalType";

import type {
  GoalFormData,
  GoalFormInitialData,
} from "./types";

const goalFormSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(
        3,
        "Informe um título com pelo menos 3 caracteres."
      )
      .max(
        120,
        "O título deve ter no máximo 120 caracteres."
      ),

    type: z.enum([
      "STUDY_TIME",
      "SESSIONS",
      "QUESTIONS",
      "TOPICS",
    ]),

    targetValue: z
      .number({
        error:
          "Informe um objetivo válido.",
      })
      .positive(
        "O objetivo deve ser maior que zero."
      ),

    dueDate: z
      .string()
      .min(
        1,
        "Informe o prazo da meta."
      ),
  });

type GoalFormValues =
  z.infer<
    typeof goalFormSchema
  >;

interface GoalFormDialogProps {
  open: boolean;

  initialData?:
    | GoalFormInitialData
    | null;

  onOpenChange: (
    open: boolean
  ) => void;

  onSubmit: (
    data: GoalFormData
  ) => void | Promise<void>;

  isLoading?: boolean;
}

export function GoalFormDialog({
  open,
  initialData,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: GoalFormDialogProps) {
  const form =
    useForm<GoalFormValues>({
      resolver:
        zodResolver(
          goalFormSchema
        ),

      defaultValues: {
        title: "",

        type:
          "STUDY_TIME",

        targetValue: 1,

        dueDate: "",
      },
    });

  const selectedType =
    form.watch("type");

  const selectedGoalType =
    GOAL_TYPE_CONFIG[
      selectedType
    ];

  useEffect(() => {
    if (!open) {
      return;
    }

    if (initialData) {
      form.reset({
        title:
          initialData.title,

        type:
          initialData.type,

        targetValue:
          initialData.targetValue,

        dueDate:
          initialData.dueDate,
      });

      return;
    }

    form.reset({
      title: "",

      type:
        "STUDY_TIME",

      targetValue: 1,

      dueDate: "",
    });
  }, [
    open,
    initialData,
    form,
  ]);

  async function handleSubmit(
    values: GoalFormValues
  ) {
    const formData:
      GoalFormData = {
        title:
          values.title,

        type:
          values.type,

        targetValue:
          values.targetValue,

        dueDate:
          values.dueDate,
      };

    await onSubmit(
      formData
    );

    form.reset();

    onOpenChange(false);
  }

  const submitting =
    isLoading ||
    form.formState
      .isSubmitting;

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="sm:max-w-xl">

        <DialogHeader>

          <DialogTitle>
            {initialData
              ? "Editar meta"
              : "Nova meta"}
          </DialogTitle>

          <DialogDescription>
            {initialData
              ? "Atualize as informações da sua meta."
              : "Defina um novo objetivo para acompanhar sua evolução nos estudos."}
          </DialogDescription>

        </DialogHeader>

        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(
              handleSubmit
            )}
            className="space-y-6"
          >

            {/* -------------------------------------------------------------- */}
            {/* TITLE */}
            {/* -------------------------------------------------------------- */}

            <FormField
              control={
                form.control
              }
              name="title"
              render={({
                field,
              }) => (
                <FormItem>

                  <FormLabel>
                    Título
                  </FormLabel>

                  <FormControl>

                    <Input
                      placeholder="Ex.: Estudar 20 horas nesta semana"
                      {...field}
                    />

                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* -------------------------------------------------------------- */}
            {/* TYPE */}
            {/* -------------------------------------------------------------- */}

            <FormField
              control={
                form.control
              }
              name="type"
              render={({
                field,
              }) => (
                <FormItem>

                  <FormLabel>
                    Tipo da meta
                  </FormLabel>

                  <Select
                    value={
                      field.value
                    }
                    onValueChange={
                      field.onChange
                    }
                    disabled={
                      submitting
                    }
                  >

                    <FormControl>

                      <SelectTrigger>

                        <SelectValue
                          placeholder="Selecione o tipo da meta"
                        />

                      </SelectTrigger>

                    </FormControl>

                    <SelectContent>

                      {Object.entries(
                        GOAL_TYPE_CONFIG
                      ).map(
                        ([
                          value,
                          config,
                        ]) => {
                          const Icon =
                            config.icon;

                          return (
                            <SelectItem
                              key={
                                value
                              }
                              value={
                                value
                              }
                            >
                              <div className="flex items-center gap-2">

                                <Icon className="size-4" />

                                {
                                  config.label
                                }

                              </div>
                            </SelectItem>
                          );
                        }
                      )}

                    </SelectContent>

                  </Select>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* -------------------------------------------------------------- */}
            {/* TARGET */}
            {/* -------------------------------------------------------------- */}

            <FormField
              control={
                form.control
              }
              name="targetValue"
              render={({
                field,
              }) => (
                <FormItem>

                  <FormLabel>
                    Objetivo
                  </FormLabel>

                  <FormControl>

                    <div className="flex items-center gap-3">

                      <Input
                        type="number"
                        min={1}
                        value={
                          field.value
                        }
                        disabled={
                          submitting
                        }
                        onChange={(
                          event
                        ) =>
                          field.onChange(
                            Number(
                              event
                                .target
                                .value
                            )
                          )
                        }
                      />

                      <span className="whitespace-nowrap text-sm text-muted-foreground">
                        {
                          selectedGoalType.unit
                        }
                      </span>

                    </div>

                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* -------------------------------------------------------------- */}
            {/* DUE DATE */}
            {/* -------------------------------------------------------------- */}

            <FormField
              control={
                form.control
              }
              name="dueDate"
              render={({
                field,
              }) => (
                <FormItem>

                  <FormLabel>
                    Prazo
                  </FormLabel>

                  <FormControl>

                    <Input
                      type="date"
                      disabled={
                        submitting
                      }
                      {...field}
                    />

                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* -------------------------------------------------------------- */}
            {/* ACTIONS */}
            {/* -------------------------------------------------------------- */}

            <DialogFooter>

              <Button
                type="button"
                variant="outline"
                disabled={
                  submitting
                }
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
                  submitting
                }
              >
                {submitting
                  ? "Salvando..."
                  : initialData
                    ? "Salvar alterações"
                    : "Criar meta"}
              </Button>

            </DialogFooter>

          </form>

        </Form>

      </DialogContent>
    </Dialog>
  );
}