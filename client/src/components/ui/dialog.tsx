import React, { cloneElement, isValidElement, MouseEventHandler } from "react";
import Popper, {
  usePopperContext,
} from "@/components/ui/popper-primitives.tsx";
import { MenuTriggerProps } from "@/components/ui/types.ts";
import { cn } from "@/lib/utils.ts";

type DialogContextProps = {} | undefined;

const DialogContext = React.createContext<DialogContextProps>(undefined);
// const useDialog = () => React.useContext(DialogContext);

export default function Dialog({ children }: { children: React.ReactNode }) {
  return (
    <Popper menuType="dialog">
      <DialogContext.Provider value={{}}>{children}</DialogContext.Provider>
    </Popper>
  );
}

const DialogTrigger = (props: MenuTriggerProps) => {
  return (
    <Popper.Trigger dialog-trigger="" {...props}>
      {props.children}
    </Popper.Trigger>
  );
};

const DialogHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div dialog-header="" className={cn("space-y-3", className)}>
      {children}
    </div>
  );
};

const DialogFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      dialog-footer=""
      className={cn("w-full flex justify-end items-center", className)}
    >
      {children}
    </div>
  );
};

const DialogTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2
      dialog-title=""
      className={cn(
        "text-lg text-foreground font-semibold leading-none tracking-tight",
        className,
      )}
    >
      {children}
    </h2>
  );
};

const DialogDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      dialog-description=""
      className={cn("text-gray-800 font-semibold tracking-tight", className)}
    >
      {children}
    </p>
  );
};

const DialogContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <>
      <Popper.Overlay />
      <Popper.Dialog
        dialog-content=""
        role="dialog"
        className={cn(
          "left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] flex flex-col gap-4 max-w-md w-full p-6 bg-background-100 border rounded-ui-content",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2",
          className,
        )}
      >
        {children}
      </Popper.Dialog>
    </>
  );
};

const DialogClose = ({
  children,
  className,
  asChild,
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}) => {
  const { closePopper } = usePopperContext();

  const handleClick: MouseEventHandler<HTMLButtonElement | HTMLElement> = (
    event,
  ) => {
    event.preventDefault();
    closePopper();
  };

  const commonAttributes = {
    onClick: handleClick,
    className: cn(className),
  };

  return asChild && isValidElement(children) ? (
    cloneElement(children, commonAttributes)
  ) : (
    <button dialog-close="" type="button" {...commonAttributes}>
      {children}
    </button>
  );
};

Dialog.Content = DialogContent;
Dialog.Trigger = DialogTrigger;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Header = DialogHeader;
Dialog.Footer = DialogFooter;
Dialog.Close = DialogClose;
