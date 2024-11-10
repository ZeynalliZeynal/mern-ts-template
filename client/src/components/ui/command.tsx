import React, {
  createContext,
  Dispatch,
  forwardRef,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils.ts";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";
import { PopperItemProps } from "@/types/ui/popper.ts";
import { useNavigate } from "react-router-dom";
import { navigateItems } from "@/utils/navigateItems.ts";
import { ImSearch } from "react-icons/im";

type CommandContextType = {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  isSearching: boolean;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  noResult: boolean;
  isHighlighted: (element: HTMLElement) => boolean;
  highlightItem: (element?: HTMLElement) => void;
  currentItemIndex: number | undefined;
  setCurrentItemIndex: Dispatch<SetStateAction<number | undefined>>;
  highlightedItem: HTMLElement | undefined;
  selectValue?: (value: string, onSelect: (value: string) => void) => void;
  selectedValue?: string;
  closePopper?: () => void;
};

export const COMMAND_GROUP_SELECTOR = "[command-group]";
export const COMMAND_ITEM_SELECTOR = "[command-item]:not([data-disabled])";
export const COMMAND_ROOT_SELECTOR = "[command-root]";
const COMMAND_SEPARATOR_SELECTOR = "[command-separator]";
// const COMMAND_CONTENT_SELECTOR = "[command-content]";
export const COMMAND_INPUT_SELECTOR = "[command-input]";

const CommandContext = createContext<CommandContextType | null>(null);

const getElements = (element?: HTMLElement) => {
  const root = element?.closest(COMMAND_ROOT_SELECTOR);
  if (!root) return [];
  return Array.from(
    root.querySelectorAll(COMMAND_ITEM_SELECTOR),
  ) as HTMLElement[];
};

const useCommand = () => {
  const context = useContext(CommandContext);
  if (!context) throw new Error("Component is outside of the provider");
  return context;
};

export default function Command({
  children,
  className,
  valueRemovable,
  value,
}: {
  children: ReactNode;
  className?: string;
  valueRemovable?: boolean;
  value?: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | undefined>(
    -1,
  );
  const [highlightedItem, setHighlightedItem] = useState<
    HTMLElement | undefined
  >(undefined);

  const ref = useOutsideClick({
    onTrigger: () => {
      setIsSearching(false);
      setInputValue("");
    },
  });

  const selectValue = (value: string, onSelect: (value: string) => void) => {
    if (selectedValue !== value) {
      onSelect(value);
      setSelectedValue(value);
    } else if (selectedValue === value && valueRemovable) {
      onSelect("");
      setSelectedValue("");
    }
  };

  const highlightItem = (element?: HTMLElement) => {
    const elements = getElements(element);
    if (element) {
      setCurrentItemIndex(elements.indexOf(element));
      setHighlightedItem(element);
    } else {
      setCurrentItemIndex(undefined);
      setHighlightedItem(undefined);
    }
  };

  const isHighlighted = (element: HTMLElement) => {
    return highlightedItem === element;
  };

  useEffect(() => {
    if (!ref.current) return;
    const groups = [
      ...document.querySelectorAll(COMMAND_GROUP_SELECTOR),
    ] as HTMLElement[];

    const separators = [
      ...document.querySelectorAll(COMMAND_SEPARATOR_SELECTOR),
    ] as HTMLElement[];

    groups.forEach((group) => {
      if (!group.querySelector("[command-item]")) {
        group.style.display = "none";
      } else {
        group.style.display = "block";
      }
    });

    separators.forEach((separator) => {
      if (
        (separator.nextElementSibling &&
          !separator.nextElementSibling.querySelector("[command-item]")) ||
        (separator.previousElementSibling &&
          !separator.previousElementSibling.querySelector("[command-item]"))
      ) {
        separator.style.display = "none";
      } else {
        separator.style.display = "block";
      }
    });

    if (!ref.current.querySelector(COMMAND_ITEM_SELECTOR)) {
      setNoResult(true);
    } else {
      setNoResult(false);
    }
  }, [inputValue, ref]);

  console.log(selectedValue);

  return (
    <CommandContext.Provider
      value={{
        inputValue,
        setInputValue,
        isSearching,
        setIsSearching,
        noResult,
        highlightedItem,
        highlightItem,
        isHighlighted,
        currentItemIndex,
        setCurrentItemIndex,
        selectedValue,
        selectValue,
      }}
    >
      <div ref={ref} command-root="" className={cn("", className)}>
        {children}
      </div>
    </CommandContext.Provider>
  );
}

const CommandInput = ({
  className,
  placeholder,
  disableFocusShortcut,
}: {
  className?: string;
  placeholder: string;
  disableFocusShortcut?: boolean;
}) => {
  const {
    inputValue,
    setInputValue,
    setIsSearching,
    highlightItem,
    currentItemIndex,
    setCurrentItemIndex,
    highlightedItem,
  } = useCommand();

  const ref = useRef<HTMLInputElement | null>(null);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const root = event.currentTarget.closest("[command-root]") as HTMLElement;
      if (!root) return;
      if (event.code === "Tab" && root.closest("[data-portal]")) {
        event.preventDefault();
      }
      if (
        (event.code === "Enter" || event.code === "Space") &&
        highlightedItem
      ) {
        highlightedItem.click();
      }
      navigateItems({
        event,
        root,
        highlightItem,
        currentItemIndex,
        setCurrentItemIndex,
        itemSelector: COMMAND_ITEM_SELECTOR,
      });
    },
    [currentItemIndex, highlightItem, highlightedItem, setCurrentItemIndex],
  );

  useEffect(() => {
    if (!ref.current || disableFocusShortcut) return;
    function focusOnKeyDown(event: KeyboardEvent) {
      if (!ref.current) return;
      if (event.ctrlKey && (event.code === "KeyK" || event.code === "Keyk")) {
        event.preventDefault();
        (
          document.querySelector(COMMAND_INPUT_SELECTOR) as HTMLInputElement
        ).focus();
      }
    }

    document.addEventListener("keydown", focusOnKeyDown);
    return () => {
      document.removeEventListener("keydown", focusOnKeyDown);
    };
  }, [disableFocusShortcut]);

  return (
    <div
      command-input-wrapper=""
      className={cn(
        "relative px-3 w-full flex items-center gap-2 h-10 border-b group",
        className,
      )}
    >
      <span className="size-4 text-gray-alpha-600" aria-hidden="true">
        <ImSearch />
      </span>
      <span className="flex-grow relative z-[1]">
        <input
          ref={ref}
          command-input=""
          type="text"
          className="placeholder:font-medium placeholder:text-gray-900 text-sm py-3"
          placeholder={placeholder}
          value={inputValue}
          onChange={({ target }) => {
            setInputValue(target.value);
            setIsSearching(true);
          }}
          onKeyDown={handleKeyDown}
        />
      </span>
      {!disableFocusShortcut && (
        <span
          aria-hidden="true"
          className="absolute group-focus-within:opacity-0 opacity-100 transition right-3 top-1/2 -translate-y-1/2 text-xs rounded px-2 py-1 bg-gray-200 text-gray-900 select-none"
        >
          ⌘+K
        </span>
      )}
    </div>
  );
};

const CommandContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      command-content=""
      role="listbox"
      className={cn("bg-ui-background rounded-ui-content", className)}
    >
      {children}
    </div>
  );
};

const CommandItem = forwardRef<HTMLElement, PopperItemProps>(
  (
    {
      children,
      className,
      asChild,
      onClick,
      inset,
      disabled,
      prefix,
      suffix,
      shortcut,
      href,
      value,
      onSelect,
    },
    forwardRef,
  ) => {
    const {
      highlightItem,
      isHighlighted,
      inputValue,
      isSearching,
      selectValue,
      selectedValue,
    } = useCommand();
    const ref = useRef<HTMLElement | null>(null);

    const navigate = useNavigate();

    useImperativeHandle(forwardRef, () => ref.current as HTMLElement);

    const handleMouseEnter: MouseEventHandler<HTMLElement> = (event) => {
      event.preventDefault();
      highlightItem(event.currentTarget);
    };

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
      event.preventDefault();
      if (disabled) return;

      if (href) navigate(href);
      else if (onClick) onClick(event);
      else if (onSelect && value && selectValue) {
        selectValue(value, onSelect);
      }
    };

    const attributes = {
      ref,
      "command-item": "",
      tabIndex: -1,
      role: "option",
      "aria-selected": selectedValue === value,
      "data-selected": selectedValue === value,
      "data-highlighted":
        ref.current && isHighlighted(ref.current) ? "" : undefined,
      "aria-disabled": disabled,
      "data-disabled": disabled ? "" : undefined,
      onMouseEnter: handleMouseEnter,
    };

    if (typeof children === "string") {
      const isFound = children
        .toLowerCase()
        .includes(inputValue.toLowerCase().trim());
      if (!isFound && isSearching) return null;
    }

    return asChild && React.isValidElement(children) ? (
      React.cloneElement(children, attributes)
    ) : (
      <button
        onClick={handleClick}
        {...(attributes as React.HTMLAttributes<HTMLButtonElement>)}
        className={cn(
          "text-foreground flex items-center justify-start rounded-ui-item w-full focus:ring-0 cursor-default transition-colors",
          "data-[highlighted]:bg-ui-item-background-hover data-[disabled]:text-ui-disabled-foreground data-[disabled]:pointer-events-none data-[disabled]:select-none",
          {
            "cursor-pointer": href,
            "gap-2": prefix,
            "p-ui-item-inset": inset && !prefix,
            "p-ui-item": !inset || prefix,
          },
          className,
        )}
      >
        {prefix}
        {children}
        {(shortcut || suffix) && (
          <div className="ml-auto flex items-center gap-1 font-geist">
            {suffix}
            {shortcut && (
              <span className="text-xs opacity-60 tracking-widest">
                {shortcut}
              </span>
            )}
          </div>
        )}
      </button>
    );
  },
);

const CommandEmpty = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { noResult } = useCommand();
  if (noResult)
    return (
      <div
        command-empty=""
        className={cn("py-6 text-center w-full", className)}
      >
        {children}
      </div>
    );
};

const CommandGroup = ({
  children,
  className,
  heading,
}: {
  children: ReactNode;
  heading?: string;
  className?: string;
}) => {
  return (
    <div
      role="group"
      command-group=""
      data-value={heading}
      className={cn(className)}
    >
      {heading && <CommandLabel>{heading}</CommandLabel>}
      {children}
    </div>
  );
};

const CommandLabel = ({
  children,
  className,
  inset,
}: {
  children: ReactNode;
  className?: string;
  inset?: boolean;
}) => {
  return (
    <label
      tabIndex={-1}
      command-label=""
      className={cn(
        "text-foreground font-semibold flex items-center w-full",
        {
          "p-ui-item-inset": inset,
          "p-ui-item": !inset,
        },
        className,
      )}
    >
      {children}
    </label>
  );
};

const CommandSeparator = ({ className }: { className?: string }) => {
  return (
    <div
      command-separator=""
      role="separator"
      className={cn("h-px -mx-ui-content my-ui-content bg-border", className)}
    />
  );
};

Command.Group = CommandGroup;
Command.Label = CommandLabel;
Command.Separator = CommandSeparator;
Command.Empty = CommandEmpty;

Command.Input = CommandInput;
Command.Content = CommandContent;
Command.Item = CommandItem;
