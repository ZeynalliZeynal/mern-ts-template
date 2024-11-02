import { createContext, ReactNode, useContext } from "react";
import { cn } from "@/lib/utils.ts";
import { IoIosSearch } from "react-icons/io";
import Primitive, {
  PrimitiveItemProps,
} from "@/components/ui/primitives/primitive.tsx";

type CommandContextType = {};

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
  return (
    <Primitive>
      <CommandContext.Provider value={{}}>
        <div
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
  return (
    <div
      command-input-=""
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
    <Primitive.Wrapper className={cn("p-1", className)}>
      {children}
    </Primitive.Wrapper>
  );
};

const CommandGroup = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <Primitive.Group className={cn("p-ui-content", className)}>
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
  return (
    <Primitive.Item
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
    <Primitive.Label className={cn("text-xs text-gray-700", className)}>
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
