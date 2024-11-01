import React, {
  cloneElement,
  createContext,
  CSSProperties,
  Dispatch,
  forwardRef,
  isValidElement,
  KeyboardEvent,
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";
import { cn } from "@/lib/utils.ts";
import { Link, useNavigate } from "react-router-dom";
import { navigateItems } from "@/utils/navigateItems.ts";
import Button from "@/components/ui/button.tsx";
import {
  PrimitiveGroup,
  PrimitiveLabel,
  PrimitiveSeparator,
} from "@/components/ui/primitives/primitive.tsx";
import {
  MenuContextProps,
  MenuItemProps,
  MenuTriggerProps,
} from "@/components/ui/types.ts";
import { useRestrictBody } from "@/hooks/useRestrictBody.ts";
import { ANIMATION_TIMEOUT } from "@/components/ui/parameters.ts";
import { useResize } from "@/hooks/useResize.ts";

const DropdownMenuContext = createContext<
  | ({
      handleOpen: (element: HTMLElement) => void;
      clientPosition: DOMRect | null;
      setClientPosition: Dispatch<SetStateAction<DOMRect | null>>;
    } & MenuContextProps)
  | null
>(null);

export const useDropdownMenu = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error("Dropdown is outside of the provider");
  return context;
};

export default function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number | undefined>(-1);
  const [currentMenuItem, setCurrentMenuItem] = useState<number | undefined>(
    undefined,
  );
  const [activeTrigger, setActiveTrigger] = useState<HTMLElement | null>(null);

  const [clientPosition, setClientPosition] = useState<DOMRect | null>(null);

  const [animate, setAnimate] = useState(false);

  const handleOpen = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setActiveTrigger(element as HTMLElement);
    setClientPosition(rect);
    setAnimate(false);
    setOpen(true);
  };

  const handleClose = () => {
    setAnimate(true);
    setTimeout(() => {
      setOpen(false);
      setAnimate(false);

      const triggers = Array.from(
        document.querySelectorAll('[data-dropdown="trigger"]'),
      ) as HTMLElement[];
      const findActive = triggers.indexOf(activeTrigger as HTMLElement);
      triggers[findActive].focus();
    }, ANIMATION_TIMEOUT);
    setActiveTrigger(null);
    setCurrentMenuItem(undefined);
  };

  const findMenuItem = (currentElement: HTMLElement) => {
    const root = currentElement.closest("[role='menu']");
    if (!root) return;

    const menuItems = Array.from(
      root.querySelectorAll("[role='menuitem']:not([data-disabled])"),
    );

    return menuItems.indexOf(currentElement);
  };

  const handleHighlight = (value: HTMLElement | number) => {
    if (typeof value === "number") setHighlighted(value);
    else {
      const currentIndex = findMenuItem(value);
      setCurrentMenuItem(currentIndex);
      setHighlighted(currentIndex);
      value.focus();
    }
  };

  const isHighlighted = (currentElement: HTMLElement) =>
    highlighted === findMenuItem(currentElement);

  useRestrictBody(open);

  useEffect(() => {
    if (open) {
      (document.querySelector('[role="menu"]') as HTMLElement).focus();
    }
  }, [open]);

  return (
    <DropdownMenuContext.Provider
      value={{
        open,
        handleOpen,
        handleClose,
        clientPosition,
        setClientPosition,
        animate,
        isHighlighted,
        handleHighlight,
        currentMenuItem,
        setCurrentMenuItem,
      }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
}

const DropdownMenuTrigger = forwardRef<HTMLElement, MenuTriggerProps>(
  (
    {
      children,
      disabled = false,
      className,
      asChild = false,
      suffix,
      prefix,
    }: MenuTriggerProps,
    forwardRef,
  ) => {
    const [hovering, setHovering] = useState(false);
    const { handleOpen, open } = useDropdownMenu();
    const ref = useRef<HTMLElement | null>(null);
    useImperativeHandle(forwardRef, () => ref.current as HTMLElement);

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
      event.preventDefault();

      if (!open) {
        handleOpen(event.currentTarget as HTMLElement);
      }
    };

    const commonProps = {
      ref,
      "data-dropdown": "trigger",
      "data-highlighted": hovering ? true : undefined,
      "data-disabled": disabled ? true : undefined,
      "aria-disabled": disabled ? true : undefined,
      className: cn(
        "text-gray-900 border rounded-md px-2.5 h-10 text-sm border-gray-alpha-400 bg-background-100",
        "disabled:bg-gray-100 disabled:text-gray-700 disabled:border-gray-400",
        {
          "text-foreground bg-gray-alpha-200": hovering,
          "justify-between": suffix,
          "gap-2": prefix,
        },
        className,
      ),
      onClick: handleClick,
      onMouseEnter: () => setHovering(true),
      onMouseLeave: () => setHovering(false),
    };

    return asChild && isValidElement(children) ? (
      cloneElement(children, commonProps)
    ) : (
      <Button
        data-dropdown="trigger"
        prefix={prefix}
        suffix={suffix}
        primary
        onClick={handleClick}
      >
        {children}
      </Button>
    );
  },
);

