import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./../lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xs text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-[rgb(243,243,243)] text-black hover:bg-[rgb(207,204,203)]",
        primary: "bg-[rgb(86,154,236)] text-white hover:bg-[rgb(64,142,232)]",
        danger: "bg-[rgb(206,55,93)] text-white hover:bg-[rgb(200,53,50)]",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-xs gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-xs px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  children,
  isLoading,
  size,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
  }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), "relative", className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 rounded-xs bg-white opacity-0 active:opacity-10" />

      {children}

      {isLoading && (
        <svg
          className="mr-2 h-4 w-4 animate-spin text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      )}
    </button>
  );
}

export { Button, buttonVariants };
