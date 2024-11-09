import React from "react";

export function mergeRefs<T>(
  ...refs: (React.Ref<T> | undefined)[]
): React.RefCallback<T> {
  return (instance: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref && "current" in ref) {
        (ref as React.MutableRefObject<T | null>).current = instance;
      }
    });
  };
}
