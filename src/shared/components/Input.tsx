import { cn } from "@/utils/lib/utils";
import * as React from "react";

type InputProps = React.ComponentProps<"input"> & {
  endIcon?: React.ReactNode;
  wrapperClassName?: string;
  endIconClassName?: string;
};

function Input({
  className,
  type,
  endIcon,
  wrapperClassName,
  endIconClassName,
  ...props
}: InputProps) {
  if (endIcon) {
    return (
      <div
        className={cn(
          "flex h-8 w-full min-w-0 items-center rounded-lg bg-muted disabled:opacity-50",
          wrapperClassName,
        )}
      >
        <input
          type={type}
          data-slot="input"
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent px-2.5 py-1 text-sm transition-colors file:h-6 file:text-sm file:font-medium md:text-sm outline-none file:inline-flex file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
        <div
          className={cn(
            "flex h-full shrink-0 items-center justify-center text-foreground",
            endIconClassName,
          )}
        >
          {endIcon}
        </div>
      </div>
    );
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-muted disabled:bg-input/50 dark:disabled:bg-input/80 h-8 rounded-lg px-2.5 py-1 text-sm transition-colors file:h-6 file:text-sm file:font-medium   md:text-sm w-full min-w-0 outline-none file:inline-flex  file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
