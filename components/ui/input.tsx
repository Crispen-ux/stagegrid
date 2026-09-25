import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, invalid, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded border bg-bg px-3 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-faint",
        invalid ? "border-warn" : "border-border focus:border-accent",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
