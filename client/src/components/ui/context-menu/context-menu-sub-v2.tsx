import React, { Dispatch, SetStateAction, useState } from "react";
import { PopperContentProps, PopperItemProps } from "@/types/ui/popper.ts";
import { usePopper } from "@/components/ui/context-menu/context-menu.tsx";
import { cn } from "@/lib/utils.ts";
import { LuChevronRight } from "react-icons/lu";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";
import { navigateItems } from "@/utils/navigateItems.ts";
import { createPortal } from "react-dom";
import { ANIMATION_DURATION } from "@/components/ui/parameters.ts";
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
};

export const POPPER_SUB_TRIGGER_SELECTOR = "[popper-sub-trigger]";
export const POPPER_SUB_CONTENT_MENU_SELECTOR = "[popper-content-sub-menu]";
export const POPPER_SUB_ITEM_SELECTOR = "[popper-content-sub-item]";

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

      const triggers = Array.from(
        document.querySelectorAll(POPPER_SUB_TRIGGER_SELECTOR),
      ) as HTMLElement[];
      const triggered = triggers.indexOf(activeTrigger as HTMLElement);
      triggers[triggered].focus();
    }, 50);
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
  shortcut,
  href,
}: PopperItemProps) => {
  const { highlightItem, isHighlighted } = usePopper();
  const { openSubPopper } = usePopperSub();
  const ref = React.useRef<HTMLElement | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    highlightItem(event.currentTarget);
    openSubPopper(event);
  };

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {};

  const attributes = {
    ref,
    tabIndex: -1,
    role: "menuitem",
    "popper-content-item": "",
    "aria-disabled": disabled,
    "data-disabled": disabled,
    "data-highlighted":
      ref.current && isHighlighted(ref.current) ? "" : undefined,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
  };

  return (
    <div
      {...(attributes as React.HTMLAttributes<HTMLDivElement>)}
      className={cn(
        "text-foreground flex items-center justify-start rounded-ui-item w-full focus:ring-0 cursor-default transition-colors",
        "data-[highlighted]:bg-ui-item-background-hover data-[disabled]:text-ui-disabled-foreground data-[disabled]:pointer-events-none data-[disabled]:select-none",
        {
          "cursor-pointer": href,
          "gap-2": prefix,
          "p-ui-item-inset": inset,
          "p-ui-item": !inset,
        },
        className,
      )}
    >
      {prefix}
      {children}
      {(shortcut || suffix) && (
        <div className="ml-auto flex items-center gap-1">
          {suffix}
          {shortcut && (
            <span className="text-xs opacity-60 tracking-widest">
              {shortcut}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const ContextMenuSubContent = ({ children, className }: PopperContentProps) => {
  const { highlightItem } = usePopper();
  const {
    animate,
    openSub,
    closeSubPopper,
    currentItemIndex,
    setCurrentItemIndex,
    position,
  } = usePopperSub();
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  const ref = useOutsideClick({ onTrigger: closeSubPopper });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    navigateItems({
      event,
      close: closeSubPopper,
      highlightItem,
      currentItemIndex,
      setCurrentItemIndex,
      root: event.currentTarget,
      itemSelector: `${POPPER_SUB_ITEM_SELECTOR}:not([data-disabled])`,
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
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className,
        )}
        style={{ ...style, animationDuration: ANIMATION_DURATION + "ms" }}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>,
      document.body,
    );
};

ContextMenuSub.Trigger = ContextMenuSubTrigger;
ContextMenuSub.Content = ContextMenuSubContent;

export default ContextMenuSub;
