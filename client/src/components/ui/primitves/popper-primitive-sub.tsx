import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { PopperContentProps, PopperItemProps } from "@/types/ui/popper.ts";
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
import { usePopper } from "@/components/ui/primitves/popper-primitives-v2.tsx";
import { useDebounce } from "@/hooks/useDebounce.ts";

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
    throw new Error("Sub context must be used within a PopperContext.Provider");
  }
  return context;
};

const PopperSub = ({ children }: { children: React.ReactNode }) => {
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

  const { clearDebounce, debounce } = useDebounce();

  const openSubPopper = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      clearDebounce();
      const rect = event.currentTarget.getBoundingClientRect();
      if (!rect) return;
      setAnimate(false);
      setOpenSub(true);
      setPosition(rect);
      setActiveTrigger(event.currentTarget);
    },
    [clearDebounce],
  );

  const closeSubPopper = useCallback(() => {
    setAnimate(true);
    debounce(() => {
      setOpenSub(false);
      setAnimate(false);
    }, ANIMATION_TIMEOUT);
    setActiveTrigger(undefined);
  }, [debounce]);

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

const PopperSubTrigger = ({
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
  const ref = React.useRef<HTMLDivElement | null>(null);

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
    highlightItem(event.currentTarget);
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
    <div
      ref={ref}
      tabIndex={-1}
      role="menuitem"
      popper-content-item=""
      data-state={openSub ? "open" : "closed"}
      aria-disabled={disabled}
      data-disabled={disabled}
      data-highlighted={
        ref.current && isHighlighted(ref.current) ? "" : undefined
      }
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      className={cn(
        "text-foreground flex items-center justify-start rounded-ui-item w-full focus:ring-0 cursor-default transition-colors",
        "data-[highlighted]:bg-ui-item-background-hover data-[disabled]:text-ui-disabled-foreground data-[disabled]:pointer-events-none data-[disabled]:select-none data-[state=open]:bg-ui-item-background-hover",
        {
          "gap-2": prefix,
          "p-ui-item-inset": inset,
          "p-ui-item": !inset,
        },
        className,
      )}
    >
      {prefix}
      {children}
      <div className="ml-auto flex items-center gap-1">
        {suffix || <LuChevronRight />}
      </div>
    </div>
  );
};

const PopperSubContent = ({ children, className }: PopperContentProps) => {
  const {
    highlightItem,
    closePopper,
    open,
    animate: animateMain,
  } = usePopper();
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
      close: closePopper,
      highlightItem,
      currentItemIndex,
      setCurrentItemIndex,
      root: event.currentTarget,
      itemSelector: `${POPPER_SUB_ITEM_SELECTOR}`,
    });
  };

  const handleResize = React.useCallback(() => {
    if (ref.current && openSub && position) {
      const canFitRight =
        innerWidth - position.left - position.width > ref.current.offsetWidth;

      const canFitBottom =
        innerHeight - position.top - position.height > ref.current.offsetWidth;

      let left;
      if (canFitRight) left = position.left + position.width;
      else left = position.left - ref.current.offsetWidth;

      setStyle({
        left,
        top: canFitBottom ? position.top : undefined,
        bottom: !canFitBottom ? 8 : undefined,
      });
    }
  }, [openSub, position, ref]);
  useResize(openSub, handleResize);

  if (openSub && open)
    return createPortal(
      <div
        ref={ref}
        data-portal=""
        role="menu"
        popper-content-sub-menu=""
        aria-expanded={openSub}
        data-state={!animateMain || animate ? "open" : "closed"}
        className={cn(
          "bg-ui-background rounded-ui-content p-ui-content border fixed z-50 pointer-events-auto focus:ring-0",
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

PopperSub.Trigger = PopperSubTrigger;
PopperSub.Content = PopperSubContent;

export default PopperSub;
