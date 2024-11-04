import { FaCheck } from "react-icons/fa6";
import { KeyboardEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils.ts";

interface Checkbox {
  children: ReactNode;
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean;
}

export default function Checkbox({
  children,
  checked,
  onChange,
  disabled,
}: Checkbox) {
  const handleCheck: KeyboardEventHandler<HTMLSpanElement> = (event) => {
    if ((event.code === "Enter" || event.code === "Space") && onChange) {
      event.preventDefault();
      onChange();
    }
  };

  return (
    <label
      htmlFor={children!.toString()}
      className={cn(
        "flex items-center gap-2 text-el font-medium cursor-pointer w-fit",
        {
          "text-gray-500 cursor-not-allowed": disabled,
        },
      )}
    >
      <span
        aria-checked={checked}
        aria-disabled={disabled}
        data-checked={checked}
        data-disabled={disabled}
        className="size-4 rounded border data-[checked=true]:bg-foreground text-background-200 transition p-0.5 group data-[disabled=true]:bg-gray-200 data-[disabled=true]:cursor-not-allowed"
        role="checkbox"
        tabIndex={0}
        onKeyDown={handleCheck}
      >
        {checked && <FaCheck aria-hidden="true" className="size-full" />}
        <input
          tabIndex={-1}
          type="checkbox"
          id={children!.toString()}
          className="sr-only"
          onChange={onChange}
          checked={checked}
        />
      </span>
      <span>{children}</span>
    </label>
  );
}
