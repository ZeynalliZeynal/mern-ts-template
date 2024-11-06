import React from "react";

export default function mergeRefs<T>(
  ...refs: (React.Ref<T> | null | undefined)[]
) {
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
