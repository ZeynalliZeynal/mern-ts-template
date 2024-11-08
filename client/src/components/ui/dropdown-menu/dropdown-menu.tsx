import { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";
import Popper from "@/components/ui/primitves/popper-primitives.tsx";
import {
  AlignContentProps,
  PopperItemProps,
  PopperTriggerProps,
} from "@/types/ui/popper.ts";

export default function DropdownMenu({ children }: { children: ReactNode }) {
  return <Popper menuType="dropdown">{children}</Popper>;
}

function DropdownMenuTrigger({
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

function DropdownMenuContent({
  children,
  className,
  align = "center",
}: {
  children: ReactNode;
  className?: string;
  align?: AlignContentProps;
}) {
  return (
    <Popper.Content align={align} className={className}>
      {children}
    </Popper.Content>
  );
}

function DropdownMenuItem({
  children,
  disabled = false,
  className,
  asChild = false,
  suffix,
  prefix,
  onClick,
  inset,
}: PopperItemProps) {
  return (
    <Popper.Item
      disabled={disabled}
      prefix={prefix}
      suffix={suffix}
      asChild={asChild}
      className={className}
      onClick={onClick}
      inset={inset}
    >
      {children}
    </Popper.Item>
  );
}

DropdownMenu.Group = Popper.Group;
DropdownMenu.RadioGroup = Popper.RadioGroup;
DropdownMenu.RadioItem = Popper.RadioItem;
DropdownMenu.CheckboxItem = Popper.CheckboxItem;
DropdownMenu.Label = Popper.Label;
DropdownMenu.Separator = Popper.Separator;
DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Content = DropdownMenuContent;
