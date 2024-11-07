import React, {
  createContext,
  forwardRef,
  ReactNode,
  useContext,
  useImperativeHandle,
  useRef,
} from "react";
import { cn } from "@/lib/utils.ts";
import {
  ClientPosition,
  MenuTypes,
  PopperContentProps,
  PopperContextProps,
  PopperItemProps,
  PopperTriggerProps,
} from "@/types/ui/popper.ts";
import {
  ANIMATION_DURATION,
  ANIMATION_TIMEOUT,
} from "@/components/ui/parameters.ts";
import { useRestrictBody } from "@/hooks/useRestrictBody.ts";
import { useResize } from "@/hooks/useResize.ts";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";
import { navigateItems } from "@/utils/navigateItems.ts";
import { createPortal } from "react-dom";
import {
  POPPER_SUB_CONTENT_SELECTOR,
  POPPER_SUB_ITEM_SELECTOR,
} from "@/components/ui/primitves/popper-primitive-sub.tsx";

const POPPER_TRIGGER_SELECTOR = "[popper-trigger]";

const POPPER_CONTENT_SELECTOR = "[popper-content-menu]";
const POPPER_ITEM_SELECTOR = "[popper-content-item]:not([data-disabled])";

const PrimitiveContext = createContext<PopperContextProps | null>(null);

export const usePopperPrimitive = () => {
  const context = useContext(PrimitiveContext);
  if (!context) throw new Error("Popper component is outside of the provider");
  return context;
};

export default function PopperPrimitive({
  children,
  menuType,
}: {
  children: ReactNode;
  menuType?: MenuTypes;
}) {
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
  >(0);
  const [highlightedItem, setHighlightedItem] = React.useState<
    HTMLElement | undefined
  >(undefined);

  const openPopper = (event: React.MouseEvent<HTMLElement>) => {
    if (menuType === "context") {
      const { clientX, clientY } = event;
      const rect = event.currentTarget.getBoundingClientRect();
      if (!rect) return;
      const left = Math.abs(clientX - rect.left);
      const top = Math.abs(clientY - rect.top);
      setPosition({ left, top });
    }
    setAnimate(false);
    setOpen(true);
    setActiveTrigger(event.currentTarget);
  };

  const closePopper = () => {
    setAnimate(true);
    setTimeout(
      () => {
        setOpen(false);
        setAnimate(false);

        const triggers = Array.from(
          document.querySelectorAll(POPPER_TRIGGER_SELECTOR),
        ) as HTMLElement[];
        const triggered = triggers.indexOf(activeTrigger as HTMLElement);
        triggers[triggered].focus();
        setHighlightedItem(undefined);
        setPosition(undefined);
      },
      menuType === "context" ? 50 : ANIMATION_TIMEOUT,
    );
    setActiveTrigger(undefined);
  };

  const highlightItem = React.useCallback((value: HTMLElement | undefined) => {
    if (!value) return;
    setHighlightedItem(value);
    const root =
      value.closest(POPPER_CONTENT_SELECTOR) ||
      value.closest(POPPER_SUB_CONTENT_SELECTOR);
    if (!root) return;
    const menuItems = Array.from(
      root.querySelectorAll(POPPER_ITEM_SELECTOR) ||
        root.querySelectorAll(POPPER_SUB_ITEM_SELECTOR),
    );
    setCurrentItemIndex(menuItems.indexOf(value));
    value?.focus();
  }, []);

  const isHighlighted = (currentElement: HTMLElement) =>
    highlightedItem === currentElement;

  useRestrictBody(open);

  return (
    <PrimitiveContext.Provider
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
        menuType,
      }}
    >
      {children}
    </PrimitiveContext.Provider>
  );
}

const PopperPrimitiveTrigger = React.forwardRef<
  HTMLElement,
  PopperTriggerProps
>(({ children, className = undefined, asChild }, forwardRef) => {
  const { open, openPopper, setTriggerPosition, menuType } =
    usePopperPrimitive();

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
          }, ANIMATION_TIMEOUT);
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
    className: cn("pointer-events-auto", className),
    onContextMenu: menuType === "context" ? handleContextMenu : undefined,
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

