import {
  cloneElement,
  createContext,
  Dispatch,
  forwardRef,
  isValidElement,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";
import { cn } from "@/lib/utils.ts";

interface ContextMenuContext {
  open: boolean;
  handleOpen: (clientX: number, clientY: number) => void;
  handleClose: () => void;
  clientPosition: { clientY: number; clientX: number } | null;
  setClientPosition: Dispatch<
    SetStateAction<{ clientY: number; clientX: number } | null>
  >;
  animate: boolean;
  setAnimate: Dispatch<SetStateAction<boolean>>;
}

const ContextMenuContext = createContext<ContextMenuContext | null>(null);

const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error("Context is outside of the provider");
  return context;
};

export default function ContextMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
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
        setAnimate,
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
    <div tabIndex={0} onContextMenu={handleContextMenu} className="select-none">
      {children}
    </div>
  );
};

const ContextMenuContent = ({ children }: { children: ReactNode }) => {
  const { open, clientPosition, handleClose, animate, handleOpen } =
    useContextMenu();

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
      if (event.button === 2) {
        handleOpen(event.clientX, event.clientY);
      } else {
        handleClose();
      }
    }
  });

  if (!open || !clientPosition) return null;

  return createPortal(
    <div
      role="menu"
      ref={ref}
      data-context="popup"
      data-state={!animate}
      className={cn(
        "rounded-ui-content focus:ring-0 border flex-col p-ui-content min-w-40 fixed z-50 bg-ui-background",
        "data-[state='true']:animate-in data-[state='false']:animate-out data-[state='true']:zoom-in data-[state='false']:zoom-out",
      )}
      style={{
        left: clientPosition.clientX,
        top: clientPosition.clientY,
      }}
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
  className?: string;
}

const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItem>(
  (
    { children, onClick, className, asChild = false }: ContextMenuItem,
    forwardRef,
  ) => {
    const { open, handleClose } = useContextMenu();
    const [highlighted, setHighlighted] = useState(false);
    const innerRef = useRef<HTMLDivElement | null>(null);
    const ref = innerRef || forwardRef;

    const findNextMenuItem = (
      currentElement: HTMLElement,
      direction: "next" | "previous",
    ) => {
      const root = currentElement.closest('[role="menu"]');
      if (!root) return null;

      const menuItems = Array.from(
        root.querySelectorAll('[role="menuitem"]'),
      ) as HTMLElement[];

      const currentIndex = menuItems.indexOf(currentElement);

      if (currentIndex === -1) return null;

      let nextIndex;
      if (direction === "next")
        nextIndex = (currentIndex + 1) % menuItems.length;
      else nextIndex = (currentIndex - 1) % menuItems.length;

      return menuItems[nextIndex];
    };

    const handleNavigate: KeyboardEventHandler<HTMLDivElement> = (event) => {
      if (event.code === "ArrowUp" || event.code === "ArrowDown") {
        event.preventDefault();
        const direction = event.code === "ArrowUp" ? "previous" : "next";
        const nextMenuItem = findNextMenuItem(event.currentTarget, direction);

        if (nextMenuItem) nextMenuItem.focus();
      } else if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();
        if (ref.current) ref.current.click();
      }
    };

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
      onClick?.(event);
      handleClose();
    };

    const commonProps = {
      tabIndex: -1,
      ref,
      role: "menuitem",
      "data-highlighted": highlighted ? true : null,
      className: cn(
        "text-ui-foreground justify-between rounded-ui-item p-ui-item w-full focus:ring-0 cursor-default transition-colors",
        "data-[highlighted]:bg-ui-item-background-hover data-[highlighted]:text-ui-item-foreground-hover",
        className,
      ),
      onClick: handleClick,
      onMouseEnter: () => setHighlighted(true),
      onMouseLeave: () => setHighlighted(false),
      onFocus: () => setHighlighted(true),
      onBlur: () => setHighlighted(false),
      onKeyDown: handleNavigate,
    };

    useEffect(() => {
      if (!open) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        if (!ref.current || !ref.current.parentElement) return;

        if (event.code === "ArrowDown") {
          (ref.current.parentElement.firstElementChild as HTMLElement)?.focus();
        } else if (event.code === "ArrowUp") {
          (ref.current.parentElement.lastElementChild as HTMLElement)?.focus();
        } else if (event.code === "Tab") {
          handleClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown, true);
      return () => document.removeEventListener("keydown", handleKeyDown, true);
    }, [open, ref]);

    return asChild && isValidElement(children) ? (
      cloneElement(children, commonProps)
    ) : (
      <div {...commonProps}>{children}</div>
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
  return <div className={cn(className)}>{children}</div>;
};

const ContextMenuSeparator = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn("h-px -mx-ui-content my-ui-content bg-border", className)}
    />
  );
};

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Item = ContextMenuItem;
ContextMenu.Separator = ContextMenuSeparator;
ContextMenu.Group = ContextMenuGroup;
ContextMenu.Content = ContextMenuContent;
