import { ReactNode } from "react";

export default function KeyboardInput({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded cursor-pointer text-sm text-gray-1000 h-6 border hover:bg-gray-alpha-200 inline-flex items-center transition select-none">
      <span className="px-1.5">{children}</span>
    </kbd>
  );
}
