import {
  createContext,
  Dispatch,
  KeyboardEventHandler,
  ReactNode,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils.ts";
import { IoIosSearch } from "react-icons/io";
import Primitive, {
  PrimitiveItemProps,
  usePrimitiveContext,
} from "@/components/ui/primitives/primitive.tsx";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";

type CommandContextType = {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  isSearching: boolean;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
};

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

  const ref = useRef<HTMLDivElement | null>(null);

  useOutsideClick(ref, () => {
    setIsSearching(false);
  });

  return (
    <Primitive>
      <CommandContext.Provider
        value={{
          inputValue,
          setInputValue,
          isSearching,
          setIsSearching,
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

  return (
    <div
      command-input-wrapper=""
      className={cn(
        "px-3 w-full flex items-center gap-2 h-10 border-b",
        className,
      )}
    >
      <span className="size-4 text-gray-alpha-600">
        <IoIosSearch />
      </span>
      <span>
        <input
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
      className={cn("p-1", className)}
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
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <Primitive.Group ref={ref} command-group="" className={cn(className)}>
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

Command.Group = CommandGroup;
Command.Label = CommandLabel;
Command.Separator = Primitive.Separator;

Command.Input = CommandInput;
Command.Content = CommandContent;
Command.Item = CommandItem;
