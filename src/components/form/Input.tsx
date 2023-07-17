import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, ReactNode } from "react";
import Error from "./Error";
import Label from "./Label";

export interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  className?: string
  label?: ReactNode
  icon?: ReactNode
  error?: string | false
  suffix?: ReactNode
  suffixButton?: ReactNode
  onSuffixClick?: () => void
}

const Input = ({
  label,
  icon,
  error,
  className: propClassName,
  suffix,
  suffixButton,
  onSuffixClick,
  ...props
}: InputProps, ref: any) => {
  let className = 'form-input block py-2.5 px-3.5 w-full rounded-[4px] border-lightPurple dark:border-gray-700 text-dimGray dark:text-white hover:border-mediumGray dark:hover:border-gray-600 bg-white dark:bg-dimGray focus:border-primary dark:focus:border-primaryLight focus:ring-1 placeholder:text-mediumGray dark:placeholder:text-gray-600 '
  if (icon) className += 'pl-10 '
  if (error) className += 'border-red-500 text-red-500 focus:text-black '
  className += propClassName

  return (
    <div className="relative">
      <Label label={label} required={props.required}>
        <div className="relative">
          {
            icon &&
            <span className="absolute touch-none pointer-events-none inset-0 flex items-center pl-3 text-xl text-gray-500">{icon}</span>
          }
          <input
            className={className}
            ref={ref}
            {...props}
          />
          {
            suffix &&
            <span className="absolute touch-none pointer-events-none inset-0 flex justify-end items-center pr-2">
              <button
                onClick={onSuffixClick}
                className="text-sm touch-auto pointer-events-auto rounded-md px-2 py-1 text-primary dark:text-primaryLight font-medium hover:bg-gray-200 dark:hover:bg-gray-700 active:bg-gray-50 dark:active:bg-gray-600 transition-all"
              >
                {suffix}
              </button>
            </span>
          }
          {
            suffixButton &&
            <span className="absolute touch-none pointer-events-none inset-0 flex justify-end items-center pr-2">
              {suffixButton}
            </span>
          }
        </div>
      </Label>
      <Error error={error} />
    </div>
  );
}

export default forwardRef(Input);