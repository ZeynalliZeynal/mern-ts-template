import { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";
import Popper from "@/components/ui/primitves/popper-primitives.tsx";
import {
  PopperContentProps,
  PopperItemProps,
  PopperTriggerProps,
} from "@/types/ui/popper.ts";

export default function Select({
  children,
  valueRemovable,
}: {
  children: ReactNode;
  valueRemovable?: boolean;
}) {
  return (
    <Popper valueRemovable={valueRemovable} menuType="select">
      {children}
    </Popper>
  );
}

function SelectTrigger({
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

function SelectContent({ children, className, align }: PopperContentProps) {
  return (
    <Popper.Content align={align} className={cn("w-52", className)}>
      {children}
    </Popper.Content>
  );
}

function SelectItem({
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

Select.Group = Popper.Group;
Select.Label = Popper.Label;
Select.Separator = Popper.Separator;
Select.Trigger = SelectTrigger;
Select.Item = SelectItem;
Select.Content = SelectContent;
