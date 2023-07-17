export interface CardProps {
  children?: React.ReactNode,
  className?: string
}

const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={`p-4 bg-white dark:bg-dimGray rounded-xl  ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;