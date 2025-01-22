import { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";
import Popper from "@/components/ui/primitves/popper.tsx";
import {
  PopperContentProps,
  PopperItemProps,
  PopperSeparatorProps,
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

function SelectContent({
  children,
  className,
  align,
  fitToTrigger,
}: PopperContentProps) {
  return (
    <Popper.Content
      align={align}
      className={cn(
        "bg-ui-background rounded-ui-content p-ui-content border",
        className,
      )}
      fitToTrigger={fitToTrigger}
    >
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

const SelectSeparator = ({ className, style }: PopperSeparatorProps) => {
  return (
    <Popper.Separator
      style={style}
      className={cn("h-px -mx-ui-content my-ui-content bg-border", className)}
    />
  );
};

Select.Group = Popper.Group;
Select.Label = Popper.Label;
Select.Separator = SelectSeparator;
Select.Trigger = SelectTrigger;
Select.Item = SelectItem;
Select.Content = SelectContent;
