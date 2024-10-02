import {
  createContext,
  Dispatch,
  KeyboardEventHandler,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoCheckmark, IoChevronDown, IoClose, IoSearch } from "react-icons/io5";
import { createPortal } from "react-dom";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";

interface ComboboxContext {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  rect: DOMRect | null;
  values: string[];
  setValues: Dispatch<SetStateAction<string[]>>;
  onChange: Dispatch<SetStateAction<string>>;
  currentValue: string;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  listboxRef: MutableRefObject<HTMLDivElement | null>;
  hoveredOption: string;
  setHoveredOption: Dispatch<SetStateAction<string>>;
}

const ComboboxContext = createContext<ComboboxContext | null>(null);

const useCombobox = () => {
  const context = useContext(ComboboxContext);
  if (!context) throw new Error("Context is outside of the provider");
  return context;
};

export default function Combobox({
  children,
  value,
  onChange,
}: {
  children: ReactNode;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
}) {
  const [values, setValues] = useState<string[]>([]);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState("");

  const comboboxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);

  useOutsideClick(comboboxRef, () => {
    setOpen(false);
  });

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else {
      inputRef.current?.blur();
      if (values.map((v) => v.toLowerCase()).includes(inputValue.toLowerCase()))
        onChange(inputValue);
      else {
        if (inputValue) {
          const foundValue = values.find((v) =>
            v.toLowerCase().includes(inputValue.toLowerCase()),
          );
          if (foundValue) {
            onChange(foundValue);
            setInputValue(foundValue);
          } else {
            onChange(values[0]);
            setInputValue(values[0]);
          }
        } else onChange("");
      }
    }
  }, [open]);

  useEffect(() => {
    const updateRect = () => {
      if (comboboxRef.current) {
        setRect(comboboxRef.current.getBoundingClientRect());
      }
    };
    updateRect();

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, []);

  useEffect(() => {
    if (value) setValues((prevState) => [...prevState, value]);
  }, []);

  return (
    <ComboboxContext.Provider
      value={{
        open,
        setOpen,
        inputRef,
        rect,
        values,
        setValues,
        currentValue: value,
        onChange,
        inputValue,
        setInputValue,
        listboxRef,
        hoveredOption,
        setHoveredOption,
      }}
    >
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        ref={comboboxRef}
        tabIndex={0}
        className="w-full rounded-md border focus-within:shadow-input transition group"
        onKeyDown={(event) => {
          if (open && event.code === "Escape") setOpen(false);
        }}
      >
        {children}
      </div>
    </ComboboxContext.Provider>
  );
}

const ComboboxInput = () => {
  const {
    currentValue,
    inputRef,
    onChange,
    listboxRef,
    setOpen,
    inputValue,
    setInputValue,
    setHoveredOption,
  } = useCombobox();

  return (
    <div className="w-full relative place-items-center text-gray-700">
      <span
        aria-hidden="true"
        className="inline-flex absolute top-1/2 left-0 -translate-y-1/2 items-center justify-center size-10 p-[11px]"
      >
        <IoSearch />
      </span>
      <div className="h-10 relative z-[1] w-full">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder="Search..."
          className="placeholder:text-gray-700 px-10 text-foreground"
          onChange={(event) => setInputValue(event.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (event.code === "ArrowDown" && listboxRef.current) {
              event.preventDefault();
              (
                listboxRef.current.firstElementChild as HTMLButtonElement
              ).focus();
              setHoveredOption(
                (listboxRef.current.firstElementChild as HTMLButtonElement)
                  .dataset.value as string,
              );
            } else if (event.code === "ArrowUp" && listboxRef.current) {
              event.preventDefault();
              (
                listboxRef.current.lastElementChild as HTMLButtonElement
              ).focus();
              setHoveredOption(
                (listboxRef.current.lastElementChild as HTMLButtonElement)
                  .dataset.value as string,
              );
            }
          }}
        />
      </div>
      {currentValue ? (
        <button
          onClick={() => {
            setInputValue("");
            onChange("");
          }}
          className="inline-flex z-[1] absolute top-1/2 right-0 -translate-y-1/2 items-center justify-center size-10 p-[11px] hover:text-foreground"
        >
          <IoClose />
        </button>
      ) : (
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex z-[1] absolute top-1/2 right-0 -translate-y-1/2 items-center justify-center size-10 p-[11px] hover:text-foreground group-aria-expanded:rotate-180"
        >
          <IoChevronDown />
        </button>
      )}
    </div>
  );
};

