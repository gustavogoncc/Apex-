"use client";

import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return (
    <DialogPrimitive.Trigger
      data-slot="dialog-trigger"
      {...props}
    />
  );
}

function DialogPortal(props: DialogPrimitive.Portal.Props) {
  return (
    <DialogPrimitive.Portal
      data-slot="dialog-portal"
      {...props}
    />
  );
}

function DialogClose(props: DialogPrimitive.Close.Props) {
  return (
    <DialogPrimitive.Close
      data-slot="dialog-close"
      {...props}
    />
  );
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50",
        "bg-black/60",
        "backdrop-blur-md",
        "duration-200",
        "data-open:animate-in data-open:fade-in-0",
        "data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50",
          "w-[calc(100%-2rem)] max-w-lg",
          "-translate-x-1/2 -translate-y-1/2",

          "rounded-2xl",
          "border border-border",
          "bg-card",
          "text-card-foreground",

          "shadow-2xl",

          "p-7",

          "duration-200",

          "outline-none",

          "data-open:animate-in",
          "data-open:fade-in-0",
          "data-open:zoom-in-95",

          "data-closed:animate-out",
          "data-closed:fade-out-0",
          "data-closed:zoom-out-95",

          className
        )}
        {...props}
      >
        {children}

        {showCloseButton && (
          <DialogPrimitive.Close
            render={
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-5 top-5 size-9"
              />
            }
          >
            <XIcon className="size-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "mb-6",
        "space-y-2",
        className
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  children,
  showCloseButton = false,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "mt-8",
        "flex flex-col-reverse gap-3",
        "border-t border-border",
        "pt-6",

        "sm:flex-row sm:justify-end",

        className
      )}
      {...props}
    >
      {children}

      {showCloseButton && (
        <DialogPrimitive.Close
          render={<Button variant="secondary" />}
        >
          Cancelar
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading",
        "text-2xl",
        "font-semibold",
        "tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm",
        "leading-6",
        "text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};