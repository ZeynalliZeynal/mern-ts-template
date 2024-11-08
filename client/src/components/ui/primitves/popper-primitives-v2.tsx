import React, {
  cloneElement,
  createContext,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils.ts";
import {
  ClientPosition,
  MenuTypes,
  PopperCheckboxItemProps,
  PopperContentProps,
  PopperContextProps,
  PopperContextTriggerProps,
  PopperGroupProps,
  PopperItemProps,
  PopperRadioGroupContextProps,
  PopperRadioGroupProps,
  PopperRadioItemProps,
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
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { useDebounce } from "@/hooks/useDebounce.ts";
import { PiCaretUpDownBold } from "react-icons/pi";
import Button from "@/components/ui/button.tsx";

const POPPER_TRIGGER_SELECTOR = "[popper-trigger]";

const POPPER_CONTENT_SELECTOR = "[popper-content-menu]";
const POPPER_ITEM_SELECTOR = "[popper-content-item]:not([data-disabled])";

const PopperContext = createContext<PopperContextProps | null>(null);
const PopperRadioGroupContext =
  createContext<PopperRadioGroupContextProps | null>(null);

export const usePopper = () => {
  const context = useContext(PopperContext);
  if (!context) throw new Error("Popper component is outside of the provider");
  return context;
};

const usePopperRadioGroup = () => {
  const context = useContext(PopperRadioGroupContext);
  if (!context)
    throw new Error("Radio group component is outside of the provider");
  return context;
};

export default function Popper({
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

  const { debounce, clearDebounce } = useDebounce();

  const openPopper = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      clearDebounce();
      const rect = event.currentTarget.getBoundingClientRect();
      if (!rect) return;

      if (menuType === "context") {
        const { clientX, clientY } = event;
        const left = Math.abs(clientX - rect.left);
        const top = Math.abs(clientY - rect.top);
        setPosition({ left, top });
      }
      setTriggerPosition(rect);
      setAnimate(false);
      setOpen(true);
      setActiveTrigger(event.currentTarget);
    },
    [clearDebounce, menuType],
  );

  const closePopper = React.useCallback(() => {
    setAnimate(true);
    debounce(() => {
      setOpen(false);
      setAnimate(false);
      setHighlightedItem(undefined);
      setPosition(undefined);

      const triggers = Array.from(
        document.querySelectorAll(POPPER_TRIGGER_SELECTOR),
      ) as HTMLElement[];
      const triggered = triggers.indexOf(activeTrigger as HTMLElement);
      triggers[triggered]?.focus();

      setActiveTrigger(undefined);
    }, ANIMATION_TIMEOUT);
  }, [activeTrigger, debounce]);

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
        menuType,
      }}
    >
      {children}
    </PopperContext.Provider>
  );
}

const PopperContextTrigger = React.forwardRef<
  HTMLElement,
  PopperContextTriggerProps
>(({ children, className = undefined, asChild }, forwardRef) => {
  const { open, openPopper, setTriggerPosition, menuType } = usePopper();

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
        openPopper(event);
      },
      [openPopper],
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

const PopperTrigger = React.forwardRef<HTMLElement, PopperTriggerProps>(
  (
    { children, className = undefined, asChild, prefix, suffix, disabled },
    forwardRef,
  ) => {
    const { open, openPopper, setTriggerPosition, menuType } = usePopper();
    const [isHovering, setIsHovering] = useState(false);

    const ref = React.useRef<HTMLElement | null>(null);
    React.useImperativeHandle(forwardRef, () => ref.current as HTMLElement);

    const updatePosition = React.useCallback(() => {
      if (ref.current) {
        setTriggerPosition(ref.current.getBoundingClientRect());
      }
    }, [setTriggerPosition]);

    useResize(open, updatePosition);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      event.preventDefault();
      openPopper(event);
    };

    useResize(
      open,
      useCallback(() => {
        if (!ref.current) return;
        setTriggerPosition(ref.current.getBoundingClientRect());
      }, [setTriggerPosition]),
    );

    const commonAttributes = {
      ref,
      "popper-trigger": "",
      role: "combobox",
      type: "button",
      "aria-expanded": open,
      "aria-disabled": disabled,
      "data-disabled": disabled ? "" : undefined,
      "data-state": open ? "open" : "close",
      onClick: handleClick,
    };

    return asChild && isValidElement(children) ? (
      cloneElement(children, commonAttributes)
    ) : menuType === "popover" ? (
      <button
        {...(commonAttributes as HTMLAttributes<HTMLButtonElement>)}
        className={cn(
          "h-7 px-3 rounded-md border text-foreground flex items-center justify-between gap-1.5 transition",
          {
            "bg-ui-item-background-hover": isHovering,
            "data-[disabled]:text-ui-disabled-foreground data-[disabled]:pointer-events-none":
              disabled,
          },
          className,
        )}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
      >
        {prefix && <span className="opacity-60">{prefix}</span>}
        {children}
        {suffix ? (
          suffix
        ) : (
          <span className="opacity-60 size-3">
            <PiCaretUpDownBold />
          </span>
        )}
      </button>
    ) : (
      <Button
        {...(commonAttributes as HTMLAttributes<HTMLButtonElement>)}
        primary
        prefix={prefix}
        suffix={suffix}
        size="sm"
        className={cn(className)}
        disabled={disabled}
      >
        {children}
      </Button>
    );
  },
);

