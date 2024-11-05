import { useEffect } from "react";

export const useResize = (
  condition: boolean,
  callback: () => void,
  position?: DOMRect | null,
) => {
  useEffect(() => {
    if (!condition) return;
    callback();

    window.addEventListener("resize", callback);
    window.addEventListener("scroll", callback);

    return () => {
      window.removeEventListener("resize", callback);
      window.removeEventListener("scroll", callback);
    };
  }, [callback, condition, position]);
};
