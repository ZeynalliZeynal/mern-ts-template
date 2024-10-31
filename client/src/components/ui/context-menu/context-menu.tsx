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
import { MenuContextProps, MenuItemProps } from "@/components/ui/types.ts";
import { useRestrictBody } from "@/hooks/useRestrictBody.ts";
import { ANIMATION_TIMEOUT } from "@/components/ui/parameters.ts";

const ContextMenuContext = createContext<
  | ({
      handleOpen: (event: MouseEvent) => void;
      clientPosition: { clientX: number; clientY: number } | null;
      setClientPosition: Dispatch<
        SetStateAction<{ clientX: number; clientY: number } | null>
      >;
    } & MenuContextProps)
  | null
>(null);

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error("Context is outside of the provider");
  return context;
};

export default function ContextMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number | undefined>(-1);
  const [currentMenuItem, setCurrentMenuItem] = useState<number | undefined>(
    undefined,
  );
  const [activeTrigger, setActiveTrigger] = useState<HTMLElement | null>(null);
  const [clientPosition, setClientPosition] = useState<{
    clientX: number;
    clientY: number;
  } | null>(null);

  const [animate, setAnimate] = useState(false);

  const handleOpen = (event: MouseEvent) => {
    const { clientX, clientY } = event;
    setClientPosition({ clientX, clientY });
    setActiveTrigger(event.currentTarget as HTMLElement);
    setAnimate(false);
    setOpen(true);
  };

  const handleClose = () => {
    setAnimate(true);
    setTimeout(() => {
      setOpen(false);
      setAnimate(false);

      const triggers = Array.from(
        document.querySelectorAll('[data-context="trigger"]'),
      ) as HTMLElement[];
      const findActive = triggers.indexOf(activeTrigger as HTMLElement);
      triggers[findActive].focus();
    }, ANIMATION_TIMEOUT);
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

  useEffect(() => {
    const closeOnResize = () => setOpen(false);

    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  return (
    <ContextMenuContext.Provider
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
    </ContextMenuContext.Provider>
  );
}

const ContextMenuTrigger = ({ children }: { children: ReactNode }) => {
  const { handleOpen, open } = useContextMenu();

  const handleContextMenu: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    if (open) {
      setTimeout(() => {
        handleOpen(event);
      }, ANIMATION_TIMEOUT);
    } else {
      handleOpen(event);
    }
  };

  return (
    <div
      tabIndex={0}
      data-context="trigger"
      onContextMenu={handleContextMenu}
      className="select-none pointer-events-auto"
    >
      {children}
    </div>
  );
};

const ContextMenuContent = ({ children }: { children: ReactNode }) => {
  const {
    open,
    clientPosition,
    handleClose,
    animate,
    handleOpen,
    handleHighlight,
    currentMenuItem,
    setCurrentMenuItem,
  } = useContextMenu();
  const [menuStyle, setMenuStyle] = useState<CSSProperties | undefined>(
    undefined,
  );

  const ref = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (document.querySelector("[data-contextsub='popup']")) return false;
    navigateItems({
      event,
      itemSelector:
        '[role="menuitem"]:not([data-disabled]):not([data-contextsub="item"])',
      currentMenuItem,
      setCurrentMenuItem,
      handleClose,
      handleHighlight,
      root: (event.target as HTMLElement).closest('[role="menu"]'),
    });
  };

  useOutsideClick(ref, handleClose);

  useEffect(() => {
    if (!ref.current || !open || !clientPosition) return;

    const newMenuStyle = { ...menuStyle };

    const isEnoughSpaceBelow =
      window.innerHeight - clientPosition.clientY > ref.current.clientHeight;
    const isEnoughSpaceRight =
      window.innerWidth - clientPosition.clientX > ref.current.clientWidth;

    newMenuStyle.top = isEnoughSpaceBelow ? clientPosition.clientY : undefined;
    newMenuStyle.bottom = !isEnoughSpaceBelow
      ? // ? window.innerHeight - clientPosition.clientY
        16
      : undefined;

    newMenuStyle.left = isEnoughSpaceRight ? clientPosition.clientX : undefined;
    newMenuStyle.right = !isEnoughSpaceRight
      ? // ? window.innerWidth - clientPosition.clientX
        16
      : undefined;

    setMenuStyle(newMenuStyle);
  }, [handleOpen, open]);

  if (!open || !clientPosition) return null;

  return createPortal(
    <div
      tabIndex={-1}
      role="menu"
      ref={ref}
      data-context="popup"
      data-state={!animate}
      className={cn(
        "pointer-events-auto rounded-ui-content focus:ring-0 border flex-col p-ui-content min-w-56 fixed z-50 bg-ui-background",
        "data-[state='true']:animate-in data-[state='false']:animate-out data-[state='true']:zoom-in data-[state='false']:zoom-out data-[state='true']:fade-in data-[state='false']:fade-out",
      )}
      style={menuStyle}
      onKeyDown={handleKeyDown}
      // onContextMenu={(event) => event.preventDefault()}
    >
      {children}
    </div>,
    document.body,
  );
};

const ContextMenuItem = forwardRef<
  HTMLDivElement | HTMLAnchorElement,
  MenuItemProps
>(
  (
    {
      children,
      onClick,
      className,
      asChild = false,
      disabled = false,
      href,
      inset = false,
      suffix,
      prefix,
      shortcut,
    }: MenuItemProps,
    forwardRef,
  ) => {
    const { handleClose, handleHighlight, isHighlighted } = useContextMenu();

    const navigate = useNavigate();

    const ref = useRef<HTMLDivElement | HTMLAnchorElement | null>(null);
    useImperativeHandle(
      forwardRef,
      () => ref.current as HTMLDivElement | HTMLAnchorElement,
    );

    const handleClick = (event: MouseEvent | KeyboardEvent) => {
      if (disabled) return;
      onClick?.(event as React.MouseEvent<HTMLElement>);
      // if (!event.currentTarget.closest('[data-contextsub="popup"]'))
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
      "data-contextsub":
        ref.current &&
        ref.current.closest("[data-contextsub='popup']") &&
        "item",
      className: cn(
        "text-foreground flex items-center justify-start rounded-ui-item w-full focus:ring-0 cursor-default",
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

const ContextMenuGroup = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div role="group" className={cn(className)}>
      {children}
    </div>
  );
};

const ContextMenuSeparator = ({ className }: { className?: string }) => {
  return (
    <div
      role="separator"
      className={cn("h-px -mx-ui-content my-ui-content bg-border", className)}
    />
  );
};

const ContextMenuLabel = ({
  children,
  className,
  inset = false,
  suffix,
  prefix,
}: {
  children: ReactNode;
  className?: string;
  inset?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
}) => {
  return (
    <div
      tabIndex={-1}
      className={cn(
        "text-foreground flex items-center w-full select-none",
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
};

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Label = ContextMenuLabel;
ContextMenu.Item = ContextMenuItem;
ContextMenu.Separator = ContextMenuSeparator;
ContextMenu.Group = ContextMenuGroup;
ContextMenu.Content = ContextMenuContent;
