export interface TipTapMenuButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  active?: boolean
}


const TipTapMenuButton: React.FC<TipTapMenuButtonProps> = ({
  children,
  className,
  disabled,
  active: a = false,
  ...props
}) => {
  const active = className === "is-active" || a

  return (
    <button
      className={`
        min-w-[2rem]
        min-h-[2rem]
        flex items-center justify-center
        ${active ? "bg-primary text-white hover:bg-primary/90 dark:bg-primaryLight dark:text-black dark:hover:bg-primaryLight/80" : 'hover:bg-gray-200 dark:hover:bg-gray-700'}
        rounded-md
        disabled:text-gray-400
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default TipTapMenuButton;