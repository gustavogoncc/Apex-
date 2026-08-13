"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex",
        "data-[orientation=horizontal]:flex-col",
        "data-[orientation=vertical]:flex-row",
        "gap-6",
        className
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  [
    "inline-flex",

    "w-fit",

    "items-center",

    "gap-2",

    "rounded-2xl",

    "border",
    "border-border",

    "bg-card",

    "p-1",

    "shadow-sm",

    "data-[orientation=vertical]:flex-col",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",

        line: [
          "rounded-none",

          "border-0",

          "border-b",

          "bg-transparent",

          "shadow-none",

          "px-0",

          "pb-1",
        ].join(" "),
      },
    },

    defaultVariants: {
      variant: "default",
    },
  }
);

function TabsList({
  className,
  variant,
  ...props
}: TabsPrimitive.List.Props &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        tabsListVariants({ variant }),
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        [
          "inline-flex",

          "items-center",
          "justify-center",

          "gap-2",

          "rounded-xl",

          "px-4",
          "py-2.5",

          "text-sm",

          "font-medium",

          "text-muted-foreground",

          "transition-all",
          "duration-200",

          "outline-none",

          "hover:bg-secondary",
          "hover:text-foreground",

          "data-active:bg-primary",
          "data-active:text-primary-foreground",
          "data-active:shadow-sm",

          "focus-visible:ring-2",
          "focus-visible:ring-primary/20",

          "disabled:pointer-events-none",
          "disabled:opacity-50",

          "group-data-[orientation=vertical]/tabs:w-full",
          "group-data-[orientation=vertical]/tabs:justify-start",

          "[&_svg]:size-4",
          "[&_svg]:shrink-0",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn(
        [
          "flex-1",

          "outline-none",

          "focus-visible:ring-2",
          "focus-visible:ring-primary/20",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
};