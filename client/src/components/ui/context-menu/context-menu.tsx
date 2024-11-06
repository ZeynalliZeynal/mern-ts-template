import React from "react";
import { cn } from "@/lib/utils.ts";
import { createPortal } from "react-dom";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";
import { useResize } from "@/hooks/useResize.ts";
import { useRestrictBody } from "@/hooks/useRestrictBody.ts";
import { ANIMATION_DURATION } from "@/components/ui/parameters.ts";
import { navigateItems } from "@/utils/navigateItems.ts";
import {
  ClientPosition,
  PopperContentProps,
  PopperContextProps,
  PopperItemProps,
} from "@/types/ui/popper.ts";
import { POPPER_SUB_CONTENT_MENU_SELECTOR } from "@/components/ui/context-menu/context-menu-sub-v2.tsx";

const POPPER_TRIGGER_SELECTOR = "[popper-trigger]";
const POPPER_CONTENT_SELECTOR = "[popper-content]";

const POPPER_CONTENT_MENU_SELECTOR = "[popper-content-menu]";
const POPPER_ITEM_SELECTOR = "[popper-content-item]:not([data-disabled])";

const PopperContext = React.createContext<PopperContextProps | null>(null);

export const usePopper = () => {
  const context = React.useContext(PopperContext);
  if (!context) {
    throw new Error("usePopper must be used within a PopperContext.Provider");
  }
  return context;
};

const ContextMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [triggerPosition, setTriggerPosition] = React.useState<
    DOMRect | undefined
  >(undefined);
  const [animate, setAnimate] = React.useState<boolean>(false);
  const [position, setPosition] = React.useState<ClientPosition>(undefined);
  const [activeTrigger, setActiveTrigger] = React.useState<
    HTMLElement | undefined
  >(undefined);
  const [currentItemIndex, setCurrentItemIndex] = React.useState<
    number | undefined
  >(undefined);
  const [highlightedIndex, setHighlightedIndex] = React.useState<
    number | undefined
  >(undefined);

  const openPopper = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect) return;
    const left = Math.abs(clientX - rect.left);
    const top = Math.abs(clientY - rect.top);
    setAnimate(false);
    setOpen(true);
    setPosition({ left, top });
    setActiveTrigger(event.currentTarget);
  };

  const closePopper = () => {
    setAnimate(true);
    setTimeout(() => {
      setOpen(false);
      setAnimate(false);

      const triggers = Array.from(
        document.querySelectorAll(POPPER_TRIGGER_SELECTOR),
      ) as HTMLElement[];
      const triggered = triggers.indexOf(activeTrigger as HTMLElement);
      triggers[triggered].focus();
      setHighlightedIndex(undefined);
    }, 50);
    setActiveTrigger(undefined);
  };

  const findMenuItem = React.useCallback((currentElement: HTMLElement) => {
    const root = currentElement.closest(POPPER_CONTENT_MENU_SELECTOR);
    if (!root) return;

    const menuItems = Array.from(root.querySelectorAll(POPPER_ITEM_SELECTOR));

    return menuItems.indexOf(currentElement);
  }, []);

  const highlightItem = React.useCallback(
    (value: HTMLElement | number) => {
      if (typeof value === "number") setHighlightedIndex(value);
      else {
        const currentIndex = findMenuItem(value);
        setCurrentItemIndex(currentIndex);
        setHighlightedIndex(currentIndex);
        value?.focus();
      }
    },
    [findMenuItem],
  );

  const isHighlighted = (currentElement: HTMLElement) =>
    highlightedIndex === findMenuItem(currentElement);

  useRestrictBody(open);

  return (
    <PopperContext.Provider
      value={{
        open,
        openPopper,
        closePopper,
        position,
        triggerPosition,
        setTriggerPosition,
        animate,
        highlightItem,
        isHighlighted,
        currentItemIndex,
        setCurrentItemIndex,
      }}
    >
      {children}
    </PopperContext.Provider>
  );
};

const ContextMenuTrigger = React.forwardRef<
  HTMLElement,
  { children: React.ReactNode; className?: string; asChild?: boolean }
