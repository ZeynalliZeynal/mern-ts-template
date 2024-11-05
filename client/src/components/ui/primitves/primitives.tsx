import React, {
  AriaRole,
  cloneElement,
  createContext,
  CSSProperties,
  Dispatch,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils.ts";
import { useNavigate } from "react-router-dom";

export type MenuTypes = "popover" | "dropdown" | "context" | "dialog";

export type PrimitiveWrapperProps = {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  tabIndex?: number;
  role?: AriaRole;
};

type PrimitiveContextProps = {
  highlightItem: (value: HTMLElement | number) => void;
  isHighlighted: (currentElement: HTMLElement) => boolean;
  currentMenuItem: number | undefined;
  setCurrentMenuItem: Dispatch<SetStateAction<number | undefined>>;
  menuType?: MenuTypes;
};

export type PrimitiveItemProps = {
  children: ReactNode | ReactElement;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
  asChild?: boolean;
  disabled?: boolean;
  className?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  inset?: boolean;
  href?: string;
  shortcut?: ReactNode;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
};

const PrimitiveContext = createContext<PrimitiveContextProps | null>(null);

export const usePrimitiveContext = () => {
  const context = useContext(PrimitiveContext);
  if (!context)
    throw new Error("Primitive component is outside of the provider");
  return context;
};

export default function Primitive({
  children,
  menuType,
}: {
  children: ReactNode;
  menuType?: MenuTypes;
}) {
  const [highlighted, setHighlighted] = useState<number | undefined>(-1);
  const [currentMenuItem, setCurrentMenuItem] = useState<number | undefined>(
    undefined,
  );

  const findMenuItem = (currentElement: HTMLElement) => {
    const root = currentElement?.closest("[primitive-collection-wrapper]");
    if (!root) return;

    const menuItems = Array.from(
      root.querySelectorAll("[primitive-collection-item]:not([data-disabled])"),
    );

    return menuItems.indexOf(currentElement);
  };

  const highlightItem = (value: HTMLElement | number) => {
    if (typeof value === "number") setHighlighted(value);
    else {
      const currentIndex = findMenuItem(value);
      setCurrentMenuItem(currentIndex);
      setHighlighted(currentIndex);
      value?.focus();
    }
  };

  const isHighlighted = (currentElement: HTMLElement) =>
    highlighted === findMenuItem(currentElement);

  return (
    <PrimitiveContext.Provider
      value={{
        highlightItem,
        isHighlighted,
        currentMenuItem,
        setCurrentMenuItem,
        menuType,
      }}
    >
      {children}
    </PrimitiveContext.Provider>
  );
}

const PrimitiveItem = forwardRef<HTMLDivElement, PrimitiveItemProps>(
  (
    {
      children,
      href,
      shortcut,
      inset,
      disabled = false,
      className,
      asChild = false,
      suffix,
      prefix,
      onClick,
      ...etc
    },
    forwardRef,
  ) => {
    const { highlightItem, isHighlighted, menuType } = usePrimitiveContext();

    const navigate = useNavigate();

    const ref = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(forwardRef, () => ref.current as HTMLDivElement);

    const handleMouseEnter: MouseEventHandler<HTMLDivElement> = (event) => {
      event.preventDefault();
      highlightItem(event.currentTarget);
    };

    const handleClick = (
      event:
        | React.MouseEvent<HTMLDivElement>
        | React.KeyboardEvent<HTMLDivElement>,
    ) => {
      event.preventDefault();
      if (disabled) return;
      onClick?.(event as React.MouseEvent<HTMLDivElement>);
    };

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
      if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();
        if (href) {
          navigate(href);
        } else {
          handleClick(event);
        }
      }
    };

    const handleMouseLeave = () => {
      if (menuType !== "popover") {
        highlightItem(-1);
      }
    };

    const commonAttributes = {
      ref,
      tabIndex: -1,
      "primitive-collection-item": "",
      "data-highlighted":
        ref.current && isHighlighted(ref.current) && !disabled ? true : null,
      "data-disabled": disabled ? "" : null,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onKeyDown: handleKeyDown,
      onClick,
      ...etc,
    };

    return asChild && isValidElement(children) ? (
      cloneElement(children, commonAttributes)
    ) : (
      <div
        {...(commonAttributes as HTMLAttributes<HTMLDivElement>)}
        className={cn(
          "text-foreground flex items-center justify-start rounded-ui-item w-full focus:ring-0 cursor-default transition-colors",
          "data-[highlighted]:bg-ui-item-background-hover data-[disabled]:text-ui-disabled-foreground data-[disabled]:pointer-events-none data-[disabled]:select-none",
          {
            "cursor-pointer": href && menuType !== "popover",
            "gap-2": prefix,
            "p-ui-item-inset": inset && menuType !== "popover",
            "p-ui-item": !inset,
          },
          className,
        )}
      >
        {prefix}
        {children}
        {(shortcut || suffix) && (
          <div className="ml-auto flex items-center gap-1">
            {suffix}
            {shortcut && (
              <span className="text-xs opacity-60 tracking-widest">
                {shortcut}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);

const PrimitiveWrapper = forwardRef<HTMLDivElement, PrimitiveWrapperProps>(
  (
    { children, style, className, onKeyDown, tabIndex, role, ...etc },
    forwardRef,
  ) => {
    const { highlightItem, currentMenuItem } = usePrimitiveContext();

    const ref = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(forwardRef, () => ref.current as HTMLDivElement);

    const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
      onKeyDown?.(event);
      if (!ref.current) return false;

      if (event.code === "ArrowUp" || event.code === "ArrowDown") {
        event.preventDefault();
        const direction = event.code === "ArrowUp" ? "previous" : "next";

        const menuItems = Array.from(
          ref.current.querySelectorAll(
            "[primitive-collection-item]:not([data-disabled])",
          ),
        );

        let nextIndex;
        if (direction === "next") {
          nextIndex =
            currentMenuItem === undefined
              ? 0
              : (currentMenuItem + 1) % menuItems.length;
        } else {
          nextIndex =
            currentMenuItem === undefined
              ? 0
              : (currentMenuItem - 1 + menuItems.length) % menuItems.length;
        }
        highlightItem(menuItems[nextIndex] as HTMLElement);
      }
    };

    return (
      <div
        ref={ref}
        tabIndex={tabIndex}
        role={role}
        primitive-collection-wrapper=""
        className={cn(className)}
        style={style}
        onKeyDown={handleKeyDown}
        {...etc}
      >
        {children}
      </div>
    );
  },
);

const PrimitiveGroup = ({
  children,
  className,
  ...etc
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div role="group" className={cn(className)} {...etc}>
      {children}
    </div>
  );
};

const PrimitiveSeparator = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className, ...etc }, forwardRef) => {
    const ref = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(forwardRef, () => ref.current as HTMLDivElement);
    return (
      <div
        ref={ref}
        role="separator"
        {...etc}
        className={cn("h-px -mx-ui-content my-ui-content bg-border", className)}
      />
    );
  },
);

const PrimitiveLabel = forwardRef<
  HTMLDivElement,
  {
    children: ReactNode;
    className?: string;
    inset?: boolean;
    prefix?: ReactNode;
    suffix?: ReactNode;
  }
>(
  (
    { children, className, inset = false, suffix, prefix, ...etc },
    forwardRef,
  ) => {
    const ref = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(forwardRef, () => ref.current as HTMLDivElement);

    return (
      <div
        ref={ref}
        tabIndex={-1}
        {...etc}
        className={cn(
          "text-foreground font-semibold flex items-center w-full",
          {
            "justify-between": suffix,
            "gap-2": prefix,
            "p-ui-item-inset": inset,
            "p-ui-item": !inset,
          },
          className,
        )}
      >
        {prefix && <span className="size-4">{prefix}</span>}
        {children}
        {suffix && <span className="size-4">{suffix}</span>}
      </div>
    );
  },
);

Primitive.Label = PrimitiveLabel;
Primitive.Group = PrimitiveGroup;
Primitive.Separator = PrimitiveSeparator;
Primitive.Item = PrimitiveItem;
Primitive.Wrapper = PrimitiveWrapper;
