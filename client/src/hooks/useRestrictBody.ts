import { useEffect } from "react";
import { PORTAL_SELECTOR } from "@/components/ui/parameters.ts";

export const useRestrictBody = (condition: boolean) => {
  useEffect(() => {
    const portalExists = document.body.querySelector(PORTAL_SELECTOR);
    const dialog = document.body.querySelector("[role=dialog]") as HTMLElement;
    const menu = document.body.querySelector("[role=menu]") as HTMLElement;
    const nestedDialog = !!(dialog && menu);

    if (portalExists) {
      document.body.style.marginRight = "6px";
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "none";

      if (nestedDialog && menu) {
        dialog.style.pointerEvents = "none";
      } else if (dialog) {
        dialog.style.pointerEvents = "auto";
      }
    } else {
      document.body.style.marginRight = "0px";
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "auto";
    }
  }, [condition]);
};
