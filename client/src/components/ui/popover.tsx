import { ReactNode } from "react";
import { MenuItemProps, MenuTriggerProps } from "@/components/ui/types.ts";
import Popper from "@/components/ui/popper-primitives.tsx";
import { cn } from "@/lib/utils.ts";
import Primitive from "@/components/ui/primitives.tsx";

export default function Popover({
  children,
  defaultValue,
}: {
  children: ReactNode;
  defaultValue?: string;
}) {
  return (
    <Popper menuType="popover" defaultValue={defaultValue}>
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
}: MenuTriggerProps) {
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

function PopoverContent({ children }: { children: ReactNode }) {
  return (
    <Popper.Wrapper align="center" width="fit">
      {children}
    </Popper.Wrapper>
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
}: {
  value: string;
  onSelect: (currentValue: string) => void;
} & MenuItemProps) {
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

Popover.Group = Primitive.Group;
Popover.Label = Primitive.Label;
Popover.Separator = Primitive.Separator;
Popover.Trigger = PopoverTrigger;
Popover.Item = PopoverItem;
Popover.Content = PopoverContent;
