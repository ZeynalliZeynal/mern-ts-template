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
};

type PopperContentProps = {
  children: React.ReactNode;
  className?: string;
};

type PopperItemProps = {
  children: ReactNode | ReactElement;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  asChild?: boolean;
  disabled?: boolean;
  className?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  inset?: boolean;
  href?: string;
  shortcut?: ReactNode;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
};

export type {
  ClientPosition,
  PopperContentProps,
  PopperContextProps,
  PopperItemProps,
};
