export interface SkeletonProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  variant?: "circular" | "text" | "rectangular"
}

const Skeleton: React.FC<SkeletonProps> = ({
  className: propClassName,
  variant,
  ...props
}) => {
  if (variant === "circular") {
    return <div className={`animate-pulse rounded-full bg-primary/10 block aspect-square ${propClassName}`} {...props}></div>
  }
  return (
    <div className={`animate-pulse rounded bg-primary/10 max-w-full block ${propClassName}`} {...props}></div>
  );
}

export default Skeleton;