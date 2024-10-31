import { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";

export const PrimitiveGroup = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div role="group" className={cn(className)}>
      {children}
    </div>
  );
};

export const PrimitiveSeparator = ({ className }: { className?: string }) => {
  return (
    <div
      role="separator"
      className={cn("h-px -mx-ui-content my-ui-content bg-border", className)}
    />
  );
};

export const PrimitiveLabel = ({
  children,
  className,
  inset = false,
  suffix,
  prefix,
}: {
  children: ReactNode;
  className?: string;
  inset?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}) => {
  return (
    <div
      tabIndex={-1}
      className={cn(
        "text-foreground font-semibold flex items-center w-full",
        {
          "justify-between": suffix,
          "gap-2": prefix,
          "p-ui-item-inset": inset,
          "p-ui-item": !inset,
        },
        className,
      )}
    >
      {prefix && <span className="size-4">{prefix}</span>}
      {children}
      {suffix && <span className="size-4">{suffix}</span>}
    </div>
  );
};
