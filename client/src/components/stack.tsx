import { ReactNode } from "react";
import { AlignItems, JustifyContent } from "@/types/style.ts";

interface Stack {
  children: ReactNode;
  align?: AlignItems;
  justify?: JustifyContent;
  direction?: "row" | "column";
  gap?: number;
  padding?: number;
}

export default function Stack({
  children,
  align = "stretch",
  justify = "flex-start",
  direction = "column",
  gap = 4,
  padding = 0,
}: Stack) {
  return (
    <div
      style={{
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        padding: padding * 4 + "px",
        gap: gap * 4 + "px",
      }}
    >
      {children}
    </div>
  );
}
