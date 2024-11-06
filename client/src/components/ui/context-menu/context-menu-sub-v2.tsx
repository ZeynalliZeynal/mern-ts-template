import React, { Dispatch, SetStateAction, useState } from "react";
import { PopperContentProps, PopperItemProps } from "@/types/ui/popper.ts";
import ContextMenu, {
  usePopper,
} from "@/components/ui/context-menu/context-menu.tsx";
import { cn } from "@/lib/utils.ts";
import { LuChevronRight } from "react-icons/lu";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";
import { navigateItems } from "@/utils/navigateItems.ts";
import { createPortal } from "react-dom";
import {
  ANIMATION_DURATION,
  ANIMATION_TIMEOUT,
} from "@/components/ui/parameters.ts";
import { useResize } from "@/hooks/useResize.ts";

type PopperContextSubProps = {
  openSubPopper: (event: React.MouseEvent<HTMLElement>) => void;
  closeSubPopper: () => void;
  openSub: boolean;
  position?: DOMRect;
  triggerPosition?: DOMRect;
  setTriggerPosition: Dispatch<SetStateAction<DOMRect | undefined>>;
  animate: boolean;
  currentItemIndex: number | undefined;
  setCurrentItemIndex: Dispatch<SetStateAction<number | undefined>>;
  activeTrigger: HTMLElement | undefined;
};

export const POPPER_SUB_TRIGGER_SELECTOR = "[popper-sub-trigger]";
export const POPPER_SUB_CONTENT_SELECTOR = "[popper-content-sub-menu]";
export const POPPER_SUB_ITEM_SELECTOR =
  "[popper-content-sub-item]:not([data-disabled])";

const PopperSubContext = React.createContext<PopperContextSubProps | undefined>(
  undefined,
);

const usePopperSub = () => {
  const context = React.useContext(PopperSubContext);
  if (!context) {
    throw new Error("usePopper must be used within a PopperContext.Provider");
  }
  return context;
};

const ContextMenuSub = ({ children }: { children: React.ReactNode }) => {
  const [openSub, setOpenSub] = useState(false);
  const [triggerPosition, setTriggerPosition] = useState<DOMRect | undefined>(
    undefined,
  );
  const [animate, setAnimate] = useState<boolean>(false);
  const [position, setPosition] = useState<DOMRect | undefined>(undefined);
  const [activeTrigger, setActiveTrigger] = useState<HTMLElement | undefined>(
    undefined,
  );
  const [currentItemIndex, setCurrentItemIndex] = useState<number | undefined>(
    0,
  );

  const openSubPopper = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect) return;
    setAnimate(false);
    setOpenSub(true);
    setPosition(rect);
    setActiveTrigger(event.currentTarget);
  };

  const closeSubPopper = () => {
    setAnimate(true);
    setTimeout(() => {
      setOpenSub(false);
      setAnimate(false);
    }, ANIMATION_TIMEOUT);
    setActiveTrigger(undefined);
  };

  return (
    <PopperSubContext.Provider
      value={{
        openSub,
        closeSubPopper,
        animate,
        openSubPopper,
        currentItemIndex,
        setCurrentItemIndex,
        position,
        triggerPosition,
        setTriggerPosition,
        activeTrigger,
      }}
    >
      {children}
    </PopperSubContext.Provider>
  );
};

const ContextMenuSubTrigger = ({
  children,
  className,
  inset,
  disabled,
  prefix,
  suffix = <LuChevronRight />,
}: PopperItemProps) => {
  const { isHighlighted, highlightItem } = usePopper();
  const { openSubPopper, closeSubPopper, openSub, setCurrentItemIndex } =
    usePopperSub();
  const [openedWithKey, setOpenedWithKey] = useState(false);
  const ref = React.useRef<HTMLElement | null>(null);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>,
  ) => {
    if (!ref.current) return;
    if (!isHighlighted(event.currentTarget)) return;
    const keyCode = (event as React.KeyboardEvent).code;
    if (keyCode === "ArrowRight" || keyCode === "ArrowLeft") {
      event.preventDefault();
      const action: "open" | "close" =
        keyCode === "ArrowLeft" ? "close" : "open";

      if (action === "open") {
        openSubPopper(event as React.MouseEvent<HTMLElement>);
        setOpenedWithKey(true);
      } else {
        highlightItem(ref.current as HTMLElement);
        closeSubPopper();
      }
    }
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    openSubPopper(event);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!relatedTarget) return;
    if (!relatedTarget.closest(POPPER_SUB_CONTENT_SELECTOR)) closeSubPopper();
  };

  React.useEffect(() => {
    if (openedWithKey) {
      const subPopup = document.querySelector(POPPER_SUB_CONTENT_SELECTOR);
      if (subPopup) {
        highlightItem(
          subPopup.querySelector('[role="menuitem"]') as HTMLElement,
        );
        setCurrentItemIndex(0);
      }
    }
  }, [highlightItem, openSub, openedWithKey, setCurrentItemIndex]);

  return (
    <ContextMenu.Item
      ref={ref}
      popper-sub-trigger=""
      aria-expanded={openSub}
      data-state={openSub ? "open" : "closed"}
      className={cn("data-[state=open]:bg-ui-item-background-hover", className)}
      inset={inset}
      prefix={prefix}
      disabled={disabled}
      suffix={suffix || <LuChevronRight />}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      {children}
    </ContextMenu.Item>
  );
};

const ContextMenuSubContent = ({ children, className }: PopperContentProps) => {
  const { highlightItem, closePopper } = usePopper();
  const {
    animate,
    openSub,
    closeSubPopper,
    currentItemIndex,
    setCurrentItemIndex,
    position,
    activeTrigger,
  } = usePopperSub();
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  const ref = useOutsideClick({ onTrigger: closeSubPopper });

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    const relatedTarget = document.elementFromPoint(
      event.clientX,
      event.clientY,
    ) as HTMLElement;

    if (relatedTarget !== activeTrigger) closeSubPopper();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.code === "ArrowLeft" && activeTrigger) {
      event.preventDefault();
      closeSubPopper();
      highlightItem(activeTrigger);
    }

    navigateItems({
      event,
      close: () => {
        closePopper();
      },
      highlightItem,
      currentItemIndex,
      setCurrentItemIndex,
      root: event.currentTarget,
      itemSelector: `${POPPER_SUB_ITEM_SELECTOR}`,
    });
  };

  const handleResize = React.useCallback(() => {
    if (ref.current && openSub && position) {
      const left = position.left + position.width;
      setStyle({
        left,
        top: position.top,
      });
    }
  }, [openSub, position, ref]);
  useResize(openSub, handleResize);

  if (openSub)
    return createPortal(
      <div
        ref={ref}
        data-portal=""
        role="menu"
        popper-content=""
        popper-content-sub-menu=""
        aria-expanded={openSub}
        data-state={!animate ? "open" : "closed"}
        className={cn(
          "bg-ui-background rounded-ui-content min-w-52 p-ui-content border fixed z-50 pointer-events-auto focus:ring-0",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        style={{ ...style, animationDuration: ANIMATION_DURATION + "ms" }}
        onKeyDown={handleKeyDown}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>,
      document.body,
    );
};

ContextMenuSub.Trigger = ContextMenuSubTrigger;
ContextMenuSub.Content = ContextMenuSubContent;

export default ContextMenuSub;