const PopperContent = ({
  children,
  className,
  align = "center",
  ...etc
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
  } = usePopper();
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
    if (triggerPosition && ref.current) {
      if (menuType === "context") {
        if (!position) return;
        const { left: clientLeft, top: clientTop } = position;
        const canFitRight =
          innerWidth - clientLeft - triggerPosition.left >
          ref.current.offsetWidth;

        const canFitBottom =
          innerHeight - clientTop - triggerPosition.top >
          ref.current.offsetHeight;

        let left = undefined;
        let right = undefined;
        let top = undefined;
        let bottom = undefined;

        if (canFitRight) left = triggerPosition.left + clientLeft;
        else right = 8;
        if (canFitBottom) top = triggerPosition.top + clientTop;
        else bottom = 8;
        setStyle({
          left: left,
          top,
          right,
          bottom,
        });
      } else {
        const spaceLeftBottom = window.innerHeight - triggerPosition.bottom;

        const canFitBottom = spaceLeftBottom > ref.current.clientHeight;

        const centerX = triggerPosition.left + triggerPosition.width / 2;

        let left = undefined;
        if (align === "center") {
          left = Math.max(0, centerX - ref.current.clientWidth / 2);
        } else if (align === "right") {
          left = triggerPosition.right - ref.current.offsetWidth;
        } else {
          left = triggerPosition.left;
        }

        setStyle({
          top: canFitBottom
            ? triggerPosition.top + triggerPosition.height + 8
            : undefined,
          bottom: !canFitBottom
            ? spaceLeftBottom + triggerPosition.height + 8
            : undefined,
          left,
        });
      }
    }
  }, [align, menuType, position, ref, triggerPosition]);

  React.useEffect(() => {
    if (open && ref.current) {
      highlightItem(
        ref.current.querySelector(POPPER_ITEM_SELECTOR) as HTMLElement,
      );
      setCurrentItemIndex(0);
    }
  }, [highlightItem, open, ref, setCurrentItemIndex]);

  useResize(open, handleResize);

  if (open)
    return createPortal(
      <div
        ref={ref}
        data-portal=""
        role="menu"
        popper-content-menu=""
        aria-expanded={open}
        data-state={!animate ? "open" : "closed"}
        className={cn(
          "bg-ui-background rounded-ui-content p-ui-content border fixed z-50 pointer-events-auto focus:ring-0",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className,
        )}
        style={{ ...style, animationDuration: ANIMATION_DURATION + "ms" }}
        onKeyDown={handleKeyDown}
        {...etc}
      >
        {children}
      </div>,
      document.body,
    );
};

const PopperCheckboxItem = ({
  children,
  className,
  suffix,
  prefix,
  asChild,
  inset,
  disabled,
  shortcut,
  onKeyDown,
  onCheck,
  checked,
}: PopperCheckboxItemProps) => {
  return (
    <PopperItem
      role="menuitemcheckbox"
      aria-checked={checked}
      onClick={onCheck}
      className={className}
      suffix={suffix}
      prefix={checked ? <FaCheck /> : prefix}
      inset={inset}
      onKeyDown={onKeyDown}
      shortcut={shortcut}
      disabled={disabled}
      asChild={asChild}
    >
      {children}
    </PopperItem>
  );
};

