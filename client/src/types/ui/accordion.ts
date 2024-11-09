import { Dispatch, ReactNode, SetStateAction } from "react";

type AccordionTypes = "multiple" | "single";

type AccordionContextProps = {
  singleOpen: string;
  openAccordion: (value: string) => void;
  closeAccordion: () => void;
  collapsible?: boolean;
  type: AccordionTypes;
};

type CommonProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
};

type AccordionItemProps = {
  value: string;
  disabled?: boolean;
} & CommonProps;

type AccordionTriggerProps = {} & CommonProps;
type AccordionContentProps = {} & CommonProps;

type AccordionProps = {
  children: ReactNode;
  type: AccordionTypes;
  collapsible?: boolean;
  className?: string;
};

type AccordionItemContextProps = {
  open: boolean;
  disabled?: boolean;
  value: string;
  setMultipleOpen: Dispatch<SetStateAction<boolean>>;
};

export type {
  AccordionTypes,
  AccordionProps,
  AccordionContextProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionItemContextProps,
};
