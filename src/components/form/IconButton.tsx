import { ReactNode } from "react";

export interface IconButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  icon?: ReactNode
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  children,
  className,
  ...props
}) => {
  return (
    <button className={`p-2 inline-block text-xl text-primary dark:text-primaryLight disabled:text-gray-500 hover:bg-primary/10 rounded-full focus-within:ring-1 focus-within:ring-primary/20 hover:ring-4 ring-0 ring-primary/10 hover:ring-primary/10 active:ring-1 transition-all ring-offset-transparent outline-none focus:bg-primary/10 active:bg-primary/50 active:ring-primary/50 ${className}`} {...props}>
      {icon}
      {children}
    </button>
  );
}

export default IconButton;