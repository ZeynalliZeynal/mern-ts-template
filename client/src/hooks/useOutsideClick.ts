import { MutableRefObject, useEffect } from "react";

export const useOutsideClick = (
  ref: MutableRefObject<HTMLElement | null>,
  cb: (event: MouseEvent) => void,
  phase: boolean = false,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        cb(event);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, phase);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, phase);
    };
  }, [cb, phase, ref]);
};
