import { cn } from "@/utils/lib/utils";
import * as React from "react";

type InputProps = React.ComponentProps<"input"> & {
  endIcon?: React.ReactNode;
};

function Input({ className, type, endIcon, ...props }: InputProps) {
  if (endIcon) {
    return (
      <div className="flex h-8 w-full min-w-0 items-center rounded-lg bg-muted disabled:opacity-50">
        <input
          type={type}
          data-slot="input"
          className={cn(
            "h-full min-w-0 flex-1 rounded-l-lg bg-transparent px-2.5 py-1 text-sm transition-colors file:h-6 file:text-sm file:font-medium md:text-sm outline-none file:inline-flex file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed",
            className,
          )}
          {...props}
        />
        <div className="flex h-full shrink-0 items-center justify-center rounded-r-lg px-3 text-foreground">
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
