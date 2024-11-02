import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  size?: "lg" | "md" | "sm";
  rounded?: string;
  full?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  primary?: true;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
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

    const className = `flex items-center justify-center transition font-medium border select-none ${
      primary
        ? "text-gray-900 border-gray-alpha-400 bg-background-100 data-[highlighted]:text-foreground data-[highlighted]:bg-gray-alpha-200 disabled:bg-gray-100 disabled:text-gray-700 disabled:border-gray-400"
        : "text-gray-500 border-gray-200 bg-gray-1000 data-[highlighted]:text-background-100 data-[highlighted]:bg-button-invert-hover disabled:bg-button-invert-disabled disabled:text-gray-700 disabled:border-gray-400"
    } ${size === "md" ? "px-2.5 h-10 text-sm" : size === "lg" ? "px-3.5 h-12" : "text-sm h-8 px-1.5"} ${full ? "w-full" : "w-fit"} rounded-${rounded}`;

    if (href)
      return (
        <Link
          ref={ref as MutableRefObject<HTMLAnchorElement>}
          data-highlighted={hovering ? true : null}
          to={href}
          className={className}
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
          className={className}
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
