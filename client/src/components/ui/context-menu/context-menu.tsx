import React from "react";
import {
  PopperContentProps,
  PopperItemProps,
  PopperTriggerProps,
} from "@/types/ui/popper.ts";
import Popper from "@/components/ui/primitves/popper-primitives-v2.tsx";

const ContextMenu = ({ children }: { children: React.ReactNode }) => {
  return <Popper menuType="context">{children}</Popper>;
};

const ContextMenuTrigger = ({
  children,
  className = undefined,
  asChild,
}: PopperTriggerProps) => {
  return (
    <Popper.Trigger className={className} asChild={asChild}>
      {children}
    </Popper.Trigger>
  );
};

const ContextMenuContent = ({ children, className }: PopperContentProps) => {
  return <Popper.Content className={className}>{children}</Popper.Content>;
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
  onClick,
  onKeyDown,
}: PopperItemProps) => {
  return (
    <Popper.Item
      className={className}
      suffix={suffix}
      prefix={prefix}
      asChild={asChild}
      inset={inset}
      href={href}
      disabled={disabled}
      shortcut={shortcut}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </Popper.Item>
  );
};

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Item = ContextMenuItem;
ContextMenu.Content = ContextMenuContent;
ContextMenu.Label = Popper.Label;
ContextMenu.Group = Popper.Group;
ContextMenu.Separator = Popper.Separator;
ContextMenu.CheckboxItem = Popper.CheckboxItem;
ContextMenu.RadioGroup = Popper.RadioGroup;
ContextMenu.RadioGroup = Popper.RadioGroup;
ContextMenu.RadioItem = Popper.RadioItem;

export default ContextMenu;
