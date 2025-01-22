import React from "react";
import { PopperContentProps, PopperItemProps } from "@/types/ui/popper.ts";
import { LuChevronRight } from "react-icons/lu";
import PopperSub from "@/components/ui/primitves/popper-sub.tsx";

const ContextMenuSub = ({ children }: { children: React.ReactNode }) => {
  return <PopperSub>{children}</PopperSub>;
};

const ContextMenuSubTrigger = ({
  children,
  className,
  inset,
  disabled,
  prefix,
  suffix = <LuChevronRight />,
}: PopperItemProps) => {
  return (
    <PopperSub.Trigger
      className={className}
      suffix={suffix}
      prefix={prefix}
      inset={inset}
      disabled={disabled}
    >
      {children}
    </PopperSub.Trigger>
  );
};

const ContextMenuSubContent = ({ children, className }: PopperContentProps) => {
  return (
    <PopperSub.Content className={className}>{children}</PopperSub.Content>
  );
};

ContextMenuSub.Trigger = ContextMenuSubTrigger;
ContextMenuSub.Content = ContextMenuSubContent;

export default ContextMenuSub;
