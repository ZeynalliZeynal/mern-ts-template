import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";

interface Button {
  children: ReactNode;
  href?: string;
  size?: "lg" | "md" | "sm";
  rounded?: string;
  full?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  primary?: true;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const Button = ({
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
}: Button) => {
  const [hovering, setHovering] = useState(false);

  const className = `font-medium border select-none ${
    primary
      ? "text-gray-900 border-gray-alpha-400 bg-background-100 data-[highlighted]:text-foreground data-[highlighted]:bg-gray-alpha-200 disabled:bg-gray-100 disabled:text-gray-700 disabled:border-gray-400"
      : "text-gray-500 border-gray-200 bg-gray-1000 data-[highlighted]:text-background-100 data-[highlighted]:bg-button-invert-hover disabled:bg-button-invert-disabled disabled:text-gray-700 disabled:border-gray-400"
  } ${size === "md" ? "px-2.5 h-10 text-sm" : size === "lg" ? "px-3.5 h-12" : "text-sm h-8 px-1.5"} ${full ? "w-full" : "w-fit"} rounded-${rounded}`;

  if (href)
    return (
      <Link
        data-highlighted={hovering ? true : null}
        to={href}
        className={className}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {prefix} <span className="px-1.5">{children}</span> {suffix}
      </Link>
    );
  else
    return (
      <button
        data-highlighted={hovering ? true : null}
        type={type}
        className={className}
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {prefix} <span className="px-1.5">{children}</span> {suffix}
      </button>
    );
};

export default Button;
