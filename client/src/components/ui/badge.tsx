import { cn } from "@/lib/utils.ts";
import { cloneElement, ReactElement, ReactNode } from "react";

type Styles =
  | "gray"
  | "gray-subtle"
  | "blue"
  | "blue-subtle"
  | "purple"
  | "purple-subtle"
  | "amber"
  | "amber-subtle"
  | "red"
  | "red-subtle"
  | "pink"
  | "pink-subtle"
  | "green"
  | "green-subtle"
  | "teal"
  | "teal-subtle";

export default function Badge({
  size = "sm",
  icon,
  style = "gray-subtle",
  children,
}: {
  size?: "sm" | "md" | "lg";
  icon?: ReactElement;
  style?: Styles;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "rounded-full inline-flex items-center w-max justify-center gap-1.5 select-none",
        {
          "h-5 px-1.5 text-[10px]": size === "sm",
          "h-6 px-2.5 text-xs": size === "md",
          "h-8 px-3 text-sm": size === "lg",
          "bg-gray-700 text-gray-50": style === "gray",
          "bg-gray-200 text-gray-1000": style === "gray-subtle",
          "bg-blue-700 text-blue-50": style === "blue",
          "bg-blue-200 text-blue-900": style === "blue-subtle",
          "bg-purple-700 text-purple-50": style === "purple",
          "bg-purple-200 text-purple-900": style === "purple-subtle",
          "bg-amber-700 text-amber-50": style === "amber",
          "bg-amber-200 text-amber-900": style === "amber-subtle",
          "bg-red-700 text-red-50": style === "red",
          "bg-red-200 text-red-900": style === "red-subtle",
          "bg-pink-700 text-pink-50": style === "pink",
          "bg-pink-200 text-pink-900": style === "pink-subtle",
          "bg-green-700 text-green-50": style === "green",
          "bg-green-200 text-green-900": style === "green-subtle",
          "bg-teal-700 text-teal-50": style === "teal",
          "bg-teal-200 text-teal-900": style === "teal-subtle",
        },
      )}
    >
      {icon &&
        cloneElement(icon, {
          className: cn({
            "size-4": size === "lg",
            "size-3.5": size === "md",
            "size-3": size === "sm",
          }),
        })}
      {children}
    </span>
  );
}
