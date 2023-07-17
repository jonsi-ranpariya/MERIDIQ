import React, { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

export interface ButtonProps extends Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'className'> {
  fullWidth?: boolean
  variant?: 'filled' | 'outlined' | 'ghost'
  color?: 'primary' | 'secondary' | 'success' | "ghost"
  loading?: boolean,
  rounded?: boolean
  className?: string,
  size?: "normal" | "small" | "big"
}

const Button: FC<ButtonProps> = ({
  children,
  variant = 'filled',
  color = 'primary',
  size = "normal",
  fullWidth = false,
  loading = false,
  rounded = false,
  className: propClassName,
  ...props
}) => {
  let className = 'relative block outline-none transition-all border border-transparent duration-75 font-medium ring-offset-2 whitespace-nowrap rounded-[4px] focus-visible:ring-2 focus-visible:ring-black disabled:text-gray-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:border-gray-300 dark:disabled:border-dimGray '

  if (size === "big") className += 'px-5 p-2 lg:px-6 lg:p-3 '
  if (size === "normal") className += 'px-5 p-2.5 '
  if (size === "small") className += 'px-3 p-1.5 text-sm '

  if (variant === 'filled') className += 'font-medium border-primary disabled:bg-gray-300 disabled:text-gray-500 active:shadow-inner '
  if (variant === 'filled' && color === 'primary') className += 'bg-primary hover:bg-primary/90 active:bg-primary/80 text-white '
  if (variant === 'filled' && color === 'secondary') className += 'bg-white hover:bg-white/90 active:bg-white text-black '

  if (variant === 'outlined') className += 'border-primary/20 dark:border-gray-800 text-black dark:text-white active:bg-gray-300 hover:bg-gray-200 dark:active:bg-gray-800 dark:hover:bg-dimGray '

  if (variant === 'ghost' && color === "primary") className += 'bg-primary/[12%] text-primary dark:text-primaryLight dark:bg-primaryLight/[15%] hover:bg-primary/20 dark:hover:bg-primaryLight/20 active:bg-primary/30 dark:active:bg-primaryLight/30 '
  if (variant === 'ghost' && color === "success") className += 'bg-green-500/[12%] text-green-600 hover:bg-green-500/20 active:bg-green-500/30 '
  if (variant === 'ghost' && color === "secondary") className += 'bg-gray-500/[12%] text-gray-600 hover:bg-gray-500/20 active:bg-gray-500/30 '
  if (variant === 'ghost' && color === "ghost") className += 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-primary/10 dark:hover:text-primaryLight hover:text-primary active:text-primary active:bg-primary/20 '

  // if (variant === 'ghost_primary') className += 'hover:bg-primary hover:text-white active:text-white active:bg-primary/90 '
  // if (variant === 'outlined_primary') className += 'border text-black hover:text-white active:text-white active:bg-primary hover:bg-primary'

  if (fullWidth) className += 'w-full '
  if (loading) className += '!text-transparent '
  if (rounded) className += 'rounded-full '

  let loaderClassName = 'w-full h-full flex justify-center items-center text-lg absolute top-0 left-0 '
  if (variant === 'filled') loaderClassName += 'text-white '
  if (variant === 'outlined') loaderClassName += 'text-black rounded-full '
  if (variant === 'ghost') loaderClassName += 'text-black rounded-full '

  return (
    <button
      className={className + " " + propClassName}
      {...props}
      disabled={props.disabled || loading}
    >
      {(loading) &&
        <div className={loaderClassName}>
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          {/* <svg  fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> */}
        </div>
      }
      <div className="flex justify-center items-center">
        {children}
      </div>
    </button>
  );
}

export default Button;