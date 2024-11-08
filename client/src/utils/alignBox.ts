import { AlignContentProps } from "@/types/ui/popper.ts";

export const alignBox = ({
  align,
  triggerPosition,
  element,
  defaultSpace = 8,
}: {
  align: AlignContentProps;
  triggerPosition: DOMRect;
  element: HTMLElement;
  defaultSpace?: number;
}) => {
  const spaceLeftBottom = window.innerHeight - triggerPosition.bottom;

  const canFitBottom = spaceLeftBottom > element.offsetHeight;
  const canFitTop = triggerPosition.top > element.offsetHeight;

  const centerX = triggerPosition.left + triggerPosition.width / 2;

  let left = undefined;
  let top = undefined;
  let bottom = undefined;
  let right = undefined;

  if (align.startsWith("horizontal")) {
    if (align.includes("center"))
      left = Math.max(0, centerX - element.clientWidth / 2);
    if (align.includes("right"))
      left = triggerPosition.right - element.clientWidth;
    if (align.includes("left"))
      right = window.innerWidth - triggerPosition.left - element.clientWidth;
    if (align.includes("top")) {
      bottom = canFitTop
        ? spaceLeftBottom + triggerPosition.height + defaultSpace
        : undefined;
      top = !canFitTop
        ? triggerPosition.top + triggerPosition.height + defaultSpace
        : undefined;
    }
    if (align.includes("bottom")) {
      bottom = !canFitBottom
        ? spaceLeftBottom + triggerPosition.height + defaultSpace
        : undefined;
      top = canFitBottom
        ? triggerPosition.top + triggerPosition.height + defaultSpace
        : undefined;
    }
  } else {
    if (align.includes("right"))
      left = triggerPosition.left + triggerPosition.width + defaultSpace;
    if (align.includes("left"))
      right = window.innerWidth - triggerPosition.left + defaultSpace;
    if (align.includes("top")) {
      top = canFitBottom ? triggerPosition.top : undefined;
      bottom = !canFitBottom ? defaultSpace : undefined;
    }
    if (align.includes("bottom")) {
      bottom = canFitTop ? spaceLeftBottom : undefined;
      top = !canFitTop ? defaultSpace : undefined;
    }
  }

  return {
    left,
    right,
    top,
    bottom,
  };
};
