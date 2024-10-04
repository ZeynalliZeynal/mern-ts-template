import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { useContextMenu } from "@/components/ui/context-menu.tsx";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils.ts";
import { ChevronRight } from "lucide-react";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";

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
  const { openSub, handleOpenSub, handleCloseSub, setSubRect } =
    useContextMenuSub();

  const [highlighted, setHighlighted] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useOutsideClick(ref, handleCloseSub);

  return (
    <div
      tabIndex={-1}
      ref={ref}
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={openSub}
      data-state={openSub}
      data-highlighted={highlighted ? true : undefined}
      className={cn(
        "text-foreground flex justify-between items-center rounded-ui-item p-ui-item w-full focus:ring-0 cursor-default transition-colors",
        "data-[highlighted]:bg-ui-item-background-hover data-[disabled]:text-ui-disabled-foreground data-[disabled]:select-none",
        className,
      )}
      onMouseEnter={(event) => {
        handleOpenSub();
        setHighlighted(true);
        setSubRect(event.currentTarget.getBoundingClientRect());
      }}
      onMouseLeave={() => {
        handleCloseSub();
        setHighlighted(false);
      }}
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
  const { subRect, animate } = useContextMenuSub();

  if (!open || !subRect || !clientPosition) return null;

  return createPortal(
    <div
      data-context="popup"
      data-state={!animate}
      className={cn(
        "rounded-ui-content focus:ring-0 border flex-col p-ui-content min-w-64 fixed z-50 bg-ui-background",
        "data-[state='true']:animate-in data-[state='false']:animate-out data-[state='true']:zoom-in data-[state='false']:zoom-out",
      )}
      style={{
        left: subRect.width + 4,
        top: subRect.top - clientPosition.clientY,
      }}
    >
      {children}
    </div>,
    document.querySelector('[data-context="popup"]') as HTMLElement,
  );
};

ContextMenuSub.Trigger = ContextMenuSubTrigger;
ContextMenuSub.Content = ContextMenuSubContent;
