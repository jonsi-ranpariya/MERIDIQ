import { ReactNode } from "react";
import { Link } from "react-router-dom";

export interface AnchorLinkProps {
  variant?: "underline" | "normal",
  to: string,
  children?: ReactNode
}

const RouterLink: React.FC<AnchorLinkProps> = ({
  variant,
  to,
  children,
  ...props
}) => {
  let className = "text-primary dark:text-primaryLight hover:text-black dark:hover:text-white";
  if (variant === "underline") className += "underline transition-all hover:underline-offset-2"

  return (
    <Link to={to} {...props} className={className}>{children}</Link>
  );
}

export default RouterLink;