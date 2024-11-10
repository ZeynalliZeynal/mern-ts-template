import {
  createContext,
  CSSProperties,
  KeyboardEventHandler,
  MouseEventHandler,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils.ts";

type TabsContextProps = {
  currentTab: string;
  activateTab: (value: string) => void;
} | null;

type CommonTabsProps = {
  children: ReactNode;
  className?: string;
};

type TabsTriggerProps = {
  value: string;
  disabled?: boolean;
} & CommonTabsProps;

type TabsListProps = CommonTabsProps;

const TabsContext = createContext<TabsContextProps>(null);
const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs component is outside of the provider");
  return context;
};

const Tabs = ({
  children,
  className,
  defaultValue,
}: {
  children: ReactNode;
  className?: string;
  defaultValue: string;
}) => {
  const [currentTab, setCurrentTab] = useState<string>(defaultValue);

  const activateTab = (value: string) => {
    setCurrentTab(value);
  };

  return (
    <TabsContext.Provider value={{ currentTab, activateTab }}>
      <div data-orientation="horizontal" dir="ltr" className={cn(className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsTrigger = ({
  children,
  value,
  className,
  disabled = false,
}: TabsTriggerProps) => {
  const { activateTab, currentTab } = useTabs();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    activateTab(value);
  };

  return (
    <button
      tabIndex={currentTab === value ? 0 : -1}
      role="tab"
      type="button"
      data-disabled={disabled ? "" : null}
      aria-disabled={disabled}
      data-state={currentTab === value ? "active" : null}
      aria-selected={currentTab === value}
      className={cn(
        "flex-grow relative z-[1] px-3 py-1 rounded-md transition-colors font-medium",
        {
          "text-foreground": currentTab === value,
          "text-gray-600": currentTab !== value,
        },
        className,
      )}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

const TabsList = ({ children, className }: TabsListProps) => {
  const { currentTab } = useTabs();
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [style, setStyle] = useState<CSSProperties>({});

  const ref = useRef<HTMLDivElement | null>(null);

  const handleKeyDown: KeyboardEventHandler<HTMLElement> = (event) => {
    if (event.code === "ArrowRight" || event.code === "ArrowLeft") {
      event.preventDefault();
      const direction: "next" | "previous" =
        event.code === "ArrowLeft" ? "previous" : "next";

      const triggers = Array.from(
        event.currentTarget.querySelectorAll("[role=tab]:not([data-disabled])"),
      ) as HTMLElement[];

      let nextIndex: number;
      if (direction === "next") {
        nextIndex =
          currentIndex === undefined || currentIndex === triggers.length - 1
            ? triggers.indexOf(triggers[triggers.length - 1])
            : currentIndex + 1;
      } else {
        nextIndex =
          currentIndex === undefined || currentIndex === 0
            ? 0
            : currentIndex - 1;
      }

      triggers[nextIndex].click();
      triggers[nextIndex].focus();
    }
  };

  useEffect(() => {
    if (!ref.current) return;
    const allTriggers = Array.from(
      ref.current.querySelectorAll("[role=tab]:not([data-disabled])"),
    ) as HTMLElement[];
    const activeTrigger = ref.current.querySelector(
      "[role=tab][data-state=active]",
    ) as HTMLElement;

    setStyle({
      width: activeTrigger.offsetWidth,
      height: activeTrigger.offsetHeight,
      left: activeTrigger.offsetLeft,
    });
    setCurrentIndex(allTriggers.indexOf(activeTrigger));
  }, [currentIndex, currentTab]);

  return (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        "flex relative w-full items-center rounded-lg p-1 bg-gray-400",
        className,
      )}
      onKeyDown={handleKeyDown}
    >
      <div
        className="absolute z-0 bg-ui-background rounded-md transition-all duration-300"
        style={{ ...style }}
      />
      {children}
    </div>
  );
};

const TabsContent = ({ children, value, className }: TabsTriggerProps) => {
  const { currentTab } = useTabs();

  if (currentTab === value)
    return (
      <div
        role="tabpanel"
        data-state={currentTab === value ? "active" : null}
        aria-selected={currentTab === value}
        className={cn("mt-2", className)}
      >
        {children}
      </div>
    );
};

Tabs.Content = TabsContent;
Tabs.Trigger = TabsTrigger;
Tabs.List = TabsList;
export default Tabs;
