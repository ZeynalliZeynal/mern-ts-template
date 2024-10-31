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
import { navigateItems } from "@/utils/navigateItems.ts";
import { ANIMATION_TIMEOUT } from "@/components/ui/context-menu/context-parameters.ts";
import Button from "@/components/ui/button.tsx";

interface DropdownMenuDropdown {
  open: boolean;
  handleOpen: (rect: DOMRect) => void;
  handleClose: () => void;
  clientPosition: DOMRect | null;
  setClientPosition: Dispatch<SetStateAction<DOMRect | null>>;
  animate: boolean;
  handleHighlight: (value: HTMLElement | number) => void;
  isHighlighted: (currentElement: HTMLElement) => boolean;
  currentMenuItem: number | undefined;
  setCurrentMenuItem: Dispatch<SetStateAction<number | undefined>>;
}

interface DropdownMenuTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  disabled?: boolean;
  className?: string;
  inset?: boolean;
  href?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

interface DropdownMenuItem {
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

const DropdownMenuDropdown = createContext<DropdownMenuDropdown | null>(null);

export const useDropdownMenu = () => {
  const context = useContext(DropdownMenuDropdown);
  if (!context) throw new Error("Dropdown is outside of the provider");
  return context;
};

export default function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number | undefined>(-1);
  const [currentMenuItem, setCurrentMenuItem] = useState<number | undefined>(
    undefined,
  );

  const [clientPosition, setClientPosition] = useState<DOMRect | null>(null);

  const [animate, setAnimate] = useState(false);

  const handleOpen = (rect: DOMRect) => {
    setClientPosition(rect);
    setAnimate(false);
    setOpen(true);
  };

  const handleClose = () => {
    setAnimate(true);
    setTimeout(() => {
      setOpen(false);
      setAnimate(false);
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

  useEffect(() => {
    if (open) {
      document.body.style.marginRight = "6px";
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "none";
    } else {
      document.body.style.marginRight = "0px";
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "auto";
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      (document.querySelector('[role="menu"]') as HTMLElement).focus();
    }
  }, [open]);

  return (
    <DropdownMenuDropdown.Provider
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
    </DropdownMenuDropdown.Provider>
  );
}

const DropdownMenuTrigger = forwardRef<HTMLElement, DropdownMenuTriggerProps>(
  (
    {
      children,
      disabled = false,
      className,
      asChild = false,
      suffix,
      prefix,
    }: DropdownMenuTriggerProps,
    forwardRef,
  ) => {
    const [hovering, setHovering] = useState(false);
    const { handleOpen, open } = useDropdownMenu();
    const ref = useRef<HTMLElement | null>(null);
    useImperativeHandle(forwardRef, () => ref.current as HTMLElement);

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
      event.preventDefault();

      const rect = event.currentTarget.getBoundingClientRect();

      if (!open) {
        handleOpen(rect);
      }
    };

    const commonProps = {
      ref,
      "data-highlighted": hovering ? true : undefined,
      "data-disabled": disabled ? true : undefined,
      "aria-disabled": disabled ? true : undefined,
      className: cn(
        "text-gray-900 border rounded-md px-2.5 h-10 text-sm border-gray-alpha-400 bg-background-100",
        "data-[highlighted]:text-foreground data-[highlighted]:bg-gray-alpha-200 disabled:bg-gray-100 disabled:text-gray-700 disabled:border-gray-400",
        {
          "justify-between": suffix,
          "gap-2": prefix,
        },
        className,
      ),
      onMouseEnter: () => setHovering(true),
      onMouseLeave: () => setHovering(false),
    };

    return asChild && isValidElement(children) ? (
      cloneElement(children, commonProps)
    ) : (
      <Button prefix={prefix} suffix={suffix} primary onClick={handleClick}>
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
    handleOpen,
    handleHighlight,
    currentMenuItem,
    setCurrentMenuItem,
    setClientPosition,
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
    const spaceLeftRight = window.innerWidth - clientPosition.right;

    const canFitRight = spaceLeftRight > ref.current.clientWidth;
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

  useEffect(() => {
    updateMenuPosition();
    const handleResize = () => {
      updateMenuPosition();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [open, clientPosition]);

  if (!open || !clientPosition) return null;

  return createPortal(
    <div
      tabIndex={-1}
      role="menu"
      ref={ref}
      data-context="popup"
      data-state={!animate}
      className={cn(
        "pointer-events-auto rounded-ui-content focus:ring-0 border flex-col p-ui-content min-w-64 fixed z-50 bg-ui-background",
        "data-[state='true']:animate-in data-[state='false']:animate-out data-[state='true']:zoom-in data-[state='false']:zoom-out data-[state='true']:fade-in data-[state='false']:fade-out",
      )}
      style={menuStyle}
      onKeyDown={handleKeyDown}
      // onDropdownMenu={(event) => event.preventDefault()}
    >
      {children}
    </div>,
    document.body,
  );
};

const DropdownMenuItem = forwardRef<
  HTMLDivElement | HTMLAnchorElement,
  DropdownMenuItem
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
    }: DropdownMenuItem,
    forwardRef,
  ) => {
    const { handleClose, handleHighlight, isHighlighted } = useDropdownMenu();
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
        handleClick(event);
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

const DropdownMenuGroup = ({
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

const DropdownMenuSeparator = ({ className }: { className?: string }) => {
  return (
    <div
      role="separator"
      className={cn("h-px -mx-ui-content my-ui-content bg-border", className)}
    />
  );
};

DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Item = DropdownMenuItem;
DropdownMenu.Separator = DropdownMenuSeparator;
DropdownMenu.Group = DropdownMenuGroup;
DropdownMenu.Content = DropdownMenuContent;
