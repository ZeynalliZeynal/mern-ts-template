import React, {
  cloneElement,
  createContext,
  CSSProperties,
  Dispatch,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils.ts";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";
import { useResize } from "@/hooks/useResize.ts";
import { MenuTriggerProps } from "@/components/ui/types.ts";
import { PiCaretUpDownBold } from "react-icons/pi";
import { ANIMATION_TIMEOUT } from "@/components/ui/parameters.ts";
import { useRestrictBody } from "@/hooks/useRestrictBody.ts";
import Primitive, {
  MenuTypes,
  PrimitiveItemProps,
  PrimitiveWrapperProps,
  usePrimitiveContext,
} from "@/components/ui/primitives.tsx";
import Button from "@/components/ui/button.tsx";

interface PopperWrapperProps {
  children: ReactNode;
  align?: "center" | "left" | "right";
  width?: "fit" | "default";
  className?: string;
  asChild?: boolean;
}

export type PopperItemProps = {
  value?: string;
  onSelect?: (currentValue: string) => void;
  defaultValue?: string;
  valueRemovable?: boolean;
} & PrimitiveItemProps;

type PopperContextProps = {
  openPopper: (element: HTMLElement) => void;
  triggerPosition: DOMRect | null;
  setTriggerPosition: Dispatch<SetStateAction<DOMRect | null>>;
  open: boolean;
  closePopper: () => void;
  animate: boolean;
  selectedValue: string;
  selectValue: (value: string) => void;
  menuType: MenuTypes;
};

const PopperContext = createContext<PopperContextProps | null>(null);

export const usePopperContext = () => {
  const context = useContext(PopperContext);
  if (!context) throw new Error("Component is outside of the provider");
  return context;
};

export default function Popper({
  children,
  menuType,
  defaultValue,
}: {
  children: ReactNode;
  menuType: MenuTypes;
  defaultValue?: string;
}) {
  const [open, setOpen] = useState(false);
  const [triggerPosition, setTriggerPosition] = useState<DOMRect | null>(null);
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");
  const [activeTrigger, setActiveTrigger] = useState<HTMLElement | null>(null);

  const [animate, setAnimate] = useState(false);

  function selectValue(value: string) {
    setSelectedValue(value);
  }

  function openPopper(element: HTMLElement) {
    setAnimate(false);
    setOpen(true);
    setTriggerPosition(element.getBoundingClientRect());
    setActiveTrigger(element as HTMLElement);
  }

  function closePopper() {
    setAnimate(true);
    setTimeout(() => {
      setOpen(false);
      setAnimate(false);

      const triggers = Array.from(
        document.querySelectorAll("[popper-trigger]"),
      ) as HTMLElement[];
      const findActive = triggers.indexOf(activeTrigger as HTMLElement);
      triggers[findActive].focus();
    }, ANIMATION_TIMEOUT);
    setActiveTrigger(null);
  }

  useRestrictBody(open);

  return (
    <Primitive menuType="popover">
      <PopperContext.Provider
        value={{
          open,
          openPopper,
          closePopper,
          animate,
          triggerPosition,
          setTriggerPosition,
          selectedValue,
          selectValue,
          menuType,
        }}
      >
        {children}
      </PopperContext.Provider>
    </Primitive>
  );
}

function PopperWrapper({
  children,
  align = "center",
  width = "default",
  className,
  asChild,
  ...etc
}: PopperWrapperProps) {
  const { open, triggerPosition, menuType } = usePopperContext();
  const { highlightItem } = usePrimitiveContext();
  const [style, setStyle] = useState<CSSProperties>({});

  const ref = useRef<HTMLDivElement | null>(null);

  function updateMenuPosition() {
    if (!ref.current || !open || !triggerPosition || menuType === "dialog")
      return;

    const spaceLeftBottom = window.innerHeight - triggerPosition.bottom;

    // const canFitRight = spaceLeftRight > ref.current.clientWidth;
    const canFitBottom = spaceLeftBottom > ref.current.clientHeight;

    const centerX = triggerPosition.left + triggerPosition.width / 2;
    // const centerY = triggerPosition.top + triggerPosition.height / 2;

    let left = undefined;
    if (width === "fit") {
      left = triggerPosition.left;
    } else {
      switch (align) {
        case "center":
          left = Math.max(0, centerX - ref.current.clientWidth / 2);
          break;
        case "left":
          left = triggerPosition.left;
          break;
        case "right":
          left = triggerPosition.right - ref.current.offsetWidth;
          break;
      }
    }

    setStyle({
      top: canFitBottom
        ? triggerPosition.top + triggerPosition.height + 8
        : undefined,
      bottom: !canFitBottom
        ? spaceLeftBottom + triggerPosition.height + 8
        : undefined,
      left,
    });
  }

  useResize(open, updateMenuPosition, triggerPosition);

  useEffect(() => {
    if (!ref.current) return;
    if (menuType === "popover") {
      const firstItem = ref.current.querySelector(
        "[primitive-collection-item]",
      );
      highlightItem(firstItem as HTMLElement);
    }
  }, []);

  if (!triggerPosition) return null;

  return (
    <PopupWrapper
      ref={ref}
      popper-content-menu=""
      primitive-collection=""
      role="menu"
      className={cn(
        "rounded-ui-content focus:ring-0 border flex-col p-ui-content bg-ui-background",
        className,
      )}
      style={{
        ...style,
        width: width === "fit" ? triggerPosition.width : undefined,
      }}
      {...etc}
    >
      {children}
    </PopupWrapper>
  );
}

const PopupWrapper = forwardRef<HTMLDivElement, PrimitiveWrapperProps>(
  (
    { children, className, style, role, tabIndex, onKeyDown, ...etc },
    forwardRef,
  ) => {
    const { open, animate, closePopper } = usePopperContext();

    const ref = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(forwardRef, () => ref.current as HTMLDivElement);

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      if (!ref.current) return;
      if (event.code === "Escape") {
        event.preventDefault();
        closePopper();
      }
    }

    useOutsideClick(ref, closePopper);

    useEffect(() => {
      if (!open || !ref.current) return;
      ref.current.focus();
    }, [open]);

    if (!open) return null;

    return createPortal(
      <Primitive.Wrapper
        tabIndex={-1}
        ref={ref}
        role={role}
        data-state={!animate ? "open" : "closed"}
        className={cn(
          "fixed z-50 pointer-events-auto focus:ring-0 duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          className,
        )}
        style={style}
        onKeyDown={handleKeyDown}
        {...etc}
      >
        {children}
      </Primitive.Wrapper>,
      document.body,
    );
  },
);

