import { useEffect, useRef } from "react";

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
      if (ref.current && !ref.current.contains(event.target as Node)) {
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