>(({ children, className = undefined, asChild }, forwardRef) => {
  const { open, openPopper, setTriggerPosition } = usePopper();

  const ref = React.useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardRef, () => ref.current as HTMLElement);

  const updatePosition = React.useCallback(() => {
    if (ref.current) {
      setTriggerPosition(ref.current.getBoundingClientRect());
    }
  }, [setTriggerPosition]);

  useResize(open, updatePosition);

  const handleContextMenu: React.MouseEventHandler<HTMLDivElement> =
    React.useCallback(
      (event) => {
        event.preventDefault();
        if (open) {
          setTimeout(() => {
            openPopper(event);
          }, 50);
        } else openPopper(event);
      },
      [open, openPopper],
    );

  const attributes = {
    tabIndex: 0,
    ref,
    "popper-trigger": "",
    "aria-expanded": open,
    "data-state": open ? "open" : "closed",
    className: cn("select-none pointer-events-auto", className),
    onContextMenu: handleContextMenu,
  };

  return asChild && React.isValidElement(children) ? (
    React.cloneElement(children, attributes)
  ) : (
    <div
      {...(attributes as React.HTMLAttributes<HTMLDivElement>)}
      className={cn(
        "select-none pointer-events-auto min-w-72 min-h-32 flex items-center justify-center text-gray-800 rounded-ui-content border border-dashed",
        className,
      )}
    >
      {children}
    </div>
  );
});

const ContextMenuContent = ({ children, className }: PopperContentProps) => {
  const {
    open,
    position,
    closePopper,
    triggerPosition,
    animate,
    highlightItem,
    currentItemIndex,
    setCurrentItemIndex,
  } = usePopper();
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  const ref = useOutsideClick({ onTrigger: closePopper });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    navigateItems({
      event,
      close: closePopper,
      highlightItem,
      currentItemIndex,
      setCurrentItemIndex,
      root: event.currentTarget,
      itemSelector: `${POPPER_ITEM_SELECTOR}`,
    });
  };

  const handleResize = React.useCallback(() => {
    if (position && triggerPosition) {
      const { left, top } = position;
      setStyle({
        left: Math.max(triggerPosition.left + left, 0),
        top: triggerPosition.top + top,
      });
    }
  }, [position, triggerPosition]);

  React.useEffect(() => {
    if (open && ref.current) {
      highlightItem(
        ref.current.querySelector(POPPER_ITEM_SELECTOR) as HTMLElement,
      );
      console.log(ref.current.querySelectorAll(POPPER_ITEM_SELECTOR));
    }
  }, [highlightItem, open, ref]);

  useResize(open, handleResize);

  if (open && position)
    return createPortal(
      <div
        ref={ref}
        data-portal=""
        role="menu"
        popper-content=""
        popper-content-menu=""
        aria-expanded={open}
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

const ContextMenuItem = React.forwardRef<HTMLElement, PopperItemProps>(
  (
    {
      children,
      className,
      suffix,
      prefix,
      asChild,
      inset,
      href,
      disabled,
      shortcut,
    },
    forwardRef,
  ) => {
    const { highlightItem, isHighlighted } = usePopper();
    const ref = React.useRef<HTMLElement | null>(null);
    React.useImperativeHandle(forwardRef, () => ref.current as HTMLElement);

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      highlightItem(event.currentTarget);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      // highlightItem(event.currentTarget);
    };

    const attributes = {
      ref,
      tabIndex: -1,
      role: "menuitem",
      "popper-content-item": "",
      "popper-content-sub-item":
        ref.current && ref.current.closest(POPPER_SUB_CONTENT_MENU_SELECTOR)
          ? ""
          : undefined,
      "aria-disabled": disabled,
      "data-disabled": disabled,
      "data-highlighted":
        ref.current && isHighlighted(ref.current) ? "" : undefined,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    };

    return asChild && React.isValidElement(children) ? (
      React.cloneElement(children, attributes)
    ) : (
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
  },
);

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Item = ContextMenuItem;
ContextMenu.Content = ContextMenuContent;
export default ContextMenu;
