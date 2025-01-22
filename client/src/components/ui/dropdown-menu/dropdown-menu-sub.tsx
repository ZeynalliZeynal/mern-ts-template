import React from "react";
import { PopperContentProps, PopperItemProps } from "@/types/ui/popper.ts";
import { LuChevronRight } from "react-icons/lu";
import PopperSubPrimitive from "@/components/ui/primitves/popper-sub.tsx";

const DropdownMenuSub = ({ children }: { children: React.ReactNode }) => {
  return <PopperSubPrimitive>{children}</PopperSubPrimitive>;
};

const DropdownMenuSubTrigger = ({
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

const DropdownMenuSubContent = ({
  children,
  className,
}: PopperContentProps) => {
  return (
    <PopperSubPrimitive.Content className={className}>
      {children}
    </PopperSubPrimitive.Content>
  );
};

DropdownMenuSub.Trigger = DropdownMenuSubTrigger;
DropdownMenuSub.Content = DropdownMenuSubContent;

export default DropdownMenuSub;