const PopperItem = React.forwardRef<HTMLElement, PopperItemProps>(
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
      onKeyDown,
      onClick,
      role,
      ...etc
    },
    forwardRef,
  ) => {
    const { highlightItem, isHighlighted, closePopper } = usePopper();

    const navigate = useNavigate();

    const ref = React.useRef<HTMLElement | null>(null);
    React.useImperativeHandle(forwardRef, () => ref.current as HTMLElement);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      if (disabled) return;
      if (onClick) {
        const result = onClick(event);
        if (result instanceof Promise) {
          result
            .then(() => {
              closePopper();
            })
            .catch((error) => {
              console.error("Error in onClick handler:", error);
            });
        } else {
          closePopper();
        }
      } else closePopper();
    };

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      highlightItem(event.currentTarget);
    };

    const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      // highlightItem(event.currentTarget);
    };

    const handleKeyDown = (
      event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    ) => {
      onKeyDown?.(event as React.KeyboardEvent<HTMLElement>);
      const keyCode = (event as React.KeyboardEvent<HTMLElement>).code;
      if (keyCode === "Enter" || keyCode === "Space") {
        event.preventDefault();
        if (href) {
          navigate(href);
        } else {
          handleClick(event as React.MouseEvent<HTMLElement>);
        }
      }
    };

    const attributes = {
      ref,
      tabIndex: -1,
      role: role ? role : "menuitem",
      "popper-content-item": "",
      "popper-content-sub-item":
        ref.current && ref.current.closest(POPPER_SUB_CONTENT_SELECTOR)
          ? ""
          : undefined,
      "aria-disabled": disabled,
      "data-disabled": disabled ? "" : undefined,
      "data-highlighted":
        ref.current && !disabled && isHighlighted(ref.current) ? "" : undefined,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onKeyDown: handleKeyDown,
      onClick: handleClick,
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
            "p-ui-item-inset": inset && !prefix,
            "p-ui-item": !inset || prefix,
          },
          className,
        )}
      >
        {prefix}
        {children}
        {(shortcut || suffix) && (
          <div className="ml-auto flex items-center gap-1 font-geist">
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

const PopperRadioGroup = ({
  children,
  className,
  value,
}: PopperRadioGroupProps) => {
  const [radioValue, setRadioValue] = useState<string>(value || "");

  const selectValue = (value: string) => {
    setRadioValue(value);
  };

  return (
    <PopperRadioGroupContext.Provider value={{ radioValue, selectValue }}>
      <PopperGroup role="radiogroup" className={className}>
        {children}
      </PopperGroup>
    </PopperRadioGroupContext.Provider>
  );
};

const PopperRadioItem = ({
  children,
  className,
  asChild,
  inset,
  disabled,
  prefix,
  suffix,
  onChange,
  shortcut,
  onKeyDown,
  value,
}: PopperRadioItemProps) => {
  const { radioValue, selectValue } = usePopperRadioGroup();

  return (
    <PopperItem
      className={className}
      suffix={suffix}
      prefix={radioValue === value ? <GoDotFill /> : prefix}
      inset={inset}
      onKeyDown={onKeyDown}
      shortcut={shortcut}
      disabled={disabled}
      asChild={asChild}
      role="menuitemradio"
      onClick={() => {
        onChange(value);
        selectValue(value);
      }}
    >
      {children}
    </PopperItem>
  );
};

const PopperGroup = ({
  children,
  className,
  role,
  ...etc
}: PopperGroupProps) => {
  return (
    <div role={role ? role : "group"} className={cn(className)} {...etc}>
      {children}
    </div>
  );
};

const PopperSeparator = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...etc }, forwardRef) => {
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
  },
);

const PopperLabel = forwardRef<
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

Popper.Label = PopperLabel;
Popper.Group = PopperGroup;
Popper.Separator = PopperSeparator;
Popper.ContextTrigger = PopperContextTrigger;
Popper.Trigger = PopperTrigger;
Popper.Item = PopperItem;
Popper.Content = PopperContent;
Popper.CheckboxItem = PopperCheckboxItem;
Popper.RadioGroup = PopperRadioGroup;
Popper.RadioItem = PopperRadioItem;
