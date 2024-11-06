import React from "react";

type ClientPosition = {
  clientX: number;
  clientY: number;
} | null;

type PopperContextProps = {
  openPopper: (position: ClientPosition) => void;
  closePopper: () => void;
  open: boolean;
  position?: ClientPosition;
  triggerPosition?: DOMRect;
};

type PopperContentProps = {
  children: React.ReactNode;
  className?: string;
};

export type { ClientPosition, PopperContentProps, PopperContextProps };
