"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

function SelectGroup({
  className,
  ...props
}: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("p-1", className)}
      {...props}
    />
  );
}

function SelectValue({
  className,
  ...props
}: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 items-center truncate", className)}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        [
          "flex",
          "w-full",
          "items-center",
          "justify-between",

          "gap-2",

          "rounded-xl",

          "border",
          "border-border",

          "bg-card",

          "px-4",

          "text-sm",
          "text-foreground",

          "transition-all",
          "duration-200",

          "outline-none",

          "data-placeholder:text-muted-foreground",

          "focus-visible:border-primary",
          "focus-visible:ring-2",
          "focus-visible:ring-primary/20",

          "disabled:pointer-events-none",
          "disabled:cursor-not-allowed",
          "disabled:opacity-50",

          "data-[size=default]:h-11",
          "data-[size=sm]:h-10",

          "[&_svg]:shrink-0",
          "[&_svg]:size-4",
        ].join(" "),
        className
      )}
      {...props}
    >
      {children}

      <SelectPrimitive.Icon
        render={
          <ChevronDownIcon className="text-muted-foreground transition-transform duration-200 data-[popup-open]:rotate-180" />
        }
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            [
              "w-[var(--anchor-width)]",
              "max-h-80",

              "overflow-hidden",

              "rounded-2xl",

              "border",
              "border-border",

              "bg-card",

              "shadow-xl",

              "p-1",

              "text-card-foreground",

              "duration-200",

              "data-open:animate-in",
              "data-open:fade-in-0",
              "data-open:zoom-in-95",

              "data-closed:animate-out",
              "data-closed:fade-out-0",
              "data-closed:zoom-out-95",
            ].join(" "),
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />

          <SelectPrimitive.List>
            {children}
          </SelectPrimitive.List>

          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      className={cn(
        "px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        [
          "relative",

          "flex",
          "cursor-pointer",
          "items-center",

          "rounded-lg",

          "px-3",
          "py-2.5",

          "text-sm",

          "transition-colors",

          "outline-none",

          "focus:bg-secondary",
          "focus:text-foreground",

          "data-disabled:pointer-events-none",
          "data-disabled:opacity-50",
        ].join(" "),
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex-1 truncate">
        {children}
      </SelectPrimitive.ItemText>

      <SelectPrimitive.ItemIndicator
        render={
          <span className="absolute right-3 flex items-center">
            <CheckIcon className="size-4 text-primary" />
          </span>
        }
      />
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      className={cn("my-1 border-t border-border", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      className={cn(
        "flex h-8 items-center justify-center text-muted-foreground",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      className={cn(
        "flex h-8 items-center justify-center text-muted-foreground",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};