import React from "react";
import { PopperContentProps, PopperItemProps } from "@/types/ui/popper.ts";
import { LuChevronRight } from "react-icons/lu";
import PopperSubPrimitive from "@/components/ui/primitves/popper-primitive-sub.tsx";

const ContextMenuSub = ({ children }: { children: React.ReactNode }) => {
  return <PopperSubPrimitive>{children}</PopperSubPrimitive>;
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
    <PopperSubPrimitive.Trigger
      className={className}
      suffix={suffix}
      prefix={prefix}
      inset={inset}
      disabled={disabled}
    >
      {children}
    </PopperSubPrimitive.Trigger>
  );
};

const ContextMenuSubContent = ({ children, className }: PopperContentProps) => {
  return (
    <PopperSubPrimitive.Content className={className}>
      {children}
    </PopperSubPrimitive.Content>
  );
};

ContextMenuSub.Trigger = ContextMenuSubTrigger;
ContextMenuSub.Content = ContextMenuSubContent;

export default ContextMenuSub;
