import * as React from "react";

import { cn } from "@/lib/utils";

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & {
  size?: "default" | "sm";
}) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        [
          "group/card",

          "flex",
          "flex-col",

          "overflow-hidden",

          "rounded-2xl",

          "border",
          "border-border",

          "bg-card",

          "text-card-foreground",

          "shadow-sm",

          "transition-all",
          "duration-200",

          "hover:-translate-y-1",
          "hover:border-primary/20",
          "hover:shadow-lg",

          "[--card-spacing:1.5rem]",

          "data-[size=sm]:[--card-spacing:1rem]",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
}

function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        [
          "flex",
          "items-start",
          "justify-between",

          "gap-4",

          "p-[var(--card-spacing)]",

          "pb-4",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        [
          "font-heading",

          "text-xl",

          "font-semibold",

          "tracking-tight",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        [
          "mt-1",

          "text-sm",

          "leading-6",

          "text-muted-foreground",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
}

function CardAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-[var(--card-spacing)] pb-[var(--card-spacing)]",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        [
          "flex",
          "items-center",
          "justify-between",

          "gap-4",

          "border-t",
          "border-border",

          "px-[var(--card-spacing)]",
          "py-5",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};