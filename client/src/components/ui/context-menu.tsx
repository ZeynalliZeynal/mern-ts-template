import React, {
  cloneElement,
  createContext,
  CSSProperties,
  Dispatch,
  forwardRef,
  isValidElement,
  MouseEventHandler,
  ReactElement,
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
import { Link } from "react-router-dom";

interface ContextMenuContext {
  open: boolean;
  handleOpen: (clientX: number, clientY: number) => void;
  handleClose: () => void;
  clientPosition: { clientY: number; clientX: number } | null;
  setClientPosition: Dispatch<
    SetStateAction<{ clientY: number; clientX: number } | null>
  >;
  animate: boolean;
  handleHighlight: (value: HTMLElement | number) => void;
  isHighlighted: (currentElement: HTMLElement) => boolean;
}

const ContextMenuContext = createContext<ContextMenuContext | null>(null);

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error("Context is outside of the provider");
  return context;
};

export default function ContextMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number | undefined>(-1);

  const [clientPosition, setClientPosition] = useState<{
    clientX: number;
    clientY: number;
  } | null>(null);

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const closeOnResize = () => setOpen(false);

    window.addEventListener("resize", closeOnResize);
    return () => window.removeEventListener("resize", closeOnResize);
  }, []);

  const handleOpen = (clientX: number, clientY: number) => {
    setClientPosition({ clientX, clientY });
    setAnimate(false);
    setOpen(true);
  };

  const handleClose = () => {
    setAnimate(true);
    setTimeout(() => {
      setOpen(false);
      setAnimate(false);
    }, 150);
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
      setHighlighted(currentIndex);
    }
  };

  const isHighlighted = (currentElement: HTMLElement) =>
    highlighted === findMenuItem(currentElement);

  useEffect(() => {
    if (open) {
      document.body.style.marginRight = "6px";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.marginRight = "0px";
      document.body.style.overflow = "auto";
    }
  }, [open]);

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
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}

const ContextMenuTrigger = ({ children }: { children: ReactNode }) => {
  const { handleOpen } = useContextMenu();

  const handleContextMenu: MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    const { clientY, clientX } = event;
    handleOpen(clientX, clientY);
  };

  return (
    <div
      tabIndex={0}
      data-context="trigger"
      onContextMenu={handleContextMenu}
      className="select-none"
    >
      {children}
    </div>
  );
};

const ContextMenuContent = ({ children }: { children: ReactNode }) => {
  const { open, clientPosition, handleClose, animate, handleOpen } =
    useContextMenu();
  const [menuStyle, setMenuStyle] = useState<CSSProperties | undefined>(
    undefined,
  );

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && ref.current) {
      document.addEventListener("keydown", (event) => {
        if (event.code === "Escape") handleClose();
      });
    }

    return () =>
      document.removeEventListener("keydown", (event) => {
        if (event.code === "Escape") handleClose();
      });
  }, [open]);

  useOutsideClick(ref, (event) => {
    if (event) {
      if (
        event.button === 2 &&
        (event.target as HTMLElement).parentElement?.dataset.context ===
          "trigger"
      ) {
        handleOpen(event.clientX, event.clientY);
      } else {
        handleClose();
      }
    }
  });

  useEffect(() => {
    if (!ref.current || !open || !clientPosition) return;

    const newMenuStyle = { ...menuStyle };

    const isEnoughSpaceBelow =
      window.innerHeight - clientPosition.clientY > ref.current.clientHeight;
    const isEnoughSpaceRight =
      window.innerWidth - clientPosition.clientX > ref.current.clientWidth;

    newMenuStyle.top = isEnoughSpaceBelow ? clientPosition.clientY : undefined;
    newMenuStyle.bottom = !isEnoughSpaceBelow
      ? window.innerHeight - clientPosition.clientY
      : undefined;

    newMenuStyle.left = isEnoughSpaceRight ? clientPosition.clientX : undefined;
    newMenuStyle.right = !isEnoughSpaceRight
      ? window.innerWidth - clientPosition.clientX
      : undefined;

    setMenuStyle(newMenuStyle);
  }, [handleOpen, open]);

  if (!open || !clientPosition) return null;

  return createPortal(
    <div
      role="menu"
      ref={ref}
      data-context="popup"
      data-state={!animate}
      className={cn(
        "rounded-ui-content focus:ring-0 border flex-col p-ui-content min-w-64 fixed z-50 bg-ui-background",
        "data-[state='true']:animate-in data-[state='false']:animate-out data-[state='true']:zoom-in data-[state='false']:zoom-out data-[state='true']:fade-in data-[state='false']:fade-out",
      )}
      style={menuStyle}
    >
      {children}
    </div>,
    document.body,
  );
};

interface ContextMenuItem {
  children: ReactNode | ReactElement;
  onClick?: MouseEventHandler<HTMLElement>;
  asChild?: boolean;
  disabled?: boolean;
  className?: string;
  inset?: boolean;
  href?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

const ContextMenuItem = forwardRef<
  HTMLDivElement | HTMLAnchorElement,
  ContextMenuItem
>(
  (
    {
      children,
      onClick,
      className,
      asChild = false,
      disabled = false,
      inset = false,
      href,
      suffix,
      prefix,
    }: ContextMenuItem,
    forwardRef,
  ) => {
    const { handleClose, handleHighlight, isHighlighted } = useContextMenu();
    const ref = useRef<HTMLDivElement | HTMLAnchorElement | null>(null);
    useImperativeHandle(
      forwardRef,
      () => ref.current as HTMLDivElement | HTMLAnchorElement,
    );

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
      if (disabled) return;
      onClick?.(event);
      // if (!event.currentTarget.closest('[data-contextsub="popup"]'))
      handleClose();
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
        "text-foreground flex items-center rounded-ui-item w-full focus:ring-0 cursor-default transition-colors",
        "data-[highlighted]:bg-ui-item-background-hover data-[disabled]:text-ui-disabled-foreground data-[disabled]:pointer-events-none data-[disabled]:select-none",
        {
          "cursor-pointer": href,
          "justify-between": suffix,
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
        {suffix && <span className="size-4">{suffix}</span>}
      </Link>
    ) : (
      <div
        {...(commonProps as React.HTMLAttributes<HTMLDivElement>)}
        onClick={handleClick}
      >
        {prefix && <span className="size-4">{prefix}</span>}
        {children}
        {suffix && <span className="size-4">{suffix}</span>}
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

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Item = ContextMenuItem;
ContextMenu.Separator = ContextMenuSeparator;
ContextMenu.Group = ContextMenuGroup;
ContextMenu.Content = ContextMenuContent;
