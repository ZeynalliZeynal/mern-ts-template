import React from "react";

export enum PopperActionKind {
  open = "popper/open",
  close = "popper/close",
  animate = "popper/animate",
}

type ClientPosition = {
  clientX: number;
  clientY: number;
} | null;

type PopperState = {
  open: boolean;
  position: ClientPosition | null;
};

type PopperAction = {
  type: PopperActionKind;
  payload?: ClientPosition;
};

type PopperContextProps = {
  openPopper: (position: ClientPosition) => void;
  closePopper: () => void;
} & PopperState;

type PopperContentProps = {
  children: React.ReactNode;
  className?: string;
};

export type {
  PopperAction,
  PopperState,
  ClientPosition,
  PopperContentProps,
  PopperContextProps,
};
