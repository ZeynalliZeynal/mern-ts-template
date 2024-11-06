import React, {
  CSSProperties,
  Dispatch,
  SetStateAction,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils.ts";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";
import { useResize } from "@/hooks/useResize.ts";

type ClientPosition =
  | {
      left: number;
      top: number;
    }
  | undefined;

type PopperContextProps = {
  openPopper: (position: ClientPosition) => void;
  closePopper: () => void;
  open: boolean;
  position?: ClientPosition;
  triggerPosition?: DOMRect;
  setTriggerPosition: Dispatch<SetStateAction<DOMRect | undefined>>;
};

type PopperContentProps = {
  children: React.ReactNode;
  className?: string;
};

const PopperContext = React.createContext<PopperContextProps | null>(null);

export const usePopper = () => {
  const context = React.useContext(PopperContext);
  if (!context) {
    throw new Error("usePopper must be used within a PopperContext.Provider");
  }
  return context;
};

const ContextMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [triggerPosition, setTriggerPosition] = useState<DOMRect | undefined>(
    undefined,
  );
  const [position, setPosition] = useState<ClientPosition>(undefined);

  const openPopper = (position: ClientPosition) => {
    setOpen(true);
    setPosition(position);
  };

  const closePopper = () => {
    setOpen(false);
  };

  return (
    <PopperContext.Provider
      value={{
        open,
        openPopper,
        closePopper,
        position,
        triggerPosition,
        setTriggerPosition,
      }}
    >
      {children}
    </PopperContext.Provider>
  );
};

const ContextMenuTrigger = React.forwardRef<
  HTMLElement,
  { children: React.ReactNode }
>(({ children }, forwardRef) => {
  const { open, openPopper, setTriggerPosition } = usePopper();

  const ref = useRef<HTMLElement | null>(null);
  React.useImperativeHandle(forwardRef, () => ref.current as HTMLElement);

  const updatePosition = () => {
    if (ref.current) {
      setTriggerPosition(ref.current.getBoundingClientRect());
    }
  };

  useResize(open, updatePosition);

  const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    const left = Math.abs(
      clientX - event.currentTarget.getBoundingClientRect().left,
    );
    const top = Math.abs(
      clientY - event.currentTarget.getBoundingClientRect().top,
    );
    openPopper({ left, top });
  };

  const attributes = {
    ref,
    "context-trigger": "",
    "aria-expanded": open,
    "data-state": open ? "open" : "closed",
    onContextMenu: handleContextMenu,
  };

  return (
    React.isValidElement(children) && React.cloneElement(children, attributes)
  );
});

const ContextMenuContent = ({ children, className }: PopperContentProps) => {
  const { open, position, closePopper, triggerPosition } = usePopper();
  const [style, setStyle] = useState<CSSProperties>({});

  const ref = useRef<HTMLDivElement | null>(null);

  const handleResize = () => {
    if (position && triggerPosition) {
      const { left, top } = position;
      setStyle({
        left: Math.max(triggerPosition.left + left, 0),
        top: triggerPosition.top + top,
      });
    }
  };
  useResize(open, handleResize);

  useOutsideClick(ref, closePopper);

  return createPortal(
    <AnimatePresence>
      {open && position && (
        <motion.div
          ref={ref}
          data-portal=""
          role="menu"
          context-content=""
          aria-expanded={open}
          data-state={open ? "open" : "closed"}
          className={cn(
            "bg-ui-background rounded-ui-content min-w-52 p-ui-content border fixed z-50",
            className,
          )}
          style={style}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.15,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

ContextMenu.Trigger = ContextMenuTrigger;
ContextMenu.Content = ContextMenuContent;
export default ContextMenu;
