import React, {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
} from "react";

type ClientPosition =
  | {
      left: number;
      top: number;
    }
  | undefined;

export type MenuTypes = "popover" | "dropdown" | "context";

type PopperContextProps = {
  openPopper: (event: React.MouseEvent<HTMLElement>) => void;
  closePopper: () => void;
  open: boolean;
  position?: ClientPosition;
  triggerPosition?: DOMRect;
  setTriggerPosition: Dispatch<SetStateAction<DOMRect | undefined>>;
  animate: boolean;
  highlightItem: (value: HTMLElement | undefined) => void;
  isHighlighted: (currentElement: HTMLElement) => boolean;
  currentItemIndex: number | undefined;
  setCurrentItemIndex: Dispatch<SetStateAction<number | undefined>>;
  menuType?: MenuTypes;
};

type PopperRadioGroupContextProps = {
  radioValue: string;
  selectValue: (value: string) => void;
};
type PopperRadioItemProps = {
  value: string;
  onChange: (value: string) => void;
} & CommonItemProps;
type PopperRadioGroupProps = {
  value: string;
} & CommonGroupProps;

type AlignContentProps = "center" | "left" | "right";

type PopperContentProps = {
  children: React.ReactNode;
  className?: string;
  align?: AlignContentProps;
};

type PopperContextTriggerProps = {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
};

type PopperTriggerProps = PopperContextTriggerProps & {
  prefix: ReactNode;
  suffix: ReactNode;
  disabled: boolean;
};

type CommonItemProps = {
  children: ReactNode | ReactElement;
  asChild?: boolean;
  disabled?: boolean;
  className?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  inset?: boolean;
  shortcut?: ReactNode;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
};

type PopperItemProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  href?: string;
  role?: React.AriaRole;
} & CommonItemProps;

type PopperCheckboxItemProps = {
  onCheck: () => void;
  checked?: boolean;
} & CommonItemProps;

type CommonGroupProps = {
  children: ReactNode;
  className?: string;
};

type PopperGroupProps = {
  role?: React.AriaRole;
} & CommonGroupProps;

export type {
  ClientPosition,
  PopperContentProps,
  PopperContextProps,
  PopperCheckboxItemProps,
  PopperItemProps,
  PopperTriggerProps,
  PopperRadioGroupProps,
  PopperGroupProps,
  PopperRadioGroupContextProps,
  PopperRadioItemProps,
  PopperContextTriggerProps,
  AlignContentProps,
};
