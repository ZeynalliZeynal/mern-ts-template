import React from "react";

export const navigateItems = ({
  event,
  handleClose,
  currentMenuItem,
  handleHighlight,
  root,
  itemSelector,
  setCurrentMenuItem,
}: {
  event: React.KeyboardEvent<HTMLElement>;
  root: HTMLElement | null;
  handleClose: () => void;
  currentMenuItem?: number;
  handleHighlight: (value: HTMLElement | number) => void;
  itemSelector: string;
  setCurrentMenuItem: (value: number | undefined) => void;
}) => {
  if (!event.currentTarget || !root) return;
  if (event.code === "Escape") {
    event.preventDefault();
    handleClose();
  }

  if (event.code === "ArrowUp" || event.code === "ArrowDown") {
    event.preventDefault();
    const direction: "next" | "previous" =
      event.code === "ArrowUp" ? "previous" : "next";

    const menuItems = Array.from(root.querySelectorAll(itemSelector));

    let nextIndex: number;
    if (direction === "next") {
      nextIndex =
        currentMenuItem === undefined
          ? 0
          : currentMenuItem === menuItems.length - 1
            ? menuItems.indexOf(menuItems[menuItems.length - 1])
            : currentMenuItem + 1;
    } else {
      nextIndex =
        currentMenuItem === undefined
          ? 0
          : currentMenuItem === 0
            ? 0
            : currentMenuItem - 1;
    }

    setCurrentMenuItem(nextIndex);
    handleHighlight(menuItems[nextIndex] as HTMLElement);
  }
};
