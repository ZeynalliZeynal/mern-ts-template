import { cn } from "@/lib/utils.ts";
import {
  createContext,
  Dispatch,
  KeyboardEventHandler,
  ReactNode,
  SetStateAction,
  useContext,
} from "react";
import { FaCheck } from "react-icons/fa6";

interface ChoiceboxGroup<T> {
  children: ReactNode;
  direction?: "row" | "col";
  label?: string;
  type?: "radio" | "checkbox";
  onChange: Dispatch<SetStateAction<T>>;
  value: string | string[];
}

interface ChoiceboxItem {
  children?: ReactNode;
  value: string;
  title: string;
  description: string;
}

interface ChoiceboxConext<T> {
  selected: string | string[];
  onChoose: (val: T) => void;
}

const ChoiceboxContext = createContext<ChoiceboxConext<
  string | string[]
> | null>(null);

export default function ChoiceboxGroup<T extends string | string[]>({
  children,
  direction = "row",
  label,
  type = "radio",
  onChange,
  value,
}: ChoiceboxGroup<T>) {
  const handleChoose = (val: string | string[]) => {
    if (type === "radio") onChange(val as T);
    else {
      onChange((prevState) => {
        const newValues = prevState.includes(val as string)
          ? (prevState as string[]).filter((item) => item !== val)
          : [...prevState, val as string];
        return newValues as T;
      });
    }
  };

  return (
    <ChoiceboxContext.Provider
      value={{
        selected: value,
        onChoose: handleChoose,
      }}
    >
      <div
        aria-multiselectable={type === "checkbox"}
        role="radiogroup"
        className="flex flex-col gap-2 w-full"
      >
        {label && (
          <label tabIndex={-1} className="text-el">
            {label}
          </label>
        )}
        <ul
          className={cn("items-stretch w-full gap-3", {
            "grid grid-cols-1": direction === "row",
            "grid grid-cols-2": direction === "col",
          })}
        >
          {children}
        </ul>
      </div>
    </ChoiceboxContext.Provider>
  );
}

const ChoiceboxGroupItem = ({
  children,
  value,
  title,
  description,
}: ChoiceboxItem) => {
  const context = useContext(ChoiceboxContext);
  if (!context) throw new Error("Context is outside of the provider");

  const { selected, onChoose } = context;

  const handleChangeBetween: KeyboardEventHandler<HTMLLabelElement> = (
    event,
  ) => {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      onChoose(value);
    }

    // * Navigation functionality

    if (event.code === "ArrowLeft" || event.code === "ArrowUp") {
      event.preventDefault();
      const prevSibling = event.currentTarget.previousElementSibling;
      if (prevSibling) {
        if (typeof selected === "string")
          onChoose((prevSibling as HTMLElement).dataset.value || "");
        (prevSibling as HTMLElement).focus();
      }
    } else if (event.code === "ArrowRight" || event.code === "ArrowDown") {
      event.preventDefault();
      const nextSibling = event.currentTarget.nextElementSibling;
      if (nextSibling) {
        if (typeof selected === "string")
          onChoose((nextSibling as HTMLElement).dataset.value || "");
        (nextSibling as HTMLElement).focus();
      }
    }
  };

  const isSelected =
    typeof selected === "string"
      ? selected === value
      : selected.includes(value);

  return (
    <label
      tabIndex={0}
      className={cn(
        "border hover:bg-gray-100 group rounded-md flex flex-col transition group-aria-selected:text-blue-900 aria-selected:border-blue-600 active:border-gray-600 cursor-pointer",
        {
          "hover:border-gray-500": !isSelected,
        },
      )}
      aria-selected={isSelected}
      onClick={(event) => {
        event.preventDefault();
        onChoose(value);
      }}
      onKeyDown={handleChangeBetween}
      data-value={value}
    >
      <div
        className={cn(
          "p-3 flex items-center justify-between rounded-md transition gap-6 group-aria-selected:text-blue-900",
          {
            "bg-blue-100 hover:bg-blue-200": isSelected,
          },
        )}
      >
        <div className="flex flex-col gap-1">
          <span className="font-semibold">{title}</span>
          <span className="text-gray-900 group-aria-selected:text-blue-900">
            {description}
          </span>
        </div>
        <div
          className={cn(
            "size-4 p-0.5 flex justify-center hover:!border-blue-900 items-center border group-aria-selected:border-blue-900 group-hover:border-gray-600 transition",
            {
              "rounded-full": typeof selected === "string",
              rounded: typeof selected === "object",
              "bg-blue-900": typeof selected === "object" && isSelected,
            },
          )}
        >
          {typeof selected === "string" ? (
            <>
              <input
                tabIndex={-1}
                type="radio"
                className="sr-only"
                value={value}
                checked={isSelected}
                onChange={() => onChoose(value)}
              />
              <span
                aria-hidden="true"
                className={cn(
                  "scale-0 transition size-full rounded-full bg-blue-900",
                  {
                    "scale-100": isSelected,
                  },
                )}
              />
            </>
          ) : (
            <>
              <input
                tabIndex={-1}
                type="checkbox"
                className="sr-only"
                value={value}
                checked={isSelected}
                onChange={() => onChoose(value)}
              />
              {isSelected && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "scale-0 transition size-full text-background-100",
                    {
                      "scale-100": isSelected,
                    },
                  )}
                >
                  <FaCheck className="size-full" />
                </span>
              )}
            </>
          )}
        </div>
      </div>
      {children && <div className="p-3">{children}</div>}
    </label>
  );
};

ChoiceboxGroup.Item = ChoiceboxGroupItem;
