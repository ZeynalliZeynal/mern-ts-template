import { ReactNode, useState } from "react";
import { MdContentPaste } from "react-icons/md";
import { cn } from "@/lib/utils.ts";
import { IoCheckmark } from "react-icons/io5";

const Copy = ({
  children,
  text,
  className,
}: {
  children?: ReactNode;
  text: string;
  className?: string;
}) => {
  const [copying, setCopying] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      console.log("Could not copy text", err);
    }
  };

  return (
    <button
      className={cn(
        "w-fit flex items-center gap-1.5 hover:bg-gray-alpha-200 transition-colors overflow-hidden rounded-md border px-3 py-1.5",
        className,
      )}
      onClick={handleClick}
    >
      <div className="relative size-4">
        <span
          aria-hidden={true}
          className="absolute top-1/2 translate-y-[-50%] flex items-center justify-center size-4"
        >
          <MdContentPaste
            className={cn("transition-all absolute size-full", {
              "scale-100": !copying,
              "scale-0": copying,
            })}
          />
        </span>
        <span
          aria-hidden={true}
          className="absolute top-1/2 translate-y-[-50%] flex items-center justify-center size-4"
        >
          <IoCheckmark
            className={cn("transition-all absolute size-full", {
              "scale-100": copying,
              "scale-0": !copying,
            })}
          />
        </span>
      </div>
      {children}
    </button>
  );
};

export default Copy;
