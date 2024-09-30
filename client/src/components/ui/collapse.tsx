import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils.ts";
import { ChevronDown } from "lucide-react";

interface CollapseGroupContext {
  current: string;
  expand: (value: string) => void;
  collapse: () => void;
}

const CollapseGroupContext = createContext<CollapseGroupContext | null>(null);

export default function CollapseGroup({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState("");

  const handleExpand = (value: string) => setCurrent(value);
  const handleCollapse = () => setCurrent("");

  return (
    <CollapseGroupContext.Provider
      value={{
        current,
        expand: handleExpand,
        collapse: handleCollapse,
      }}
    >
      <div className="border-b w-full">{children}</div>
    </CollapseGroupContext.Provider>
  );
}

export const Collapse = ({
  children,
  title,
  size = "md",
  expanded = false,
}: {
  children: ReactNode;
  title: string;
  size?: "sm" | "md";
  expanded?: boolean;
}) => {
  const context = useContext(CollapseGroupContext);
  if (!context) throw new Error("Outside provider");

  const [height, setHeight] = useState<number>(0);
  const ref = useRef<HTMLParagraphElement | null>(null);

  const { current, expand, collapse } = context;

  useEffect(() => {
    if (ref.current) setHeight(ref.current.clientHeight);
  }, []);

  useEffect(() => {
    if (expanded) expand(title);
  }, []);

  return (
    <div className="border-t">
      <h3
        className={cn({
          "text-base font-medium leading-normal": size === "sm",
          "text-2xl font-semibold leading-loose": size === "md",
        })}
      >
        <button
          className="w-full"
          onClick={() => {
            if (current !== title || !current) expand(title);
            else !expanded ? collapse() : null;
          }}
        >
          <span
            className={cn("flex w-full items-center justify-between", {
              "py-4": size === "sm",
              "py-6": size === "md",
            })}
          >
            {title}
            <span
              className={cn("size-4 transition-transform duration-200", {
                "rotate-180": current === title,
              })}
            >
              <ChevronDown />
            </span>
          </span>
        </button>
      </h3>
      <div
        className={cn(
          "transition-[height] duration-200 will-change-[height] leading-6 text-base overflow-y-hidden",
        )}
        style={{
          height:
            current === title ? (size === "sm" ? height + 16 : height + 24) : 0,
        }}
      >
        <p
          ref={ref}
          className={cn({
            "mb-4": size === "sm",
            "mb-6": size === "md",
          })}
        >
          {children}
        </p>
      </div>
    </div>
  );
};
