import React from "react";
import {
  PopperContentProps,
  PopperItemProps,
  PopperTriggerProps,
} from "@/types/ui/popper.ts";
import PopperPrimitive from "@/components/ui/primitves/popper-primitives-v2.tsx";

const ContextMenu = ({ children }: { children: React.ReactNode }) => {
  return <PopperPrimitive menuType="context">{children}</PopperPrimitive>;
};

const ContextMenuTrigger = ({
  children,
  className = undefined,
  asChild,
}: PopperTriggerProps) => {
  return (
    <PopperPrimitive.Trigger className={className} asChild={asChild}>
      {children}
    </PopperPrimitive.Trigger>
  );
};

const ContextMenuContent = ({ children, className }: PopperContentProps) => {
  return (
    <PopperPrimitive.Content className={className}>
      {children}
    </PopperPrimitive.Content>
  );
};

const ContextMenuItem = ({
  children,
  className,
  suffix,
  prefix,
  asChild,
  inset,
  href,
  disabled,
  shortcut,
}: PopperItemProps) => {
  return (
    <PopperPrimitive.Item
      className={className}
      suffix={suffix}
      prefix={prefix}
      asChild={asChild}
      inset={inset}
      href={href}
      disabled={disabled}
      shortcut={shortcut}
    >
      {children}
    </PopperPrimitive.Item>
  );
};

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Item = ContextMenuItem;
ContextMenu.Content = ContextMenuContent;
ContextMenu.Label = PopperPrimitive.Label;
ContextMenu.Group = PopperPrimitive.Group;
ContextMenu.Separator = PopperPrimitive.Separator;
export default ContextMenu;
