import { cn } from "@/lib/utils.ts";
import Popper from "@/components/ui/primitves/popper.tsx";
import {
  CommonParentProps,
  PopperContentProps,
  PopperItemProps,
  PopperSeparatorProps,
  PopperTriggerProps,
} from "@/types/ui/popper.ts";

export default function DropdownMenu(props: CommonParentProps) {
  return (
    <Popper menuType="dropdown" {...props}>
      {props.children}
    </Popper>
  );
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
      className={cn(
        "bg-ui-background rounded-ui-content p-ui-content border",
        className,
      )}
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

const DropdownMenuSeparator = ({ className, style }: PopperSeparatorProps) => {
  return (
    <Popper.Separator
      style={style}
      className={cn("h-px -mx-ui-content my-ui-content bg-border", className)}
    />
  );
};

DropdownMenu.Group = Popper.Group;
DropdownMenu.RadioGroup = Popper.RadioGroup;
DropdownMenu.RadioItem = Popper.RadioItem;
DropdownMenu.CheckboxItem = Popper.CheckboxItem;
DropdownMenu.Label = Popper.Label;
DropdownMenu.Separator = DropdownMenuSeparator;
DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Content = DropdownMenuContent;
