import React, {
  cloneElement,
  createContext,
  CSSProperties,
  isValidElement,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  ANIMATION_DURATION,
  ANIMATION_TIMEOUT,
} from "@/components/ui/parameters";
import { PopperContentProps, PopperTriggerProps } from "@/types/ui/popper";
import { cn } from "@/lib/utils";
import { alignBox } from "@/utils/alignBox";
import { useResize } from "@/hooks/useResize";
import { createPortal } from "react-dom";

type TooltipContextProps = {
  openTooltip: (event: React.MouseEvent<HTMLElement>) => void;
  closeTooltip: () => void;
  cancelCloseTooltip: () => void;
  open: boolean;
  triggerPosition: DOMRect | null;
  animate: boolean;
  isClosing: boolean;
};

const TooltipContext = createContext<TooltipContextProps | null>(null);

const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("Tooltip component was Used outside");
  return context;
};

const Tooltip = ({
  children,
  openDelay = 0,
  closeDelay = 10, // to prevent from closing immediately
}: {
  children: ReactNode;
  openDelay?: number;
  closeDelay?: number;
}) => {
  const [animate, setAnimate] = useState(false);
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [triggerPosition, setTriggerPosition] = useState<DOMRect | null>(null);

  const { debounce, clearDebounce } = useDebounce();

  const openTooltip = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      clearDebounce();
      const rect = event.currentTarget.getBoundingClientRect();
      if (!rect) return;
      setTriggerPosition(rect);
      if (isClosing) {
        setIsClosing(false);
        setOpen(true);
      } else {
        debounce(() => {
          setAnimate(false);
          setOpen(true);
        }, openDelay);
      }
    },
    [clearDebounce, debounce, isClosing],
  );

  const closeTooltip = useCallback(() => {
    clearDebounce();
    setIsClosing(true);
    debounce(() => {
      setAnimate(true);
      setTimeout(() => {
        setOpen(false);
        setAnimate(false);
        setIsClosing(false);
      }, ANIMATION_TIMEOUT);
    }, closeDelay);
  }, [clearDebounce, debounce]);

  const cancelCloseTooltip = useCallback(() => {
    clearDebounce();
    setIsClosing(false);
  }, [clearDebounce]);

  return (
    <TooltipContext.Provider
      value={{
        openTooltip,
        closeTooltip,
        cancelCloseTooltip,
        animate,
        open,
        triggerPosition,
        isClosing,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

const TooltipTrigger = ({ children, disabled }: PopperTriggerProps) => {
  const { open, openTooltip, closeTooltip } = useTooltip();

  const handleMouseEnter: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    if (disabled) return;
    openTooltip(event);
  };

  const handleMouseLeave: MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    closeTooltip();
  };

  const attributes = {
    "data-state": open ? "open" : "closed",
    "data-disabled": disabled ? "" : undefined,
    "aria-disabled": disabled,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return isValidElement(children) ? cloneElement(children, attributes) : null;
};

const TooltipContent = ({
  children,
  className,
  align = "horizontal-center-bottom",
}: PopperContentProps) => {
  const {
    animate,
    open,
    triggerPosition,
    isClosing,
    cancelCloseTooltip,
    closeTooltip,
  } = useTooltip();
  const [style, setStyle] = useState<CSSProperties>({});

  const ref = useRef<HTMLDivElement | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerPosition || !ref.current) return;
    const alignObject = alignBox({
      align,
      element: ref.current,
      triggerPosition,
    });
    setStyle(alignObject);
  }, [align, triggerPosition]);

  useResize(open, updatePosition);

  const handleMouseEnter = useCallback(() => {
    cancelCloseTooltip();
  }, [cancelCloseTooltip]);

  const handleMouseLeave = useCallback(() => {
    closeTooltip();
  }, [closeTooltip]);

  if (open || isClosing)
    return createPortal(
      <div
        ref={ref}
        tooltip-content=""
        data-portal=""
        data-state={!animate ? "open" : "closed"}
        aria-expanded={open}
        className={cn(
          "fixed z-50 bg-ui-background px-3 rounded-lg py-1.5 text-foreground text-xs border w-fit",
          "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        style={{
          ...style,
          animationDuration: ANIMATION_DURATION + "ms",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>,
      document.body,
    );

  return null;
};

Tooltip.Content = TooltipContent;
Tooltip.Trigger = TooltipTrigger;
export default Tooltip;
