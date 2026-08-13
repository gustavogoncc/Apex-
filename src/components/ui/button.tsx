import * as React from "react";

import {
  Button as ButtonPrimitive,
} from "@base-ui/react/button";

import {
  cva,
  type VariantProps,
} from "class-variance-authority";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* BUTTON VARIANTS                                                            */
/* -------------------------------------------------------------------------- */

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "shrink-0",
    "select-none",
    "whitespace-nowrap",

    "rounded-full",

    "font-medium",

    "gap-2",

    "transition-all duration-200 ease-out",

    "outline-none",

    "focus-visible:ring-2",
    "focus-visible:ring-primary",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background",

    "disabled:pointer-events-none",
    "disabled:opacity-50",

    "active:scale-[0.97]",

    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "[&_svg]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-[#2563EB]",
          "text-white",
          "shadow-sm",
          "hover:bg-[#1D4ED8]",
          "hover:-translate-y-0.5",
          "hover:shadow-lg",
        ].join(" "),

        secondary: [
          "bg-card",
          "border",
          "border-border",
          "text-foreground",
          "hover:bg-secondary",
          "hover:border-primary",
          "hover:-translate-y-0.5",
        ].join(" "),

        outline: [
          "bg-transparent",
          "border",
          "border-border",
          "text-foreground",
          "hover:bg-secondary",
          "hover:border-[#2563EB]",
        ].join(" "),

        ghost: [
          "bg-transparent",
          "text-foreground",
          "hover:bg-secondary",
          "hover:text-foreground",
        ].join(" "),

        destructive: [
          "bg-destructive",
          "text-white",
          "hover:bg-destructive/90",
          "hover:-translate-y-0.5",
        ].join(" "),
      },

      size: {
        sm: "h-10 px-4 text-sm",

        default: "h-11 px-5 text-sm",

        lg: "h-12 px-6 text-base [&_svg]:size-5",

        icon: "size-11",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/* -------------------------------------------------------------------------- */
/* PROPS                                                                      */
/* -------------------------------------------------------------------------- */

type ButtonProps =
  Omit<
    ButtonPrimitive.Props,
    "render"
  > &
  VariantProps<
    typeof buttonVariants
  > & {
    asChild?: boolean;
  };

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

const Button =
  React.forwardRef<
    HTMLElement,
    ButtonProps
  >(
    (
      {
        className,
        variant,
        size,
        asChild = false,
        children,
        ...props
      },
      ref
    ) => {
      const classes = cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      );

      /* -------------------------------------------------------------------- */
      /* AS CHILD                                                             */
      /* -------------------------------------------------------------------- */

      if (asChild) {
        const child =
          React.Children.only(
            children
          );

        if (
          !React.isValidElement(child)
        ) {
          throw new Error(
            "Button with asChild requires a single valid React element as its child."
          );
        }

        return (
          <ButtonPrimitive
            ref={
              ref as React.Ref<HTMLElement>
            }
            data-slot="button"
            className={classes}
            render={child}
            {...props}
          />
        );
      }

      /* -------------------------------------------------------------------- */
      /* DEFAULT BUTTON                                                       */
      /* -------------------------------------------------------------------- */

      return (
        <ButtonPrimitive
          ref={
            ref as React.Ref<HTMLElement>
          }
          data-slot="button"
          className={classes}
          {...props}
        >
          {children}
        </ButtonPrimitive>
      );
    }
  );

Button.displayName =
  "Button";

/* -------------------------------------------------------------------------- */
/* EXPORTS                                                                    */
/* -------------------------------------------------------------------------- */

export {
  Button,
  buttonVariants,
};

export type {
  ButtonProps,
};