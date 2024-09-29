import { FaCheck } from "react-icons/fa6";
import { KeyboardEventHandler, ReactNode } from "react";

interface Checkbox {
  children: ReactNode;
  checked: boolean;
  onChange: () => void;
}

export default function Checkbox({ children, checked, onChange }: Checkbox) {
  const handleCheck: KeyboardEventHandler<HTMLSpanElement> = (event) => {
    if (event.code === "Enter" || event.code === "Space") {
      event.preventDefault();
      onChange();
    }
  };

  return (
    <label
      htmlFor={children!.toString()}
      className="flex items-center gap-2 text-[.8125rem] font-medium cursor-pointer w-fit"
    >
      <span
        className="size-5 rounded-md border aria-checked:bg-foreground aria-checked:text-background-100 text-background-200 transition p-1 group"
        aria-checked={checked}
        role="checkbox"
        tabIndex={0}
        onKeyDown={handleCheck}
      >
        {checked && <FaCheck />}
        <input
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
