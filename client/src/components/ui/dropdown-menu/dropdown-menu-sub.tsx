import React, {
  createContext,
  CSSProperties,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDropdownMenu } from "./dropdown-menu.tsx";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils.ts";
import { ChevronRight } from "lucide-react";
import { navigateItems } from "@/utils/navigateItems.ts";
import { ANIMATION_TIMEOUT } from "@/components/ui/parameters.ts";

interface DropdownMenuSubContext {
  openSub: boolean;
  handleOpenSub: (element: HTMLElement, withKey?: boolean) => void;
  handleCloseSub: () => void;
  subRect: DOMRect | null;
  setSubRect: Dispatch<SetStateAction<DOMRect | null>>;
  animate: boolean;
  currentMenuItem: number | undefined;
  setCurrentMenuItem: Dispatch<SetStateAction<number | undefined>>;
  activeTrigger: HTMLElement | null;
}

const DropdownMenuSubContext = createContext<DropdownMenuSubContext | null>(
  null,
);

export const useDropdownMenuSub = () => {
  const context = useContext(DropdownMenuSubContext);
  if (!context) throw new Error("Sub context is outside of the provider");
  return context;
};

export default function DropdownMenuSub({ children }: { children: ReactNode }) {
  const { open, handleHighlight } = useDropdownMenu();

  const [openSub, setOpenSub] = useState(false);
  const [subRect, setSubRect] = useState<DOMRect | null>(null);
  const [animate, setAnimate] = useState(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<number | undefined>(
    undefined,
  );
  const [activeTrigger, setActiveTrigger] = useState<HTMLElement | null>(null);
  const [openedWithKey, setOpenedWithKey] = useState(false);

  const handleOpenSub = (element: HTMLElement, withKey: boolean = false) => {
    setActiveTrigger(element as HTMLElement);
    if (!open) return;
    setAnimate(false);
    setOpenSub(true);
    setSubRect(element.getBoundingClientRect());
    if (withKey) {
      setOpenedWithKey(withKey);
    }
  };

  const handleCloseSub = () => {
    setAnimate(true);
    setTimeout(() => {
      setOpenSub(false);
      setAnimate(false);
      setCurrentMenuItem(undefined);
    }, ANIMATION_TIMEOUT);
  };

  useEffect(() => {
    if (openedWithKey) {
      const subPopup = document.querySelector('[data-dropdownsub="popup"]');
      if (subPopup) {
        handleHighlight(
          subPopup.querySelector('[role="menuitem"]') as HTMLElement,
        );
        setCurrentMenuItem(0);
      }
    }
  }, [openSub]);

  useEffect(() => {
    if (!open) {
      handleCloseSub();
    }
  }, [open]);

  return (
    <DropdownMenuSubContext.Provider
      value={{
        openSub,
        subRect,
        setSubRect,
        animate,
        handleOpenSub,
        handleCloseSub,
        currentMenuItem,
        setCurrentMenuItem,
        activeTrigger,
      }}
    >
      {children}
    </DropdownMenuSubContext.Provider>
  );
}

const DropdownMenuSubTrigger = ({
  children,
  className,
  inset = false,
  prefix,
}: {
  children: ReactNode;
  className?: string;
  inset?: boolean;
  prefix?: ReactNode;
}) => {
  const { isHighlighted, handleHighlight } = useDropdownMenu();
  const { openSub, handleOpenSub, handleCloseSub } = useDropdownMenuSub();

  const ref = useRef<HTMLDivElement | null>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!ref.current) return;
    if (!isHighlighted(event.currentTarget)) return;
    if (event.code === "ArrowRight" || event.code === "ArrowLeft") {
      event.preventDefault();
      const action: "open" | "close" =
        event.code === "ArrowLeft" ? "close" : "open";

      if (action === "open") {
        handleOpenSub(event.currentTarget, true);
      } else {
        handleCloseSub();
        handleHighlight(ref.current as HTMLElement);
      }
    }
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    handleHighlight(event.currentTarget);
    handleOpenSub(event.currentTarget);
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    handleHighlight(-1);
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (
      !relatedTarget ||
      !relatedTarget.closest('[data-dropdownsub="popup"]')
    ) {
      handleCloseSub();
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    handleHighlight(event.currentTarget);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    handleHighlight(-1);
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (
      !relatedTarget ||
      !relatedTarget.closest('[data-dropdownsub="popup"]')
    ) {
      handleCloseSub();
    }
  };

  return (
    <div
      tabIndex={-1}
      ref={ref}
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={openSub}
      data-state={openSub}
      data-highlighted={
        ref.current && isHighlighted(ref.current) ? "" : undefined
      }
      data-dropdownsub="trigger"
      className={cn(
        "text-foreground flex justify-start items-center rounded-ui-item w-full focus:ring-0 cursor-default transition-colors",
        "data-[highlighted]:bg-ui-item-background-hover data-[state='true']:bg-ui-item-background-hover data-[disabled]:text-ui-disabled-foreground data-[disabled]:select-none",
        {
          "gap-2": prefix,
          "p-ui-item-inset": inset,
          "p-ui-item": !inset,
        },
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {prefix && <span className="size-4">{prefix}</span>}
      {children}
      <span className="size-4 ml-auto">
        <ChevronRight />
      </span>
    </div>
  );
};

export const DropdownMenuSubContent = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { clientPosition, handleHighlight, handleClose } = useDropdownMenu();
  const {
    subRect,
    openSub,
    animate,
    handleCloseSub,
    currentMenuItem,
    setCurrentMenuItem,
    activeTrigger,
  } = useDropdownMenuSub();
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});

  const ref = useRef<HTMLDivElement | null>(null);

  const handleMouseLeave = (event: React.MouseEvent<HTMLElement>) => {
    const relatedTarget = document.elementFromPoint(
      event.clientX,
      event.clientY,
    ) as HTMLElement | null;

    if (
      !relatedTarget ||
      relatedTarget.closest('[data-dropdownsub="trigger"]') !== activeTrigger
    ) {
      handleCloseSub();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    navigateItems({
      event,
      itemSelector: '[role="menuitem"]:not([data-disabled])',
      currentMenuItem,
      setCurrentMenuItem,
      handleClose,
      handleHighlight,
      root: (event.target as HTMLElement).closest('[data-dropdownsub="popup"]'),
    });

    if (event.code === "ArrowLeft") {
      event.preventDefault();
      handleCloseSub();
      const mainPopup = event.currentTarget.closest('[role="menu"]');
      if (!mainPopup) return false;
      handleHighlight(activeTrigger as HTMLElement);
    }
  };

  useEffect(() => {
    if (!ref.current || !openSub || !subRect) return;

    const updatePosition = () => {
      const newMenuStyle: CSSProperties = {};
      const parentMenu = document.querySelector(
        '[data-dropdown="popup"]',
      ) as HTMLElement;
      const parentRect = parentMenu.getBoundingClientRect();

      const isEnoughSpaceRight =
        window.innerWidth - (parentRect.width + parentRect.left) >
        ref.current!.offsetWidth;
      const isEnoughSpaceBelow =
        window.innerHeight - subRect.top > ref.current!.offsetHeight;

      if (isEnoughSpaceRight) newMenuStyle.left = `${parentRect.width - 6}px`;
      else newMenuStyle.right = `${parentRect.width - 6}px`;

      if (isEnoughSpaceBelow)
        newMenuStyle.top = `${Math.abs(subRect.top - parentRect.top) - 4}px`;
      else newMenuStyle.bottom = `${window.innerHeight - subRect.bottom}px`;

      setMenuStyle(newMenuStyle);
    };

    updatePosition();
  }, [openSub, subRect]);

  if (!openSub || !subRect || !clientPosition) return null;

  return createPortal(
    <div
      tabIndex={-1}
      ref={ref}
      data-dropdownsub="popup"
      data-state={!animate}
      className={cn(
        "rounded-ui-content focus:ring-0 border flex-col p-ui-content min-w-40 fixed z-50 bg-ui-background",
        "data-[state='true']:animate-in data-[state='false']:animate-out data-[state='true']:fade-in data-[state='false']:fade-out data-[state='true']:slide-in-from-right-4 data-[state='false']:slide-out-to-right-4",
      )}
      style={menuStyle}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>,
    document.querySelector('[data-dropdown="popup"]') as HTMLElement,
  );
};

DropdownMenuSub.Trigger = DropdownMenuSubTrigger;
DropdownMenuSub.Content = DropdownMenuSubContent;
