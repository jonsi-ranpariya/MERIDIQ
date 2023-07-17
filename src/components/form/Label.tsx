import { FC, ReactNode } from "react";

export interface LabelProps {
  label?: ReactNode
  suffix?: ReactNode
  required?: boolean
  children?: ReactNode
  className?: string
}

const Label: FC<LabelProps> = ({
  label,
  suffix,
  className,
  required = false,
  children
}) => {
  return (
    <label className="relative">
      <p className={`text-dimGray dark:text-gray-400 font-normal text-sm ${className}`}>
        {label}
        {suffix && <span>{suffix}</span>}
        {(label && required) && <span className="text-error">*</span>}
      </p>
      {children}
    </label>
  );
}

export default Label;