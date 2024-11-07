import { useEffect, useRef } from "react";
import { POPPER_SUB_CONTENT_SELECTOR } from "@/components/ui/primitves/popper-primitive-sub.tsx";

export const useOutsideClick = ({
  onTrigger,
  capturePhase = false,
}: {
  onTrigger: () => void;
  capturePhase?: boolean;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(POPPER_SUB_CONTENT_SELECTOR)
      ) {
        onTrigger();
      }
    };

    document.addEventListener("mousedown", handleClickOutside, capturePhase);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
        capturePhase,
      );
    };
  }, [onTrigger, capturePhase, ref]);

  return ref;
};
