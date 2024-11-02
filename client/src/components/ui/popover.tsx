import { ReactNode } from "react";
import { MenuItemProps, MenuTriggerProps } from "@/components/ui/types.ts";
import Popper, {
  PopperItem,
  PopperTrigger,
  PopperWrapper,
} from "@/components/ui/popper-primitives.tsx";
import { cn } from "@/lib/utils.ts";
import Primitive from "@/components/ui/primitives/primitive.tsx";

export default function Popover({
  children,
  defaultValue,
}: {
  children: ReactNode;
  defaultValue?: string;
}) {
  return (
    <Popper menuType="popover" defaultValue={defaultValue}>
      {children}
    </Popper>
  );
}

const PopoverTrigger = ({
  children,
  prefix,
  suffix,
  className,
  asChild,
}: MenuTriggerProps) => {
  return (
    <PopperTrigger
      suffix={suffix}
      prefix={prefix}
      className={cn(className)}
      asChild={asChild}
    >
      {children}
    </PopperTrigger>
  );
};

const PopoverContent = ({ children }: { children: ReactNode }) => {
  return (
    <PopperWrapper align="center" width="fit">
      {children}
    </PopperWrapper>
  );
};

const PopoverItem = ({
  children,
  disabled = false,
  className,
  asChild = false,
  suffix,
  prefix,
  value,
  onSelect,
}: {
  value: string;
  onSelect: (currentValue: string) => void;
} & MenuItemProps) => {
  return (
    <PopperItem
      disabled={disabled}
      prefix={prefix}
      suffix={suffix}
      asChild={asChild}
      className={className}
      value={value}
      onSelect={onSelect}
    >
      {children}
    </PopperItem>
  );
};

Popover.Group = Primitive.Group;
Popover.Label = Primitive.Label;
Popover.Separator = Primitive.Separator;
Popover.Trigger = PopoverTrigger;
Popover.Item = PopoverItem;
Popover.Content = PopoverContent;
