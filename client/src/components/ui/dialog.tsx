import React from "react";
import Popper, {
  usePopperContext,
} from "@/components/ui/popper-primitives.tsx";
import { MenuTriggerProps } from "@/components/ui/types.ts";
import { cn } from "@/lib/utils.ts";
import { createPortal } from "react-dom";

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

function DialogTrigger(props: MenuTriggerProps) {
  return (
    <Popper.Trigger dialog-trigger="" {...props}>
      {props.children}
    </Popper.Trigger>
  );
}

function DialogOverlay({ className }: { className?: string }) {
  const { open, animate } = usePopperContext();

  if (!open) return null;
  return createPortal(
    <div
      data-state={!animate ? "open" : "closed"}
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
    />,
    document.body,
  );
}

function DialogHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div dialog-header="" className={cn("space-y-3", className)}>
      {children}
    </div>
  );
}

function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
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
}

function DialogDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      dialog-description=""
      className={cn("text-gray-800 font-semibold tracking-tight", className)}
    >
      {children}
    </p>
  );
}

function DialogContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <DialogOverlay />
      <Popper.Wrapper
        asChild
        className={cn(
          "fixed flex flex-col gap-4 max-w-md w-full p-6",
          className,
        )}
      >
        {children}
      </Popper.Wrapper>
    </>
  );
}

Dialog.Content = DialogContent;
Dialog.Trigger = DialogTrigger;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Header = DialogHeader;
