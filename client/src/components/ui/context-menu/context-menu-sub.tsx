import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useContextMenu } from "@/components/ui/context-menu.tsx";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils.ts";
import { ChevronRight } from "lucide-react";

interface ContextMenuSubContext {
  openSub: boolean;
  handleOpenSub: () => void;
  handleCloseSub: () => void;
  subRect: DOMRect | null;
  setSubRect: Dispatch<SetStateAction<DOMRect | null>>;
  animate: boolean;
}

const ContextMenuSubContext = createContext<ContextMenuSubContext | null>(null);

export const useContextMenuSub = () => {
  const context = useContext(ContextMenuSubContext);
  if (!context) throw new Error("Sub context is outside of the provider");
  return context;
};

export default function ContextMenuSub({ children }: { children: ReactNode }) {
  const { open } = useContextMenu();

  const [openSub, setOpenSub] = useState(false);
  const [subRect, setSubRect] = useState<DOMRect | null>(null);
  const [animate, setAnimate] = useState(false);

  const handleOpenSub = () => {
    if (!open) return;
    setAnimate(false);
    setOpenSub(true);
  };

  const handleCloseSub = () => {
    setAnimate(true);
    setTimeout(() => {
      setOpenSub(false);
      setAnimate(false);
    }, 150);
  };

  useEffect(() => {
    if (!open) {
      handleCloseSub();
    }
  }, [open]);

  return (
    <ContextMenuSubContext.Provider
      value={{
        openSub,
        subRect,
        setSubRect,
        animate,
        handleOpenSub,
        handleCloseSub,
      }}
    >
      {children}
    </ContextMenuSubContext.Provider>
  );
}

const ContextMenuSubTrigger = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { isHighlighted, handleHighlight } = useContextMenu();
  const { openSub, handleOpenSub, setSubRect, handleCloseSub } =
    useContextMenuSub();

  const ref = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    handleOpenSub();
    handleHighlight(event.currentTarget);
    setSubRect(event.currentTarget.getBoundingClientRect());
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (!relatedTarget || !relatedTarget.closest('[data-contextsub="popup"]')) {
      handleCloseSub();
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    handleOpenSub();
    handleHighlight(event.currentTarget);
  };

  const handleBlur = () => {
    handleHighlight(-1);
  };

  return (
    <div
      tabIndex={0}
      ref={ref}
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={openSub}
      data-state={openSub}
      data-highlighted={
        ref.current && isHighlighted(ref.current) ? true : undefined
      }
      className={cn(
        "text-foreground flex justify-between items-center rounded-ui-item p-ui-item w-full focus:ring-0 cursor-default transition-colors",
        "data-[highlighted]:bg-ui-item-background-hover data-[state='true']:bg-ui-item-background-hover data-[disabled]:text-ui-disabled-foreground data-[disabled]:select-none",
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      <span className="size-4">
        <ChevronRight />
      </span>
    </div>
  );
};

const ContextMenuSubContent = ({ children }: { children: ReactNode }) => {
  const { clientPosition } = useContextMenu();
  const { subRect, openSub, animate } = useContextMenuSub();

  if (!openSub || !subRect || !clientPosition) return null;

  return createPortal(
    <div
      data-contextsub="popup"
      data-state={!animate}
      className={cn(
        "rounded-ui-content focus:ring-0 border flex-col p-ui-content min-w-64 fixed z-50 bg-ui-background",
        "data-[state='true']:animate-in data-[state='false']:animate-out data-[state='true']:fade-in data-[state='false']:fade-out data-[state='true']:slide-in-from-right-4 data-[state='false']:slide-out-to-right-4",
      )}
      style={{
        left: subRect.width + 4,
        top: subRect.top - clientPosition.clientY,
      }}
      onMouseEnter={() => {
        // Keep the submenu open when the mouse enters it
      }}
    >
      {children}
    </div>,
    document.querySelector('[data-context="popup"]') as HTMLElement,
  );
};

ContextMenuSub.Trigger = ContextMenuSubTrigger;
ContextMenuSub.Content = ContextMenuSubContent;
