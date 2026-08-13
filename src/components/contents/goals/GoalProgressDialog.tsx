"use client";

import { useEffect } from "react";

import { z } from "zod";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { CheckCircle2 } from "lucide-react";

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

import type {
  GoalCardData,
} from "./types";

/* -------------------------------------------------------------------------- */
/* SCHEMA                                                                     */
/* -------------------------------------------------------------------------- */

const goalProgressSchema =
  z.object({
    currentValue: z
      .number({
        error:
          "Informe um valor válido.",
      })
      .int(
        "O progresso deve ser um número inteiro."
      )
      .min(
        0,
        "O progresso não pode ser negativo."
      ),
  });

type GoalProgressFormValues =
  z.infer<
    typeof goalProgressSchema
  >;

/* -------------------------------------------------------------------------- */
/* PROPS                                                                      */
/* -------------------------------------------------------------------------- */

interface GoalProgressDialogProps {
  open: boolean;

  goal:
    | GoalCardData
    | null;

  onOpenChange: (
    open: boolean
  ) => void;

  onSave: (
    currentValue: number
  ) => void | Promise<void>;

  isLoading?: boolean;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function GoalProgressDialog({
  open,
  goal,
  onOpenChange,
  onSave,
  isLoading = false,
}: GoalProgressDialogProps) {
  const form =
    useForm<GoalProgressFormValues>({
      resolver:
        zodResolver(
          goalProgressSchema
        ),

      defaultValues: {
        currentValue: 0,
      },
    });

  /* ------------------------------------------------------------------------ */
  /* RESET                                                                    */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!open || !goal) {
      return;
    }

    form.reset({
      currentValue:
        goal.currentValue,
    });
  }, [
    open,
    goal,
    form,
  ]);

  /* ------------------------------------------------------------------------ */
  /* SUBMIT                                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleSubmit(
    values: GoalProgressFormValues
  ) {
    if (!goal) {
      return;
    }

    /*
     * Não permite que o valor ultrapasse
     * a meta, mesmo que o usuário altere
     * o valor manualmente.
     */
    const currentValue =
      Math.min(
        values.currentValue,
        goal.targetValue
      );

    await onSave(
      currentValue
    );

    form.reset({
      currentValue,
    });

    onOpenChange(false);
  }

  /* ------------------------------------------------------------------------ */
  /* RENDER                                                                   */
  /* ------------------------------------------------------------------------ */

  if (!goal) {
    return null;
  }

  const isCompleted =
    goal.currentValue >=
    goal.targetValue;

  const remaining =
    Math.max(
      goal.targetValue -
        goal.currentValue,
      0
    );

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="sm:max-w-md">

        <DialogHeader>

          <DialogTitle>
            Atualizar progresso
          </DialogTitle>

          <DialogDescription>
            Acompanhe manualmente o progresso
            desta meta.
          </DialogDescription>

        </DialogHeader>

        <Form {...form}>

          <form
            onSubmit={form.handleSubmit(
              handleSubmit
            )}
            className="space-y-6"
          >

            {/* ---------------------------------------------------------------- */}
            {/* GOAL                                                             */}
            {/* ---------------------------------------------------------------- */}

            <div
              className="
                rounded-lg
                border
                bg-muted/30
                p-4
              "
            >

              <div className="flex items-start justify-between gap-4">

                <div className="min-w-0">

                  <p
                    className="
                      text-sm
                      font-medium
                    "
                  >
                    {goal.title}
                  </p>

                  <p
                    className="
                      mt-1
                      text-sm
                      text-muted-foreground
                    "
                  >
                    Meta:{" "}
                    {goal.targetValue}{" "}
                    {goal.unit}
                  </p>

                </div>

                {isCompleted && (
                  <CheckCircle2
                    className="
                      size-5
                      shrink-0
                      text-emerald-500
                    "
                  />
                )}

              </div>

            </div>

            {/* ---------------------------------------------------------------- */}
            {/* CURRENT VALUE                                                    */}
            {/* ---------------------------------------------------------------- */}

            <FormField
              control={
                form.control
              }
              name="currentValue"
              render={({
                field,
              }) => (
                <FormItem>

                  <FormLabel>
                    Progresso atual
                  </FormLabel>

                  <FormControl>

                    <div className="flex items-center gap-3">

                      <Input
                        type="number"
                        min={0}
                        max={
                          goal.targetValue
                        }
                        step={1}
                        value={
                          field.value
                        }
                        onChange={(
                          event
                        ) => {
                          const value =
                            Number(
                              event
                                .target
                                .value
                            );

                          field.onChange(
                            Number.isNaN(
                              value
                            )
                              ? 0
                              : value
                          );
                        }}
                        disabled={
                          isLoading
                        }
                      />

                      <span
                        className="
                          whitespace-nowrap
                          text-sm
                          text-muted-foreground
                        "
                      >
                        {goal.unit}
                      </span>

                    </div>

                  </FormControl>

                  <FormMessage />

                </FormItem>
              )}
            />

            {/* ---------------------------------------------------------------- */}
            {/* REMAINING                                                        */}
            {/* ---------------------------------------------------------------- */}

            {!isCompleted && (
              <p
                className="
                  text-sm
                  text-muted-foreground
                "
              >
                Faltam{" "}
                <span className="font-medium text-foreground">
                  {remaining}{" "}
                  {goal.unit}
                </span>{" "}
                para concluir a meta.
              </p>
            )}

            {isCompleted && (
              <p
                className="
                  text-sm
                  text-emerald-500
                "
              >
                Meta concluída. Ao salvar,
                ela permanecerá marcada como
                concluída.
              </p>
            )}

            {/* ---------------------------------------------------------------- */}
            {/* ACTIONS                                                          */}
            {/* ---------------------------------------------------------------- */}

            <DialogFooter>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  onOpenChange(
                    false
                  )
                }
                disabled={
                  isLoading
                }
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={
                  isLoading
                }
              >
                {isLoading
                  ? "Salvando..."
                  : "Salvar progresso"}
              </Button>

            </DialogFooter>

          </form>

        </Form>

      </DialogContent>
    </Dialog>
  );
}