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
import { calculateAvailableRoom } from "@/utils/calculateAvailableRoom.ts";
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

  const placeAbove = calculateAvailableRoom(
    clientPosition.clientY,
    clientPosition.clientX,
  );

  return createPortal(
    <div
      ref={ref}
      data-context="popup"
      data-state={!animate}
      className="rounded-md border p-1 flex-col min-w-40 fixed z-50 bg-background-100 data-[state='true']:animate-in data-[state='false']:animate-out data-[state='true']:zoom-in data-[state='false']:zoom-out focus:ring-0"
      style={{
        left: clientPosition.clientX,
        top: clientPosition.clientY,
        transform: placeAbove ? "translateY(-100%)" : "translateY(0)",
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

    const handleNavigate: KeyboardEventHandler<HTMLDivElement> = (event) => {
      if (event.code === "ArrowUp" || event.code === "ArrowDown") {
        event.preventDefault();
        console.log(event.currentTarget);
        const sibling =
          event.code === "ArrowUp"
            ? event.currentTarget.previousElementSibling
            : event.currentTarget.nextElementSibling;

        if (sibling) {
          (sibling as HTMLElement).focus();
        }
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
        "text-gray-700 justify-between rounded pl-8 pr-2 py-1.5 w-full data-[highlighted]:bg-gray-200 data-[highlighted]:text-foreground focus:ring-0 cursor-default transition-colors",
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

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Content = ContextMenuContent;
ContextMenu.Item = ContextMenuItem;
