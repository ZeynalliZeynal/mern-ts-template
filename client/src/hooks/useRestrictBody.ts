import { useEffect } from "react";

export const useRestrictBody = (
  condition: boolean,
  preventTab: boolean = true,
) => {
  const restrictKey = (event: KeyboardEvent) => {
    if (event.code === "Tab" && preventTab) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (condition) {
      document.body.style.marginRight = "6px";
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "none";

      document.addEventListener("keydown", restrictKey);
    } else {
      document.body.style.marginRight = "0px";
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "auto";

      document.removeEventListener("keydown", restrictKey);
    }
    return () => {
      document.removeEventListener("keydown", restrictKey);
    };
  }, [condition]);
};
