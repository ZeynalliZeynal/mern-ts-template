import React from "react";

export const navigateItems = ({
  event,
  currentItemIndex,
  highlightItem,
  root,
  itemSelector,
  setCurrentItemIndex,
  loop = false,
}: {
  event: React.KeyboardEvent<HTMLElement>;
  root: HTMLElement | null;
  currentItemIndex?: number;
  highlightItem: (value: HTMLElement | undefined) => void;
  itemSelector: string;
  setCurrentItemIndex: (value: number | undefined) => void;
  loop?: boolean;
}) => {
  if (!event.currentTarget || !root) return;
  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
    event.preventDefault();
    const direction: "next" | "previous" =
      event.code === "ArrowUp" ? "previous" : "next";

    const menuItems = Array.from(root.querySelectorAll(itemSelector));

    let nextIndex: number;
    if (loop) {
      if (direction === "next") {
        nextIndex =
          currentItemIndex === undefined
            ? 0
            : (currentItemIndex + 1) % menuItems.length;
      } else {
        nextIndex =
          currentItemIndex === undefined
            ? 0
            : (currentItemIndex - 1 + menuItems.length) % menuItems.length;
      }
    } else {
      if (direction === "next") {
        nextIndex =
          currentItemIndex === undefined ||
          currentItemIndex === menuItems.length - 1
            ? menuItems.indexOf(menuItems[menuItems.length - 1])
            : currentItemIndex + 1;
      } else {
        nextIndex =
          currentItemIndex === undefined || currentItemIndex === 0
            ? 0
            : currentItemIndex - 1;
      }
    }

    setCurrentItemIndex(nextIndex);
    highlightItem((menuItems[nextIndex] as HTMLElement) || undefined);
  }
};