const PopperPrimitiveContent = ({
  children,
  className,
}: PopperContentProps) => {
  const {
    open,
    position,
    closePopper,
    triggerPosition,
    animate,
    highlightItem,
    currentItemIndex,
    setCurrentItemIndex,
    menuType,
  } = usePopperPrimitive();
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  const ref = useOutsideClick({ onTrigger: closePopper });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (document.querySelector(POPPER_SUB_CONTENT_SELECTOR)) return;
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
    if (position && triggerPosition && ref.current) {
      const { left: clientLeft, top } = position;
      const canFitRight =
        innerWidth - clientLeft - triggerPosition.left >
        ref.current.offsetWidth;

      let left = undefined;
      let right = undefined;
      if (canFitRight) left = triggerPosition.left + clientLeft;
      else right = 8;
      setStyle({
        left: left,
        top: triggerPosition.top + top,
        right,
      });
    }
  }, [position, ref, triggerPosition]);

  React.useEffect(() => {
    if (open && ref.current) {
      highlightItem(
        ref.current.querySelector(POPPER_ITEM_SELECTOR) as HTMLElement,
      );
      setCurrentItemIndex(0);
    }
  }, [highlightItem, open, ref, setCurrentItemIndex]);

  useResize(open, handleResize);

  if (open && position)
    return createPortal(
      <div
        ref={ref}
        data-portal=""
        role="menu"
        popper-content-menu=""
        aria-expanded={open}
        data-state={!animate ? "open" : "closed"}
        className={cn(
          "bg-ui-background rounded-ui-content min-w-64 p-ui-content border fixed z-50 pointer-events-auto focus:ring-0",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          {
            "data-[state=closed]:zoom-out data-[state=open]:zoom-in":
              menuType === "context",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95":
              menuType !== "context",
          },
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

const PopperPrimitiveItem = React.forwardRef<HTMLElement, PopperItemProps>(
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
      onMouseEnter,
      onMouseLeave,
      onKeyDown,
      ...etc
    },
    forwardRef,
  ) => {
    const { highlightItem, isHighlighted } = usePopperPrimitive();
    const ref = React.useRef<HTMLElement | null>(null);
    React.useImperativeHandle(forwardRef, () => ref.current as HTMLElement);

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      highlightItem(event.currentTarget);
      onMouseEnter?.(event);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      // highlightItem(event.currentTarget);
      onMouseLeave?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
    };

    const attributes = {
      ref,
      tabIndex: -1,
      role: "menuitem",
      "popper-content-item": "",
      "popper-content-sub-item":
        ref.current && ref.current.closest(POPPER_SUB_CONTENT_SELECTOR)
          ? ""
          : undefined,
      "aria-disabled": disabled,
      "data-disabled": disabled,
      "data-highlighted":
        ref.current && isHighlighted(ref.current) ? "" : undefined,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onKeyDown: handleKeyDown,
      ...etc,
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

const PopperPrimitiveGroup = ({
  children,
  className,
  ...etc
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div role="group" className={cn(className)} {...etc}>
      {children}
    </div>
  );
};

const PopperPrimitiveSeparator = forwardRef<
  HTMLDivElement,
  { className?: string }
>(({ className, ...etc }, forwardRef) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useImperativeHandle(forwardRef, () => ref.current as HTMLDivElement);
  return (
    <div
      ref={ref}
      role="separator"
      {...etc}
      className={cn("h-px -mx-ui-content my-ui-content bg-border", className)}
    />
  );
});

const PopperPrimitiveLabel = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
    inset?: boolean;
    prefix?: ReactNode;
    suffix?: ReactNode;
  }
>(
  (
    { children, className, inset = false, suffix, prefix, ...etc },
    forwardRef,
  ) => {
    const ref = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(forwardRef, () => ref.current as HTMLDivElement);

    return (
      <div
        ref={ref}
        tabIndex={-1}
        {...etc}
        className={cn(
          "text-foreground font-semibold flex items-center w-full",
          {
            "justify-between": suffix,
            "gap-2": prefix,
            "p-ui-item-inset": inset,
            "p-ui-item": !inset,
          },
          className,
        )}
      >
        {prefix && <span className="size-4">{prefix}</span>}
        {children}
        {suffix && <span className="size-4">{suffix}</span>}
      </div>
    );
  },
);

PopperPrimitive.Label = PopperPrimitiveLabel;
PopperPrimitive.Group = PopperPrimitiveGroup;
PopperPrimitive.Separator = PopperPrimitiveSeparator;
PopperPrimitive.Trigger = PopperPrimitiveTrigger;
PopperPrimitive.Item = PopperPrimitiveItem;
PopperPrimitive.Content = PopperPrimitiveContent;
