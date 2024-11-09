import {
  cloneElement,
  createContext,
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils.ts";
import { mergeRefs } from "@/utils/mergeRefs.ts";
import { IoChevronDown } from "react-icons/io5";
import {
  AccordionContentProps,
  AccordionContextProps,
  AccordionItemContextProps,
  AccordionItemProps,
  AccordionProps,
  AccordionTriggerProps,
} from "@/types/ui/accordion.ts";

const AccordionContext = createContext<AccordionContextProps | null>(null);
const AccordionItemContext = createContext<AccordionItemContextProps | null>(
  null,
);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context)
    throw new Error("Accordion component is outside of the provider");
  return context;
};

const useAccordionItem = () => {
  const context = useContext(AccordionItemContext);
  if (!context)
    throw new Error(
      "Accordion Trigger or Content component is outside of the provider",
    );
  return context;
};

const Accordion = ({
  children,
  className,
  type,
  collapsible,
}: AccordionProps) => {
  const [singleOpen, setSingleOpen] = useState("");

  const openAccordion = (value: string) => {
    setSingleOpen(value);
  };

  const closeAccordion = () => {
    setSingleOpen("");
  };

  return (
    <AccordionContext.Provider
      value={{ singleOpen, openAccordion, closeAccordion, collapsible, type }}
    >
      <div className={cn(className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

const AccordionItem = forwardRef<HTMLElement, AccordionItemProps>(
  ({ children, value, disabled, asChild, className }, ref) => {
    const { singleOpen, type } = useAccordion();
    const [multipleOpen, setMultipleOpen] = useState(false);

    const open = type === "single" ? singleOpen === value : multipleOpen;
    const state = open ? "open" : "closed";
    const isDisabled = disabled ? "" : undefined;

    const attributes = {
      ref,
      "data-state": state,
      "data-disabled": isDisabled,
      "aria-disabled": isDisabled,
      className,
    };

    return (
      <AccordionItemContext.Provider
        value={{ open, disabled, value, setMultipleOpen }}
      >
        {asChild && isValidElement(children) ? (
          cloneElement(children, attributes)
        ) : (
          <div
            {...(attributes as HTMLAttributes<HTMLDivElement>)}
            className={cn(className)}
          >
            {children}
          </div>
        )}
      </AccordionItemContext.Provider>
    );
  },
);

const AccordionTrigger = forwardRef<HTMLElement, AccordionTriggerProps>(
  ({ children, className, asChild }, ref) => {
    const { openAccordion, closeAccordion, collapsible, type } = useAccordion();
    const { open, value, disabled, setMultipleOpen } = useAccordionItem();

    const handleClick: MouseEventHandler<HTMLElement> = (event) => {
      event.preventDefault();
      if (disabled) return;
      if (open && collapsible) {
        if (type === "single") closeAccordion();
        else setMultipleOpen(false);
      } else {
        openAccordion(value);
        setMultipleOpen(true);
      }
    };

    const attributes = {
      ref,
      "data-state": open ? "open" : "closed",
      "aria-expanded": open,
      className,
      onClick: handleClick,
    };

    return asChild && isValidElement(children) ? (
      cloneElement(children, attributes)
    ) : (
      <h3 className={cn("flex items-center")}>
        <button
          {...(attributes as HTMLAttributes<HTMLButtonElement>)}
          className={cn(
            "cursor-pointer flex items-center w-full justify-between hover:underline py-4 flex-grow text-left",
            className,
          )}
        >
          {children}
          <IoChevronDown
            className={cn("transition-transform duration-300", {
              "rotate-180": open,
            })}
          />
        </button>
      </h3>
    );
  },
);

const AccordionContent = forwardRef<HTMLElement, AccordionContentProps>(
  ({ children, asChild, className }, forwardRef) => {
    const { singleOpen } = useAccordion();
    const { open, value } = useAccordionItem();
    const [height, setHeight] = useState(0);

    const ref = useRef<HTMLElement | null>(null);

    const attributes = {
      ref: mergeRefs(ref, forwardRef),
      className,
    };

    useEffect(() => {
      if (open && ref.current) {
        setHeight(ref.current.offsetHeight);
      }
    }, [open, ref]);

    return (
      <div
        data-state={open ? "open" : "closed"}
        aria-expanded={value === singleOpen}
        className={cn(
          "overflow-hidden w-full",
          "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
          className,
        )}
        style={
          {
            "--accordion-content-height": height + "px",
          } as CSSProperties
        }
      >
        {asChild && isValidElement(children) ? (
          cloneElement(children, attributes)
        ) : (
          <p {...attributes} className={cn("pb-4")}>
            {children}
          </p>
        )}
      </div>
    );
  },
);

Accordion.Content = AccordionContent;
Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
export default Accordion;