const ComboboxList = ({ children }: { children: ReactNode }) => {
  const { open, rect, listboxRef } = useCombobox();

  if (!open || !rect) return null;

  const availableSpaceBelow = window.innerHeight - rect.bottom;
  const availableSpaceAbove = rect.top;
  const placeAbove =
    availableSpaceBelow < 200 && availableSpaceAbove > availableSpaceBelow;

  return createPortal(
    <div
      ref={listboxRef}
      data-combobox="popup"
      className="rounded-xl border p-2 flex-col min-w-40 fixed z-50 bg-background-100"
      style={{
        left: rect.left,
        width: rect.width,
        top: placeAbove ? rect.top - 10 : rect.bottom + 10,
        transform: placeAbove ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      {children}
    </div>,
    document.body,
  );
};

const ComboboxOption = ({
  children,
  value,
}: {
  children: string;
  value: string;
}) => {
  const {
    currentValue,
    listboxRef,
    setValues,
    onChange,
    setOpen,
    setInputValue,
    hoveredOption,
    setHoveredOption,
    inputRef,
  } = useCombobox();

  const ref = useRef<HTMLButtonElement | null>(null);

  const handleSelectValue = () => {
    onChange(children);
    setInputValue(children);
    setTimeout(() => {
      setOpen(false);
    }, 0);
  };

  const handleNavigate: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if ((event.code === "Space" || event.code === "Enter") && hoveredOption)
      onChange(hoveredOption);

    if (event.code === "ArrowUp") {
      event.preventDefault();
      const prevSibling = event.currentTarget.previousElementSibling;
      if (prevSibling) {
        (prevSibling as HTMLElement).focus();
        setHoveredOption(
          (prevSibling as HTMLButtonElement).dataset.value as string,
        );
      } else inputRef.current?.focus();
    } else if (event.code === "ArrowDown") {
      event.preventDefault();
      const nextSibling = event.currentTarget.nextElementSibling;
      if (nextSibling) {
        (nextSibling as HTMLElement).focus();
        setHoveredOption(
          (nextSibling as HTMLButtonElement).dataset.value as string,
        );
      } else inputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (listboxRef.current) {
      setValues((prevState) => {
        const valueSet = new Set(prevState);
        if (!valueSet.has(children)) valueSet.add(children);
        return Array.from(valueSet);
      });
    }
  }, []);

  return (
    <button
      ref={ref}
      data-value={value}
      data-hover={hoveredOption === value ? true : null}
      aria-selected={children.toLowerCase() === currentValue?.toLowerCase()}
      className="text-gray-700 justify-between rounded data-[hover]:bg-gray-200 data-[hover]:text-foreground px-3 py-2 w-full focus:ring-0 cursor-default"
      onClick={handleSelectValue}
      onMouseEnter={(event) => {
        event.currentTarget.focus();
        setHoveredOption(value);
      }}
      onMouseLeave={() => setHoveredOption("")}
      onKeyDown={handleNavigate}
    >
      {children}
      {currentValue?.toLowerCase() === children.toLowerCase() && (
        <span className="size-4">
          <IoCheckmark />
        </span>
      )}
    </button>
  );
};

Combobox.Input = ComboboxInput;
Combobox.List = ComboboxList;
Combobox.Option = ComboboxOption;
