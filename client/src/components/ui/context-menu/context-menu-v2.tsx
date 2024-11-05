import React, { useRef } from "react";
import { cn } from "@/lib/utils.ts";
import { createPortal } from "react-dom";
import {
  ClientPosition,
  PopperAction,
  PopperActionKind,
  PopperContentProps,
  PopperContextProps,
  PopperState,
} from "@/types/ui/popper.ts";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";

const initializer: PopperState = {
  open: false,
  position: null,
};

const PopperContext = React.createContext<PopperContextProps | null>(null);

const reducer = (state: PopperState, action: PopperAction) => {
  switch (action.type) {
    case PopperActionKind.open:
      return {
        ...state,
        open: true,
        animate: false,
        position: action.payload || null,
      };
    case PopperActionKind.close:
      return { ...state, open: false };
    default:
      return state;
  }
};

export const usePopper = () => {
  const context = React.useContext(PopperContext);
  if (!context) {
    throw new Error("usePopper must be used within a PopperContext.Provider");
  }
  return context;
};

const ContextMenu = ({ children }: { children: React.ReactNode }) => {
  const [{ open, position }, dispatch] = React.useReducer(reducer, initializer);

  const openPopper = (position: ClientPosition) => {
    dispatch({ type: PopperActionKind.open, payload: position });
  };

  const closePopper = () => {
    dispatch({ type: PopperActionKind.close });
  };

  return (
    <PopperContext.Provider value={{ open, openPopper, closePopper, position }}>
      {children}
    </PopperContext.Provider>
  );
};

const ContextMenuTrigger = ({ children }: { children: React.ReactNode }) => {
  const { open, openPopper } = usePopper();
  const handleContextMenu: React.MouseEventHandler<HTMLDivElement> = (
    event,
  ) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    openPopper({ clientX, clientY });
  };

  const attributes: React.HTMLAttributes<HTMLDivElement> & {
    "context-trigger"?: string;
    [key: `data-${string}`]: string | undefined;
  } = {
    "context-trigger": "",
    "aria-expanded": open,
    "data-state": open ? "open" : "closed",
    onContextMenu: handleContextMenu,
  };

  return (
    React.isValidElement(children) && React.cloneElement(children, attributes)
  );
};

const ContextMenuContent = ({ children, className }: PopperContentProps) => {
  const { open, position, closePopper } = usePopper();

  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  React.useEffect(() => {
    if (position) {
      x.set(position.clientX);
      y.set(position.clientY);
    }
  }, [position, x, y]);

  React.useEffect(() => {
    const handleResize = () => {
      if (position) {
        x.set(position.clientX);
        y.set(position.clientY);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [position, x, y]);

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
          style={{
            left: x,
            top: y,
          }}
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
