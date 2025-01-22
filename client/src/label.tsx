import { ComponentProps } from "react";
import { cn } from "@/lib/utils.ts";

const Label = ({ children, className, ...etc }: ComponentProps<"label">) => {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...etc}
    >
      {children}
    </label>
  );
};

export default Label;
