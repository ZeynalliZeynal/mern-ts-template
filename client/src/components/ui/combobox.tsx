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
  const comboboxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useOutsideClick(comboboxRef, () => {
    setOpen(false);
  });

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else {
      console.log(values, value);
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
      }}
    >
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        ref={comboboxRef}
        tabIndex={0}
        className="w-full rounded-md border focus-within:shadow-input transition group"
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
    setOpen,
    inputValue,
    setInputValue,
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
          onFocus={() => setOpen(true)}
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Search..."
          className="placeholder:text-gray-700 px-10 text-foreground"
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
  const { open, rect } = useCombobox();

  if (!open || !rect) return null;

  const availableSpaceBelow = window.innerHeight - rect.bottom;
  const availableSpaceAbove = rect.top;
  const placeAbove =
    availableSpaceBelow < 200 && availableSpaceAbove > availableSpaceBelow;

  return createPortal(
    <div
      data-combobox="popup"
      className="rounded-lg border p-2 flex-col min-w-40 fixed z-50 bg-background-100"
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
  const [hovered, setHovered] = useState("");

  const { currentValue, setValues, onChange, setOpen, setInputValue } =
    useCombobox();
  const ref = useRef<HTMLButtonElement | null>(null);

  const handleSelectValue = () => {
    onChange(children);
    setInputValue(children);
    setTimeout(() => {
      setOpen(false);
    }, 0);
  };

  const handleNavigate: KeyboardEventHandler<HTMLButtonElement> = (event) => {
    if ((event.code === "Space" || event.code === "Enter") && hovered)
      onChange(hovered);
  };

  useEffect(() => {
    if (ref.current) {
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
      data-hover={hovered === children ? "" : null}
      aria-selected={children.toLowerCase() === currentValue?.toLowerCase()}
      className="text-gray-700 justify-between rounded-md data-[hover]:bg-gray-200 data-[hover]:text-foreground px-3 py-2 w-full"
      onClick={handleSelectValue}
      onMouseEnter={() => setHovered(children)}
      onMouseLeave={() => setHovered("")}
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
