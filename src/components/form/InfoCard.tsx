export interface InfoCardProps {
  variant?: "error" | "warning" | "success"
  message?: string | boolean
}

const InfoCard: React.FC<InfoCardProps> = ({
  variant = "error",
  message
}) => {
  if (!message) return <></>
  let className = "px-4 py-3 rounded-md bg-opacity-10  ";
  if (variant === "success") className += "bg-primary text-primary "
  if (variant === "error") className += "bg-error text-error "
  if (variant === "warning") className += "bg-amber-500 text-amber-600 "

  return (
    <div className={`${className} break-all`}>
      <p className="text-sm">{message}</p>
    </div>
  );
}

export default InfoCard;