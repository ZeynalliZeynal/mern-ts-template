import { useEffect } from "react";

export const useRestrictBody = (condition: boolean) => {
  useEffect(() => {
    if (condition) {
      document.body.style.marginRight = "6px";
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "none";
    } else {
      document.body.style.marginRight = "0px";
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "auto";
    }
  }, [condition]);
};
