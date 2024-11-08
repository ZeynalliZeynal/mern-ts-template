import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils.ts";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  size?: "lg" | "md" | "sm";
  rounded?: string;
  full?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  primary?: true;
  onClick?: (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => void | Promise<void>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      size = "md",
      full = false,
      href,
      prefix = null,
      suffix = null,
      primary,
      onClick,
      disabled,
      rounded = "md",
      type = "button",
      className,
      ...etc
    },
    forwardRef,
  ) => {
    const [hovering, setHovering] = useState(false);
    const ref = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
    useImperativeHandle(
      forwardRef,
      () => ref.current as HTMLButtonElement | HTMLAnchorElement,
    );
    const cl = cn(
      `flex items-center justify-center transition duration-200 font-medium border select-none rounded-${rounded}`,
      {
        "text-gray-900 border bg-background-100": primary,
        "text-gray-500 border-gray-200 bg-gray-1000": !primary,
        "px-2.5 h-10 text-sm": size === "md",
        "px-3.5 h-12": size === "lg",
        "text-sm h-8 px-1.5": size === "sm",
        "w-full": full,
        "w-fit": !full,
        "data-[highlighted]:text-foreground data-[highlighted]:bg-gray-alpha-200":
          primary && hovering,
        "disabled:text-gray-700 disabled:bg-gray-100 disabled:border-gray-400":
          primary && disabled,
        "data-[highlighted]:text-background-100 data-[highlighted]:bg-button-invert-hover":
          !primary && hovering,
        "disabled:bg-button-invert-disabled disabled:text-gray-700 disabled:border-gray-400":
          !primary && disabled,
      },
      className,
    );
    const commonAttributed = {
      "data-highlighted": !disabled && hovering ? true : null,
      className: cl,
      onMouseEnter: () => !disabled && setHovering(true),
      onMouseLeave: () => !disabled && setHovering(false),
    };

    if (href)
      return (
        <Link
          ref={ref as MutableRefObject<HTMLAnchorElement>}
          to={href}
          {...commonAttributed}
          {...etc}
        >
          {prefix} <span className="px-1.5">{children}</span> {suffix}
        </Link>
      );
    else
      return (
        <button
          ref={ref as MutableRefObject<HTMLButtonElement>}
          type={type}
          onClick={onClick}
          disabled={disabled}
          {...commonAttributed}
          {...etc}
        >
          {prefix} <span className="px-1.5">{children}</span> {suffix}
        </button>
      );
  },
);

export default Button;