const DropdownMenuContent = ({ children }: { children: ReactNode }) => {
  const {
    open,
    clientPosition,
    handleClose,
    animate,
    handleHighlight,
    currentMenuItem,
    setCurrentMenuItem,
  } = useDropdownMenu();
  const [menuStyle, setMenuStyle] = useState<CSSProperties | undefined>(
    undefined,
  );

  const ref = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (document.querySelector("[data-dropdownsub='popup']")) return false;
    navigateItems({
      event,
      itemSelector:
        '[role="menuitem"]:not([data-disabled]):not([data-dropdownsub="item"])',
      currentMenuItem,
      setCurrentMenuItem,
      handleClose,
      handleHighlight,
      root: (event.target as HTMLElement).closest('[role="menu"]'),
    });
  };

  useOutsideClick(ref, handleClose);

  const updateMenuPosition = () => {
    if (!ref.current || !open || !clientPosition) return;

    const spaceLeftBottom = window.innerHeight - clientPosition.bottom;
    // const spaceLeftRight = window.innerWidth - clientPosition.right;

    // const canFitRight = spaceLeftRight > ref.current.clientWidth;
    const canFitBottom = spaceLeftBottom > ref.current.clientHeight;

    const placeCenter = (window.innerWidth - ref.current.clientWidth) / 2;

    setMenuStyle({
      top: canFitBottom
        ? clientPosition.top + clientPosition.height + 8
        : undefined,
      bottom: !canFitBottom
        ? spaceLeftBottom + clientPosition.height + 8
        : undefined,
      left: placeCenter,
    });
  };

  useResize(open, updateMenuPosition, [open]);

  if (!open) return null;

  return createPortal(
    <div
      tabIndex={-1}
      role="menu"
      ref={ref}
      data-dropdown="popup"
      data-state={!animate}
      className={cn(
        "pointer-events-auto rounded-ui-content focus:ring-0 border flex-col p-ui-content min-w-56 fixed z-50 bg-ui-background",
        "data-[state='true']:animate-in data-[state='false']:animate-out data-[state='true']:zoom-in data-[state='false']:zoom-out data-[state='true']:fade-in data-[state='false']:fade-out",
      )}
      style={menuStyle}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>,
    document.body,
  );
};

const DropdownMenuItem = forwardRef<
  HTMLDivElement | HTMLAnchorElement,
  MenuItemProps
>(
  (
    {
      children,
      onClick,
      inset = false,
      href,
      disabled = false,
      className,
      asChild = false,
      suffix,
      prefix,
      shortcut,
    }: MenuItemProps,
    forwardRef,
  ) => {
    const { handleClose, handleHighlight, isHighlighted } = useDropdownMenu();

    const navigate = useNavigate();

    const ref = useRef<HTMLDivElement | HTMLAnchorElement | null>(null);
    useImperativeHandle(
      forwardRef,
      () => ref.current as HTMLDivElement | HTMLAnchorElement,
    );

    const handleClick = (event: MouseEvent | KeyboardEvent) => {
      if (disabled) return;
      onClick?.(event as React.MouseEvent<HTMLElement>);
      // if (!event.currentTarget.closest('[data-dropdownsub="popup"]'))
      handleClose();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Enter" || event.code === "Space") {
        event.preventDefault();
        if (href) {
          navigate(href);
        } else {
          handleClick(event);
        }
      }
    };

    const commonProps = {
      tabIndex: -1,
      ref,
      role: "menuitem",
      "data-highlighted":
        ref.current && isHighlighted(ref.current) && !disabled ? true : null,
      "data-disabled": disabled ? true : undefined,
      "aria-disabled": disabled ? true : undefined,
      "data-dropdownsub":
        ref.current &&
        ref.current.closest("[data-dropdownsub='popup']") &&
        "item",
      className: cn(
        "text-foreground flex items-center justify-start rounded-ui-item w-full focus:ring-0 cursor-default transition-colors",
        "data-[highlighted]:bg-ui-item-background-hover data-[disabled]:text-ui-disabled-foreground data-[disabled]:pointer-events-none data-[disabled]:select-none",
        {
          "cursor-pointer": href,
          "gap-2": prefix,
          "p-ui-item-inset": inset,
          "p-ui-item": !inset,
        },
        className,
      ),
      onClick: handleClick,
      onMouseEnter: (
        event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>,
      ) => !disabled && handleHighlight(event.currentTarget),
      onMouseLeave: () => !disabled && handleHighlight(-1),
      onFocus: (event: React.FocusEvent<HTMLDivElement | HTMLAnchorElement>) =>
        !disabled && handleHighlight(event.currentTarget),
      onBlur: () => !disabled && handleHighlight(-1),
      onKeyDown: handleKeyDown,
    };

    return asChild && isValidElement(children) ? (
      cloneElement(children, commonProps)
    ) : href ? (
      <Link
        to={href}
        {...(commonProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {prefix && <span className="size-4">{prefix}</span>}
        {children}
        {(shortcut || suffix) && (
          <div className="ml-auto flex items-center gap-1">
            {suffix && <span className="size-4">{suffix}</span>}
            {shortcut && (
              <span className="text-xs opacity-60 tracking-widest">
                {shortcut}
              </span>
            )}
          </div>
        )}
      </Link>
    ) : (
      <div
        {...(commonProps as React.HTMLAttributes<HTMLDivElement>)}
        onClick={handleClick}
      >
        {prefix && <span className="size-4">{prefix}</span>}
        {children}
        {(shortcut || suffix) && (
          <div className="ml-auto flex items-center gap-1">
            {suffix && <span className="size-4">{suffix}</span>}
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

DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Separator = PrimitiveSeparator;
DropdownMenu.Group = PrimitiveGroup;
DropdownMenu.Label = PrimitiveLabel;
DropdownMenu.Content = DropdownMenuContent;
