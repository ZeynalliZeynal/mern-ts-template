import { ComponentProps } from "react";
import { cn } from "@/lib/utils.ts";

const Input = ({ className, ...etc }: ComponentProps<"input">) => {
  return (
    <input
      {...etc}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-600 focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
    />
  );
};

export default Input;