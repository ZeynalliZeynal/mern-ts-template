import { CSSProperties, ReactNode, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils.ts";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";
import { useResize } from "@/hooks/useResize.ts";

interface PopperWrapperProps {
  children: ReactNode;
  animate: boolean;
  open: boolean;
  onClose: () => void;
  triggerPosition: DOMRect | null;
  align?: "center" | "left" | "right";
  width?: "fit" | "default";
}

export const PopperWrapper = ({
  children,
  animate,
  open,
  onClose,
  triggerPosition,
  align = "center",
  width = "default",
  ...props
}: PopperWrapperProps) => {
  const [style, setStyle] = useState<CSSProperties>({});

  const ref = useRef<HTMLDivElement | null>(null);

  const updateMenuPosition = () => {
    if (!ref.current || !open || !triggerPosition) return;

    const spaceLeftBottom = window.innerHeight - triggerPosition.bottom;

    // const canFitRight = spaceLeftRight > ref.current.clientWidth;
    const canFitBottom = spaceLeftBottom > ref.current.clientHeight;

    const centerX = triggerPosition.left + triggerPosition.width / 2;
    // const centerY = triggerPosition.top + triggerPosition.height / 2;
    console.log(ref.current.clientLeft);

    let left = undefined;
    let right = undefined;
    if (width === "fit") {
      left = triggerPosition.left;
    } else {
      switch (align) {
        case "center":
          left = Math.max(0, centerX - ref.current.clientWidth / 2);
          break;
        case "left":
          left = triggerPosition.left;
          break;
        case "right":
          left = triggerPosition.right - ref.current.offsetWidth;
          break;
      }
    }

    setStyle({
      top: canFitBottom
        ? triggerPosition.top + triggerPosition.height + 8
        : undefined,
      bottom: !canFitBottom
        ? spaceLeftBottom + triggerPosition.height + 8
        : undefined,
      left,
      right,
    });
  };

  useOutsideClick(ref, onClose);

  useResize(open, updateMenuPosition, triggerPosition);

  if (!open || !triggerPosition) return null;

  return createPortal(
    <div data-popper-content-wrapper="" className="fixed z-50" style={style}>
      <div
        tabIndex={-1}
        role="menu"
        ref={ref}
        data-menu-content=""
        data-state={!animate}
        className={cn(
          "pointer-events-auto rounded-ui-content focus:ring-0 border flex-col p-ui-content bg-ui-background",
          "data-[state='true']:animate-in data-[state='false']:animate-out data-[state='true']:zoom-in data-[state='false']:zoom-out data-[state='true']:fade-in data-[state='false']:fade-out",
          {
            "min-w-56": width === "default",
          },
        )}
        style={
          width === "fit"
            ? {
                width: triggerPosition.width,
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export const PopperItem = () => {};
