import { MutableRefObject, useEffect } from "react";

export const useOutsideClick = (
  ref: MutableRefObject<HTMLElement | null>,
  cb: (event: MouseEvent) => void,
  phase: boolean = false,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(`[data-combobox="popup"]`) &&
        !(event.target as HTMLElement).closest(`[data-context="popup"]`)
      ) {
        cb(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, phase);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, phase);
    };
  }, [ref, cb]);
};
