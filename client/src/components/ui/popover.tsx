import { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";
import Popper from "@/components/ui/primitves/popper-primitives.tsx";
import {
  AlignContentProps,
  PopperItemProps,
  PopperTriggerProps,
} from "@/types/ui/popper.ts";

export default function Popover({
  children,
  valueRemovable,
}: {
  children: ReactNode;
  valueRemovable?: boolean;
}) {
  return (
    <Popper valueRemovable={valueRemovable} menuType="popover">
      {children}
    </Popper>
  );
}

function PopoverTrigger({
  children,
  prefix,
  suffix,
  className,
  disabled,
  asChild,
}: PopperTriggerProps) {
  return (
    <Popper.Trigger
      suffix={suffix}
      prefix={prefix}
      className={cn(className)}
      asChild={asChild}
      disabled={disabled}
    >
      {children}
    </Popper.Trigger>
  );
}

function PopoverContent({
  children,
  className,
  align = "center",
}: {
  children: ReactNode;
  className?: string;
  align?: AlignContentProps;
}) {
  return (
    <Popper.Content align={align} className={cn("min-w-52", className)}>
      {children}
    </Popper.Content>
  );
}

function PopoverItem({
  children,
  disabled = false,
  className,
  asChild = false,
  suffix,
  prefix,
  value,
  onSelect,
}: PopperItemProps) {
  return (
    <Popper.Item
      disabled={disabled}
      prefix={prefix}
      suffix={suffix}
      asChild={asChild}
      className={className}
      value={value}
      onSelect={onSelect}
    >
      {children}
    </Popper.Item>
  );
}

Popover.Group = Popper.Group;
Popover.Label = Popper.Label;
Popover.Separator = Popper.Separator;
Popover.Trigger = PopoverTrigger;
Popover.Item = PopoverItem;
Popover.Content = PopoverContent;