const PopupOverlay = ({ className }: { className?: string }) => {
  const { open, animate } = usePopperContext();

  if (!open) return null;
  return createPortal(
    <div
      data-state={!animate ? "open" : "closed"}
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm duration-200",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className,
      )}
    />,
    document.body,
  );
};

const PopperTrigger = forwardRef<HTMLElement, MenuTriggerProps>(
  ({ children, prefix, suffix, className, asChild }, forwardRef) => {
    const { open, openPopper, setTriggerPosition, menuType } =
      usePopperContext();
    const [isHovering, setIsHovering] = useState(false);

    const ref = useRef<HTMLButtonElement | null>(null);
    useImperativeHandle(forwardRef, () => ref.current as HTMLElement);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      event.preventDefault();
      openPopper(event.currentTarget);
    };

    useResize(open, () => {
      if (!ref.current) return;
      setTriggerPosition(ref.current.getBoundingClientRect());
    });

    const commonAttributes = {
      ref,
      "popper-trigger": "",
      role: "combobox",
      type: "button",
      "aria-expanded": open,
      "data-state": open ? "open" : "close",
      onClick: handleClick,
    };

    return asChild && isValidElement(children) ? (
      cloneElement(children, commonAttributes)
    ) : menuType === "popover" ? (
      <button
        {...(commonAttributes as HTMLAttributes<HTMLButtonElement>)}
        className={cn(
          "h-7 px-3 rounded-md border text-foreground flex items-center justify-between gap-1.5 transition",
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
    ) : (
      <Button
        {...(commonAttributes as HTMLAttributes<HTMLButtonElement>)}
        primary
        prefix={prefix}
        suffix={suffix}
        size="sm"
        className={cn(className)}
      >
        {children}
      </Button>
    );
  },
);

const PopperItem = forwardRef<HTMLDivElement, PopperItemProps>(
  (
    {
      children,
      href,
      shortcut,
      onClick,
      inset,
      disabled = false,
      className,
      asChild = false,
      suffix,
      prefix,
      value,
      onSelect,
      valueRemovable,
    },
    forwardRef,
  ) => {
    const { closePopper, selectedValue, selectValue, menuType } =
      usePopperContext();
    const ref = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(forwardRef, () => ref.current as HTMLDivElement);

    const clickAction = () => {
      if (disabled) return false;

      if (onSelect && value) {
        if (selectedValue !== value) {
          onSelect(value);
          selectValue(value);
        } else if (selectedValue === value && valueRemovable) {
          onSelect("");
          selectValue("");
        }
        closePopper();
      }
    };

    const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
      event.preventDefault();
      clickAction();
      onClick?.(event);
    };

    const popoverAttributes = {
      "aria-selected": selectedValue === value,
      "data-selected": selectedValue === value,
    };

    return (
      <Primitive.Item
        popper-collection-item=""
        href={href}
        className={cn(className)}
        suffix={suffix}
        prefix={prefix}
        disabled={disabled}
        asChild={asChild}
        inset={inset}
        shortcut={shortcut}
        onClick={handleClick}
        {...(menuType === "popover" && popoverAttributes)}
      >
        {children}
      </Primitive.Item>
    );
  },
);

Popper.Dialog = PopupWrapper;
Popper.Overlay = PopupOverlay;
Popper.Label = Primitive.Label;
Popper.Group = Primitive.Group;
Popper.Separator = Primitive.Separator;
Popper.Item = PopperItem;
Popper.Trigger = PopperTrigger;
Popper.Wrapper = PopperWrapper;
