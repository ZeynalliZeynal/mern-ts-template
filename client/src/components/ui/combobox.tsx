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
import { calculateAvailableRoom } from "@/utils/calculateAvailableRoom.ts";
import { cn } from "@/lib/utils.ts";
import { ANIMATION_TIMEOUT } from "@/components/ui/parameters.ts";
import { useRestrictBody } from "@/hooks/useRestrictBody.ts";

interface ComboboxContext {
  open: boolean;
  animate: boolean;
  handleClose: () => void;
  handleOpen: (element: HTMLElement) => void;
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
  isSearching: boolean;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
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
  const [animate, setAnimate] = useState(false);
  const [values, setValues] = useState<string[]>([]);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeTrigger, setActiveTrigger] = useState<HTMLElement | null>(null);

  const comboboxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listboxRef = useRef<HTMLDivElement | null>(null);

  const handleOpen = (element: HTMLElement) => {
    setActiveTrigger(element);
    setAnimate(false);
    setOpen(true);
  };

  const handleClose = () => {
    setAnimate(true);
    setTimeout(() => {
      setOpen(false);
      setAnimate(false);

      const triggers = Array.from(
        document.querySelectorAll('[role="combobox"]'),
      ) as HTMLElement[];
      const findActive = triggers.indexOf(activeTrigger as HTMLElement);
      triggers[findActive].focus();
    }, ANIMATION_TIMEOUT);
    setActiveTrigger(null);
  };

  useOutsideClick(comboboxRef, () => {
    handleClose();
  });

  useRestrictBody(open);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else {
      inputRef.current?.blur();
      if (values.map((v) => v.toLowerCase()).includes(inputValue.toLowerCase()))
        onChange(inputValue);
      else {
        if (inputValue) {
          const foundValue = values.find((v) =>
            v.toLowerCase().includes(inputValue.toLowerCase().trim()),
          );
          if (foundValue) {
            onChange(foundValue);
            setInputValue(foundValue);
          } else {
            onChange(values[0]);
            setInputValue(values[0]);
          }
        } else onChange("");
        setIsSearching(false);
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
        animate,
        handleClose,
        handleOpen,
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
        isSearching,
        setIsSearching,
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
          if (open && event.code === "Escape") {
            event.preventDefault();
            handleClose();
          }
          if (event.code === "Space" || event.code === "Enter") {
            handleOpen(event.currentTarget);
          }
        }}
      >
        {children}
      </div>
    </ComboboxContext.Provider>
  );
}

const ComboboxInput = () => {
  const {
    open,
    currentValue,
    inputRef,
    onChange,
    listboxRef,
    handleOpen,
    handleClose,
    inputValue,
    setInputValue,
    setHoveredOption,
    setIsSearching,
  } = useCombobox();

  return (
    <div className="w-full relative place-items-center text-gray-900 pointer-events-auto">
      <span
        aria-hidden="true"
        className="inline-flex absolute top-1/2 left-0 -translate-y-1/2 items-center justify-center size-10 p-[11px]"
      >
        <IoSearch />
      </span>
      <div className="h-10 relative z-[1] w-full">
        <input
          tabIndex={-1}
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder="Search..."
          className="placeholder:text-gray-700 px-10 text-foreground"
          onChange={(event) => {
            setIsSearching(true);
            setInputValue(event.target.value);
          }}
          onFocus={(event) =>
            handleOpen(
              event.currentTarget.closest('[role="combobox"]') as HTMLElement,
            )
          }
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
          tabIndex={-1}
          aria-hidden={true}
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
          tabIndex={-1}
          aria-hidden={true}
          onClick={(event) =>
            open
              ? handleClose()
              : handleOpen(
                  event.currentTarget.closest(
                    '[role="combobox"]',
                  ) as HTMLElement,
                )
          }
          className="inline-flex z-[1] absolute top-1/2 right-0 -translate-y-1/2 items-center justify-center size-10 p-[11px] hover:text-foreground group-aria-expanded:rotate-180"
        >
          <IoChevronDown />
        </button>
      )}
    </div>
  );
};

const ComboboxContent = ({ children }: { children: ReactNode }) => {
  const { open, rect, listboxRef, animate } = useCombobox();

  if (!open || !rect) return null;

  const placeAbove = calculateAvailableRoom(rect.top, rect.bottom);

  return createPortal(
    <div
      ref={listboxRef}
      data-combobox="popup"
      data-state={!animate}
      className={cn(
        "rounded-ui-content focus:ring-0 border p-ui-content flex-col min-w-40 fixed z-50 bg-ui-background pointer-events-auto",
        "data-[state='true']:animate-in data-[state='false']:animate-out data-[state='true']:zoom-in data-[state='false']:zoom-out",
      )}
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

const ComboboxItem = ({
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
    handleClose,
    setInputValue,
    hoveredOption,
    setHoveredOption,
    inputRef,
    inputValue,
    isSearching,
    setIsSearching,
  } = useCombobox();

  const ref = useRef<HTMLButtonElement | null>(null);

  const handleSelectValue = () => {
    onChange(children);
    setInputValue(children);
    handleClose();
    setIsSearching(false);
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
      } else {
        inputRef.current?.focus();
        setHoveredOption("");
      }
    } else if (event.code === "ArrowDown") {
      event.preventDefault();
      const nextSibling = event.currentTarget.nextElementSibling;
      if (nextSibling) {
        (nextSibling as HTMLElement).focus();
        setHoveredOption(
          (nextSibling as HTMLButtonElement).dataset.value as string,
        );
      } else {
        inputRef.current?.focus();
        setHoveredOption("");
      }
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

  const isSearched = children
    .toLowerCase()
    .includes(inputValue.trim().toLowerCase());

  if (!isSearched && isSearching) return null;

  return (
    <button
      ref={ref}
      data-value={value}
      data-highlighted={hoveredOption === value ? true : null}
      aria-selected={children.toLowerCase() === currentValue?.toLowerCase()}
      className={cn(
        "text-ui-foreground justify-between rounded-ui-item p-ui-item w-full focus:ring-0 cursor-default transition-colors",
        "data-[highlighted]:bg-ui-item-background-hover data-[highlighted]:text-ui-item-foreground-hover",
      )}
      onClick={handleSelectValue}
      onMouseEnter={(event) => {
        event.currentTarget.focus();
        setHoveredOption(value);
      }}
      onMouseLeave={() => setHoveredOption("")}
      onKeyDown={handleNavigate}
    >
      {children}
      {inputValue?.toLowerCase() === children.toLowerCase() && (
        <span className="size-4">
          <IoCheckmark />
        </span>
      )}
    </button>
  );
};

Combobox.Input = ComboboxInput;
Combobox.Content = ComboboxContent;
Combobox.Item = ComboboxItem;
