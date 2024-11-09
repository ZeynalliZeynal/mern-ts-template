import { cloneElement, isValidElement, ReactNode } from "react";
import { cn } from "@/lib/utils.ts";
import { Link } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi2";

type CommonProps = {
  children: ReactNode;
  className?: string;
};

type BreadcrumbProps = {} & CommonProps;

type BreadcrumbItemProps = {
  asChild?: boolean;
} & CommonProps;

type BreadcrumbLinkProps = {
  href: string;
} & BreadcrumbItemProps;

const Breadcrumb = ({ children, className }: BreadcrumbProps) => {
  return (
    <nav aria-label="breadcrumb" className={cn(className)}>
      {children}
    </nav>
  );
};

const BreadcrumbList = ({
  children,
  className,
  asChild,
}: BreadcrumbItemProps) => {
  return asChild && isValidElement(children) ? (
    cloneElement(children)
  ) : (
    <ol
      className={cn(
        "flex items-center break-words gap-1.5 text-gray-900",
        className,
      )}
    >
      {children}
    </ol>
  );
};

const BreadcrumbItem = ({
  children,
  className,
  asChild,
}: BreadcrumbItemProps) => {
  return asChild && isValidElement(children) ? (
    cloneElement(children)
  ) : (
    <li className={cn("inline-flex items-center gap-1.5", className)}>
      {children}
    </li>
  );
};

const BreadcrumbSeparator = ({ className }: { className?: string }) => {
  return (
    <li
      role="presentation"
      aria-hidden={true}
      className={cn("[&_svg]:size-3.5", className)}
    >
      <HiChevronRight />
    </li>
  );
};

const BreadcrumbLink = ({
  children,
  className,
  asChild,
  href,
}: BreadcrumbLinkProps) => {
  return asChild && isValidElement(children) ? (
    cloneElement(children)
  ) : (
    <Link
      to={href}
      className={cn("transition-colors hover:text-foreground", className)}
    >
      {children}
    </Link>
  );
};

const BreadcrumbPage = ({
  children,
  className,
  asChild,
}: BreadcrumbItemProps) => {
  return (
    <BreadcrumbItem asChild={asChild} className={className}>
      <span
        role="link"
        aria-current="page"
        className="text-foreground"
        aria-disabled={true}
      >
        {children}
      </span>
    </BreadcrumbItem>
  );
};

Breadcrumb.Page = BreadcrumbPage;
Breadcrumb.Link = BreadcrumbLink;
Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Separator = BreadcrumbSeparator;
Breadcrumb.List = BreadcrumbList;
export default Breadcrumb;
