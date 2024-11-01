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
  align?: "center" | "left" | "right" | "top" | "bottom";
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
    // const spaceLeftRight = window.innerWidth - triggerPosition.right;

    // const canFitRight = spaceLeftRight > ref.current.clientWidth;
    const canFitBottom = spaceLeftBottom > ref.current.clientHeight;

    let placeCenter;
    if (align === "center") {
      if (width === "fit") {
        placeCenter = triggerPosition.left;
      } else {
        placeCenter = (innerWidth - ref.current.clientLeft / 2) / 2;
      }
    }

    setStyle({
      top: canFitBottom
        ? triggerPosition.top + triggerPosition.height + 8
        : undefined,
      bottom: !canFitBottom
        ? spaceLeftBottom + triggerPosition.height + 8
        : undefined,
      left: placeCenter,
    });
  };

  useOutsideClick(ref, onClose);

  useResize(open, updateMenuPosition, [open, triggerPosition]);

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
