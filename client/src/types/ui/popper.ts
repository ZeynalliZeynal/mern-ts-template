import React, {
  CSSProperties,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
} from "react";

type CommonParentProps = {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
};

type ClientPosition =
  | {
      left: number;
      top: number;
    }
  | undefined;

export type MenuTypes = "select" | "dropdown" | "context";

type PopperContextProps = {
  openPopper: (event: React.MouseEvent<HTMLElement>) => void;
  closePopper: () => void;
  open: boolean;
  triggerPosition?: DOMRect;
  animate: boolean;
  position?: ClientPosition;
  setTriggerPosition: Dispatch<SetStateAction<DOMRect | undefined>>;
  highlightItem: (value: HTMLElement | undefined) => void;
  isHighlighted: (currentElement: HTMLElement) => boolean;
  currentItemIndex: number | undefined;
  setCurrentItemIndex: Dispatch<SetStateAction<number | undefined>>;
  menuType?: MenuTypes;
  selectValue?: (value: string, onSelect: (value: string) => void) => void;
  selectedValue?: string;
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

type AlignContentProps =
  | "horizontal-center-top"
  | "horizontal-center-bottom"
  | "horizontal-left-top"
  | "horizontal-left-bottom"
  | "horizontal-right-top"
  | "horizontal-right-bottom"
  | "vertical-left-bottom"
  | "vertical-left-center"
  | "vertical-left-top"
  | "vertical-right-bottom"
  | "vertical-right-top"
  | "vertical-right-center";

type PopperContentProps = {
  children: React.ReactNode;
  className?: string;
  align?: AlignContentProps;
  fitToTrigger?: boolean;
  style?: CSSProperties;
};

type PopperLabelProps = {
  children: ReactNode;
  className?: string;
  inset?: boolean;
  asChild?: boolean;
  style?: CSSProperties;
};

type PopperSeparatorProps = {
  className?: string;
  style?: CSSProperties;
};

type PopperContextTriggerProps = {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
  style?: CSSProperties;
};

type PopperTriggerProps = PopperContextTriggerProps & {
  prefix?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
};

type PopperProps = {
  children: ReactNode;
  menuType?: MenuTypes;
  valueRemovable?: boolean;
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
  onClick?: (
    event: React.MouseEvent<HTMLElement>,
  ) => string | number | void | Promise<string | number | void>;
  href?: string;
  role?: React.AriaRole;
  onSelect?: (value: string) => void;
  value?: string;
  removable?: boolean;
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
  PopperProps,
  PopperLabelProps,
  PopperSeparatorProps,
  CommonParentProps,
};
