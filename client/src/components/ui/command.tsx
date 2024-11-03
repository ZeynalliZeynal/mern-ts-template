import {
  createContext,
  Dispatch,
  KeyboardEventHandler,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils.ts";
import { IoIosSearch } from "react-icons/io";
import Primitive, {
  PrimitiveItemProps,
  usePrimitiveContext,
} from "@/components/ui/primitives.tsx";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";

type CommandContextType = {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  isSearching: boolean;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  noResult: boolean;
};

const GROUP_SELECTOR = "[command-group]";
const ITEM_SELECTOR = "[command-item]";
const SEPARATOR_SELECTOR = "[command-separator]";
// const LABEL_SELECTOR = '[command-label]'
const INPUT_SELECTOR = "[command-input]";

const CommandContext = createContext<CommandContextType | null>(null);

const useCommandContext = () => {
  const context = useContext(CommandContext);
  if (!context) throw new Error("Component is outside of the provider");
  return context;
};

export default function Command({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [noResult, setNoResult] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useOutsideClick(ref, () => {
    setIsSearching(false);
    setInputValue("");
  });

  useEffect(() => {
    if (!ref.current) return;
    const groups = [
      ...document.querySelectorAll(GROUP_SELECTOR),
    ] as HTMLElement[];

    const separators = [
      ...document.querySelectorAll(SEPARATOR_SELECTOR),
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

    if (!ref.current.querySelector(ITEM_SELECTOR)) {
      setNoResult(true);
    } else {
      setNoResult(false);
    }
  }, [inputValue]);

  return (
    <Primitive>
      <CommandContext.Provider
        value={{
          inputValue,
          setInputValue,
          isSearching,
          setIsSearching,
          noResult,
        }}
      >
        <div
          ref={ref}
          command-root=""
          className={cn("border rounded-ui-content", className)}
        >
          {children}
        </div>
      </CommandContext.Provider>
    </Primitive>
  );
}

const CommandInput = ({
  className,
  placeholder,
}: {
  className?: string;
  placeholder: string;
}) => {
  const { highlightItem } = usePrimitiveContext();
  const { inputValue, setInputValue, setIsSearching } = useCommandContext();

  const ref = useRef<HTMLInputElement | null>(null);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    const root = event.currentTarget.closest("[command-root]");
    if (!root) return;
    if (event.code === "ArrowDown" || event.code === "ArrowUp") {
      event.preventDefault();
      const isUp = event.code === "ArrowUp";
      const collectionItems = Array.from(
        root.querySelectorAll(
          "[primitive-collection-item]:not([data-disabled])",
        ),
      ) as HTMLElement[];
      if (isUp) {
        highlightItem(collectionItems.at(-1) as HTMLElement);
      } else {
        highlightItem(collectionItems.at(0) as HTMLElement);
      }
    }
  };

  useEffect(() => {
    function focusOnKeyDown(event: KeyboardEvent) {
      if (!ref.current) return;
      if (event.ctrlKey && (event.code === "KeyK" || event.code === "Keyk")) {
        event.preventDefault();
        (document.querySelector(INPUT_SELECTOR) as HTMLInputElement).focus();
      }
    }

    document.addEventListener("keydown", focusOnKeyDown);
    return () => {
      document.removeEventListener("keydown", focusOnKeyDown);
    };
  }, []);

  return (
    <div
      command-input-wrapper=""
      className={cn(
        "relative px-3 w-full flex items-center gap-2 h-10 border-b group",
        className,
      )}
    >
      <span className="size-4 text-gray-alpha-600" aria-hidden="true">
        <IoIosSearch />
      </span>
      <span className="flex-grow relative z-[1]">
        <input
          ref={ref}
          command-input=""
          type="text"
          className="placeholder:font-medium placeholder:text-gray-900 text-sm"
          placeholder={placeholder}
          value={inputValue}
          onChange={({ target }) => {
            setInputValue(target.value);
            setIsSearching(true);
          }}
          onKeyDown={handleKeyDown}
        />
      </span>
      <span
        aria-hidden="true"
        className="absolute group-focus-within:opacity-0 opacity-100 transition right-3 top-1/2 -translate-y-1/2 text-xs rounded px-2 py-1 bg-gray-200 text-gray-900 select-none"
      >
        ⌘+K
      </span>
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
    <Primitive.Wrapper
      command-content-wrapper=""
      className={cn("p-1 transition-[height]", className)}
    >
      {children}
    </Primitive.Wrapper>
  );
};

const CommandGroup = ({
  children,
  className,
  heading,
}: {
  children: ReactNode;
  heading: string;
  className?: string;
}) => {
  return (
    <Primitive.Group
      command-group=""
      data-value={heading}
      className={cn(className)}
    >
      <Command.Label>{heading}</Command.Label>
      {children}
    </Primitive.Group>
  );
};

const CommandItem = ({
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
}: PrimitiveItemProps) => {
  const { inputValue, isSearching } = useCommandContext();
  const ref = useRef<HTMLDivElement | null>(null);

  if (typeof children === "string") {
    const isFound = children
      .toLowerCase()
      .startsWith(inputValue.toLowerCase().trim());
    if (!isFound && isSearching) return null;
  }

  return (
    <Primitive.Item
      ref={ref}
      command-item=""
      className={className}
      asChild={asChild}
      onClick={onClick}
      inset={inset}
      disabled={disabled}
      prefix={prefix}
      suffix={suffix}
      shortcut={shortcut}
      href={href}
    >
      {children}
    </Primitive.Item>
  );
};

const CommandLabel = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Primitive.Label
      command-label=""
      className={cn("text-xs text-gray-700", className)}
    >
      {children}
    </Primitive.Label>
  );
};

const CommandSeparator = ({ className }: { className?: string }) => {
  return <Primitive.Separator command-separator="" className={className} />;
};

const CommandEmpty = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { noResult } = useCommandContext();
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

Command.Group = CommandGroup;
Command.Label = CommandLabel;
Command.Separator = CommandSeparator;
Command.Empty = CommandEmpty;

Command.Input = CommandInput;
Command.Content = CommandContent;
Command.Item = CommandItem;
