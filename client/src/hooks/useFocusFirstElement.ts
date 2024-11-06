import React, { MutableRefObject } from "react";

export const useFocusFirstElement = (
  condition: boolean,
  ref: MutableRefObject<HTMLElement | null>,
) => {
  React.useEffect(() => {
    if (!condition || !ref.current) return;
    const focusableElements = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0] as HTMLElement;
    if (firstElement) firstElement.focus();
    else ref.current.focus();
  }, [condition, ref]);
};
