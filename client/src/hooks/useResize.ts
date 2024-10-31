import { Dispatch, SetStateAction, useEffect } from "react";

export const useResize = (
  element: HTMLElement | null,
  callback: Dispatch<SetStateAction<DOMRect | null>>,
) => {
  useEffect(() => {
    const updateRect = () => {
      if (element) {
        callback(element.getBoundingClientRect());
      }
    };
    updateRect();

    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, []);
};
