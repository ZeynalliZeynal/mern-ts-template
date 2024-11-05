import { ReactNode } from "react";
import { MenuItemProps, MenuTriggerProps } from "@/components/ui/types.ts";
import Popper, {
  AlignWrapperProps,
} from "@/components/ui/primitves/popper-primitives.tsx";
import { cn } from "@/lib/utils.ts";
import Primitive from "@/components/ui/primitves/primitives.tsx";

export default function Popover({ children }: { children: ReactNode }) {
  return <Popper menuType="popover">{children}</Popper>;
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

function PopoverContent({
  children,
  className,
  align = "center",
}: {
  children: ReactNode;
  className?: string;
  align?: AlignWrapperProps;
}) {
  return (
    <Popper.Wrapper align={align} className={cn("min-w-52", className)}>
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
  removable,
}: {
  value: string;
  onSelect: (currentValue: string) => void;
  removable?: boolean;
} & MenuItemProps) {
  return (
    <Popper.Item
      valueRemovable={removable}
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
