import {
  Dispatch,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  SetStateAction,
} from "react";

export interface MenuContextProps {
  open: boolean;
  handleClose: () => void;
  animate: boolean;
  handleHighlight: (value: HTMLElement | number) => void;
  isHighlighted: (currentElement: HTMLElement) => boolean;
  currentMenuItem: number | undefined;
  setCurrentMenuItem: Dispatch<SetStateAction<number | undefined>>;
}

export interface MenuItemProps {
  children: ReactNode | ReactElement;
  onClick?: MouseEventHandler<HTMLElement>;
  asChild?: boolean;
  disabled?: boolean;
  className?: string;
  inset?: boolean;
  href?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  shortcut?: ReactNode;
}

export interface MenuTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  disabled?: boolean;
  className?: string;
  inset?: boolean;
  href?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}
