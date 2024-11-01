import {
  cloneElement,
  createContext,
  Dispatch,
  forwardRef,
  isValidElement,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils.ts";
import { PiCaretUpDownBold } from "react-icons/pi";
import { ANIMATION_TIMEOUT } from "@/components/ui/parameters.ts";
import { MenuContextProps, MenuTriggerProps } from "@/components/ui/types.ts";
import { useRestrictBody } from "@/hooks/useRestrictBody.ts";
import { PopperWrapper } from "@/components/ui/PopperPrimitives.tsx";

const PopoverContext = createContext<
  | ({
      handleOpen: (element: HTMLElement) => void;
      triggerPosition: DOMRect | null;
      setTriggerPosition: Dispatch<SetStateAction<DOMRect | null>>;
    } & MenuContextProps)
  | null
>(null);

const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("Popover is outside of the provider");
  return context;
};

export default function Popover({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [triggerPosition, setTriggerPosition] = useState<DOMRect | null>(null);

  const [animate, setAnimate] = useState(false);

  const handleOpen = (element: HTMLElement) => {
    setAnimate(false);
    setOpen(true);
    setTriggerPosition(element.getBoundingClientRect());
  };

  const handleClose = () => {
    setAnimate(true);
    setTimeout(() => {
      setOpen(false);
      setAnimate(false);
    }, ANIMATION_TIMEOUT);
  };

  useRestrictBody(open);
  console.log(triggerPosition);

  return (
    <PopoverContext.Provider
      value={{
        open,
        handleOpen,
        handleClose,
        animate,
        triggerPosition,
        setTriggerPosition,
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

const PopoverTrigger = forwardRef<HTMLElement, MenuTriggerProps>(
  ({ children, prefix, suffix, className, asChild }, forwardRef) => {
    const { open, handleOpen, setTriggerPosition, triggerPosition } =
      usePopoverContext();
    const [isHovering, setIsHovering] = useState(false);
    const ref = useRef<HTMLElement | null>(null);
    useImperativeHandle(forwardRef, () => ref.current as HTMLElement);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      event.preventDefault();
      handleOpen(event.currentTarget);
    };

    useEffect(() => {
      const updatePosition = () => {
        if (!open || !ref.current) return;
        console.log(ref.current.getBoundingClientRect());
        setTriggerPosition(ref.current.getBoundingClientRect());
      };

      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("resize", updatePosition);
      };
    }, [open]);

    const commonAttributes = {
      role: "combobox",
      type: "button",
      "aria-expanded": open,
      "data-state": open ? "open" : "close",
      onClick: handleClick,
    };

    return asChild && isValidElement(children) ? (
      cloneElement(children, commonAttributes)
    ) : (
      <button
        type="button"
        aria-expanded={open}
        data-state={open ? "open" : "close"}
        className={cn(
          "h-7 px-3 rounded-md border text-foreground flex items-center justify-between gap-1.5 text-xs transition",
          {
            "bg-ui-item-background-hover": isHovering,
          },
          className,
        )}
        onMouseEnter={() => {
          setIsHovering(true);
        }}
        onMouseLeave={() => {
          setIsHovering(false);
        }}
        onClick={handleClick}
      >
        {prefix && <span className="opacity-60">{prefix}</span>}
        {children}
        {suffix ? (
          suffix
        ) : (
          <span className="opacity-60 size-3">
            <PiCaretUpDownBold />
          </span>
        )}
      </button>
    );
  },
);

const PopoverContent = ({ children }: { children: ReactNode }) => {
  const { open, animate, handleClose, triggerPosition } = usePopoverContext();

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {};

  return (
    <PopperWrapper
      animate={animate}
      open={open}
      onClose={handleClose}
      triggerPosition={triggerPosition}
    >
      {children}
    </PopperWrapper>
  );
};

Popover.Trigger = PopoverTrigger;
Popover.Content = PopoverContent;
