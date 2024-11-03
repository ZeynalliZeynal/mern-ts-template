import {
  forwardRef,
  MouseEventHandler,
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
  onClick?: MouseEventHandler<HTMLButtonElement>;
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
      ...props
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
      `flex items-center justify-center transition font-medium border select-none rounded-${rounded}`,
      {
        "text-gray-900 border-gray-alpha-400 bg-background-100 data-[highlighted]:text-foreground data-[highlighted]:bg-gray-alpha-200 disabled:bg-gray-100 disabled:text-gray-700 disabled:border-gray-400":
          primary,
        "text-gray-500 border-gray-200 bg-gray-1000 data-[highlighted]:text-background-100 data-[highlighted]:bg-button-invert-hover disabled:bg-button-invert-disabled disabled:text-gray-700 disabled:border-gray-400":
          !primary,
        "px-2.5 h-10 text-sm": size === "md",
        "px-3.5 h-12": size === "lg",
        "text-sm h-8 px-1.5": size === "sm",
        "w-full": full,
        "w-fit": !full,
      },
      className,
    );

    if (href)
      return (
        <Link
          ref={ref as MutableRefObject<HTMLAnchorElement>}
          data-highlighted={hovering ? true : null}
          to={href}
          className={cl}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          {...props}
        >
          {prefix} <span className="px-1.5">{children}</span> {suffix}
        </Link>
      );
    else
      return (
        <button
          ref={ref as MutableRefObject<HTMLButtonElement>}
          data-highlighted={hovering ? true : null}
          type={type}
          className={cl}
          onClick={onClick}
          disabled={disabled}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          {...props}
        >
          {prefix} <span className="px-1.5">{children}</span> {suffix}
        </button>
      );
  },
);

export default Button;
