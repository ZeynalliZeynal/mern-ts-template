import { ReactNode } from "react";
import { MenuItemProps, MenuTriggerProps } from "@/components/ui/types.ts";
import Popper, {
  AlignWrapperProps,
} from "@/components/ui/primitves/popper-primitives.tsx";
import { cn } from "@/lib/utils.ts";
import Primitive from "@/components/ui/primitves/primitives.tsx";

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

function DropdownMenuContent({
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

function DropdownMenuItem({
  children,
  disabled = false,
  className,
  asChild = false,
  suffix,
  prefix,
  onClick,
}: MenuItemProps) {
  return (
    <Popper.Item
      disabled={disabled}
      prefix={prefix}
      suffix={suffix}
      asChild={asChild}
      className={className}
      onClick={onClick}
    >
      {children}
    </Popper.Item>
  );
}

DropdownMenu.Group = Primitive.Group;
DropdownMenu.Label = Primitive.Label;
DropdownMenu.Separator = Primitive.Separator;
DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Content = DropdownMenuContent;
