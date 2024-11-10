import { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";
import Popper from "@/components/ui/primitves/popper-primitives.tsx";
import {
  PopperContentProps,
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
  align,
  fitToTrigger,
}: PopperContentProps) {
  return (
    <Popper.Content
      fitToTrigger={fitToTrigger}
      align={align}
      className={className}
    >
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
  href,
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
      href={href}
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
