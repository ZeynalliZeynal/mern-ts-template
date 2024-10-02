import {
  createContext,
  Dispatch,
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
    <div onContextMenu={handleContextMenu} className="select-none">
      {children}
    </div>
  );
};

const ContextMenuContent = ({ children }: { children: ReactElement }) => {
  const { open, clientPosition, handleClose, animate, handleOpen } =
    useContextMenu();

  const ref = useRef<HTMLDivElement | null>(null);

  useOutsideClick(ref, (event) => {
    if (event) {
      console.log(event.button);
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
      className={cn(
        "rounded-lg border p-1 flex-col min-w-40 fixed z-50 bg-background-100",
        {
          "animate-fadeIn": !animate,
          "animate-fadeOut": animate,
        },
      )}
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

const ContextMenuItem = ({ children }: { children: ReactNode }) => {
  const [hoveredOption, setHoveredOption] = useState("");

  return (
    <button
      tabIndex={0}
      data-hover={hoveredOption === JSON.stringify(children) ? true : null}
      className="text-gray-700 justify-between rounded data-[hover]:bg-gray-200 data-[hover]:text-foreground px-3 py-1.5 w-full focus:ring-0 cursor-default"
      onMouseEnter={(event) => {
        event.currentTarget.focus();
        setHoveredOption(JSON.stringify(children));
      }}
      onMouseLeave={() => setHoveredOption("")}
    >
      {children}
    </button>
  );
};

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Content = ContextMenuContent;
ContextMenu.Item = ContextMenuItem;
