import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/lib/utils";

const inputVariants = cva(
  "bg-muted disabled:bg-input/50 dark:disabled:bg-input/80 h-8 rounded-lg px-2.5 py-1 text-sm transition-colors file:h-6 file:text-sm file:font-medium md:text-sm w-full min-w-0 outline-none file:inline-flex file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        editAd:
          "h-5.5 flex-1 rounded-none bg-transparent px-0 py-0 text-sm leading-5.5 text-black/85 placeholder:text-black/25",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const inputWrapperVariants = cva(
  "flex h-8 w-full min-w-0 items-center rounded-lg bg-muted disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        editAd:
          "h-8 w-[456px] gap-1 rounded-lg border border-[#D9D9D9] bg-white px-3 py-[5px] focus-within:border-[#40A9FF] focus-within:shadow-[0px_0px_0px_2px_rgba(24,144,255,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type InputProps = React.ComponentProps<"input"> & {
  endIcon?: React.ReactNode;
  wrapperClassName?: string;
  endIconClassName?: string;
  clearable?: boolean;
} & VariantProps<typeof inputVariants>;

function Input({
  className,
  type,
  endIcon,
  wrapperClassName,
  endIconClassName,
  clearable = false,
  variant = "default",
  ...props
}: InputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = React.useCallback(() => {
    const input = inputRef.current;

    if (!input || props.disabled || props.readOnly) {
      return;
    }

    const nativeValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value",
    )?.set;

    nativeValueSetter?.call(input, "");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
  }, [props.disabled, props.readOnly]);

  if (endIcon) {
    return (
      <div
        className={cn(
          inputWrapperVariants({ variant }),
          wrapperClassName,
        )}
      >
        <input
          ref={inputRef}
          type={type}
          data-slot="input"
          className={cn(
            variant === "default" &&
              "h-full min-w-0 flex-1 bg-transparent rounded-none",
            inputVariants({ variant }),
            className,
          )}
          {...props}
        />
        {clearable ? (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear input"
            className={cn(
              "flex h-full shrink-0 items-center justify-center text-foreground",
              endIconClassName,
            )}
          >
            {endIcon}
          </button>
        ) : (
          <div
            className={cn(
              "flex h-full shrink-0 items-center justify-center text-foreground",
              endIconClassName,
            )}
          >
            {endIcon}
          </div>
        )}
      </div>
    );
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Input, inputVariants, inputWrapperVariants };
