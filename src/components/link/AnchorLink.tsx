export interface AnchorLinkProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  variant?: "underline" | "normal"
}

const AnchorLink: React.FC<AnchorLinkProps> = ({
  variant,
  ...props
}) => {
  let className = "text-primary dark:text-primaryLight hover:text-black dark:hover:text-white ";
  if (variant === "underline") className += "underline transition-all hover:underline-offset-2"

  return (
    <a {...props} className={className}>{props.children}</a>
  );
}

export default AnchorLink;