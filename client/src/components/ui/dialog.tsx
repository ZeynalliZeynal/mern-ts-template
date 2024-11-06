import React, {
  cloneElement,
  Dispatch,
  forwardRef,
  HTMLAttributes,
  isValidElement,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { MenuTriggerProps } from "@/components/ui/types.ts";
import { cn } from "@/lib/utils.ts";
import {
  ANIMATION_DURATION,
  ANIMATION_TIMEOUT,
} from "@/components/ui/parameters.ts";
import Button from "@/components/ui/button.tsx";
import { createPortal } from "react-dom";
import { useOutsideClick } from "@/hooks/useOutsideClick.ts";
import { useRestrictBody } from "@/hooks/useRestrictBody.ts";
import { loopThroughFocusableElements } from "@/components/ui/utils.ts";
import { useFocusFirstElement } from "@/hooks/useFocusFirstElement.ts";

type DialogContextProps = {
  openDialog: (element: HTMLElement) => void;
  open: boolean;
  closeDialog: () => void;
  animate: boolean;
};

const DialogContext = React.createContext<DialogContextProps | undefined>(
  undefined,
);

const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("Dialog component is outside of the provider");
  return context;
};

export default function Dialog({
  children,
  open: customOpen = false,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: Dispatch<SetStateAction<boolean>>;
}) {
  const [open, setOpen] = React.useState(customOpen);
  const [activeTrigger, setActiveTrigger] = React.useState<HTMLElement | null>(
    null,
  );
  const [animate, setAnimate] = React.useState(false);

  const setControlledOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    onOpenChange?.(isOpen);
  };

  const openDialog = (element: HTMLElement) => {
    setAnimate(false);
    setActiveTrigger(element as HTMLElement);
    setControlledOpen(true);
  };

  const closeDialog = () => {
    if (document.body.querySelector("[role=menu]")) return;
    setAnimate(true);
    setTimeout(() => {
      setControlledOpen(false);
      setAnimate(false);

      const triggers = Array.from(
        document.querySelectorAll("[dialog-trigger]"),
      ) as HTMLElement[];
      const findActive = triggers.indexOf(activeTrigger as HTMLElement);
      if (findActive >= 0) triggers[findActive].focus();
    }, ANIMATION_TIMEOUT);
    setActiveTrigger(null);
  };

  useRestrictBody(open);

  useEffect(() => {
    if (customOpen !== open) setOpen(customOpen);
  }, [customOpen]);

  return (
    <DialogContext.Provider value={{ open, openDialog, animate, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
}

const DialogTrigger = forwardRef<HTMLElement, MenuTriggerProps>(
  ({ children, prefix, suffix, className, asChild }, forwardRef) => {
    const { open, openDialog } = useDialog();

    const ref = useRef<HTMLButtonElement | null>(null);
    useImperativeHandle(forwardRef, () => ref.current as HTMLElement);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      event.preventDefault();
      openDialog(event.currentTarget);
    };

    const commonAttributes = {
      ref,
      "dialog-trigger": "",
      type: "button",
      "aria-expanded": open,
      "data-state": open ? "open" : "close",
      onClick: handleClick,
    };

    return asChild && isValidElement(children) ? (
      cloneElement(children, commonAttributes)
    ) : (
      <Button
        {...(commonAttributes as HTMLAttributes<HTMLButtonElement>)}
        primary
        prefix={prefix}
        suffix={suffix}
        size="sm"
        className={cn(className)}
      >
        {children}
      </Button>
    );
  },
);

const DialogHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div dialog-header="" className={cn("space-y-3 px-6 pt-6 pb-3", className)}>
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
      className={cn(
        "w-full flex justify-end items-center p-6 rounded-ui-content rounded-t-none bg-background-200",
        className,
      )}
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
  const { open, animate, closeDialog } = useDialog();

  const ref = useOutsideClick({ onTrigger: closeDialog });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!ref.current) return;
    if (event.code === "Escape") {
      event.preventDefault();
      closeDialog();
    }
    loopThroughFocusableElements(event);
  };

  useFocusFirstElement(open, ref);

  if (!open) return;

  return createPortal(
    <div
      data-portal=""
      tabIndex={-1}
      data-state={!animate ? "open" : "closed"}
      className={cn(
        "left-[50%] top-[50%] fixed z-50 translate-x-[-50%] translate-y-[-50%] flex gap-4 max-w-md w-full border rounded-ui-content pointer-events-auto focus:ring-0 flex-col bg-ui-background",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        className,
      )}
      ref={ref}
      popper-content-menu=""
      role="dialog"
      onKeyDown={handleKeyDown}
      style={{
        animationDuration: ANIMATION_DURATION + "ms",
      }}
    >
      {children}
    </div>,
    document.body,
  );
};

const DialogClose = ({
  children,
  className,
  asChild,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void | Promise<void>;
}) => {
  const { closeDialog } = useDialog();

  const handleClick: MouseEventHandler<HTMLButtonElement | HTMLElement> = (
    event,
  ) => {
    event.preventDefault();
    if (onClick) {
      const result = onClick(event);
      if (result instanceof Promise) {
        result
          .then(() => {
            closeDialog();
          })
          .catch((error) => {
            console.error("Error in onClick handler:", error);
            closeDialog();
          });
      } else {
        closeDialog();
      }
    } else {
      closeDialog();
    }
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

const DialogOverlay = ({ className }: { className?: string }) => {
  const { open, animate } = useDialog();

  if (!open) return null;
  return createPortal(
    <div
      data-state={!animate ? "open" : "closed"}
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      style={{
        animationDuration: ANIMATION_DURATION + "ms",
      }}
    />,
    document.body,
  );
};

Dialog.Content = DialogContent;
Dialog.Trigger = DialogTrigger;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Header = DialogHeader;
Dialog.Footer = DialogFooter;
Dialog.Close = DialogClose;
Dialog.Overlay = DialogOverlay;
