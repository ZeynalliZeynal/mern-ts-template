import React from "react";
import {
  PopperContentProps,
  PopperContextTriggerProps,
  PopperItemProps,
  PopperSeparatorProps,
} from "@/types/ui/popper.ts";
import Popper from "@/components/ui/primitves/popper-primitives.tsx";
import { cn } from "@/lib/utils.ts";

const ContextMenu = ({ children }: { children: React.ReactNode }) => {
  return <Popper menuType="context">{children}</Popper>;
};

const ContextMenuTrigger = ({
  children,
  className = undefined,
  asChild,
}: PopperContextTriggerProps) => {
  return (
    <Popper.ContextTrigger className={className} asChild={asChild}>
      {children}
    </Popper.ContextTrigger>
  );
};

const ContextMenuContent = ({ children, className }: PopperContentProps) => {
  return (
    <Popper.Content
      className={cn(
        "bg-ui-background rounded-ui-content p-ui-content border",
        className,
      )}
    >
      {children}
    </Popper.Content>
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

const ContextMenuSeparator = ({ className, style }: PopperSeparatorProps) => {
  return (
    <Popper.Separator
      style={style}
      className={cn("h-px -mx-ui-content my-ui-content bg-border", className)}
    />
  );
};

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Item = ContextMenuItem;
ContextMenu.Content = ContextMenuContent;
ContextMenu.Label = Popper.Label;
ContextMenu.Group = Popper.Group;
ContextMenu.Separator = ContextMenuSeparator;
ContextMenu.CheckboxItem = Popper.CheckboxItem;
ContextMenu.RadioGroup = Popper.RadioGroup;
ContextMenu.RadioGroup = Popper.RadioGroup;
ContextMenu.RadioItem = Popper.RadioItem;

export default ContextMenu;
