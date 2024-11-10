import { AlignContentProps } from "@/types/ui/popper.ts";
import { DEFAULT_SPACE } from "@/components/ui/parameters.ts";

export const alignBox = ({
  align,
  triggerPosition,
  element,
}: {
  align: AlignContentProps;
  triggerPosition: DOMRect;
  element: HTMLElement;
}) => {
  const spaceLeftBottom = window.innerHeight - triggerPosition.bottom;

  const canFitBottom = spaceLeftBottom > element.offsetHeight;
  const canFitTop = triggerPosition.top > element.offsetHeight;

  const centerX = triggerPosition.left + triggerPosition.width / 2;
  const centerY = triggerPosition.top + triggerPosition.height / 2;

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
        ? spaceLeftBottom + triggerPosition.height + DEFAULT_SPACE
        : undefined;
      top = !canFitTop
        ? triggerPosition.top + triggerPosition.height + DEFAULT_SPACE
        : undefined;
    }
    if (align.includes("bottom")) {
      bottom = !canFitBottom
        ? spaceLeftBottom + triggerPosition.height + DEFAULT_SPACE
        : undefined;
      top = canFitBottom
        ? triggerPosition.top + triggerPosition.height + DEFAULT_SPACE
        : undefined;
    }
  } else {
    if (align.includes("center"))
      top = Math.max(0, centerY - element.clientHeight / 2);
    if (align.includes("right"))
      left = triggerPosition.left + triggerPosition.width + DEFAULT_SPACE;
    if (align.includes("left"))
      right = window.innerWidth - triggerPosition.left + DEFAULT_SPACE;
    if (align.includes("top")) {
      top = canFitBottom ? triggerPosition.top : undefined;
      bottom = !canFitBottom ? DEFAULT_SPACE : undefined;
    }
    if (align.includes("bottom")) {
      bottom = canFitTop ? spaceLeftBottom : undefined;
      top = !canFitTop ? DEFAULT_SPACE : undefined;
    }
  }

  return {
    left,
    right,
    top,
    bottom,
  };
};
