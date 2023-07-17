import { ReactNode } from "react";
import Error from "./Error";
import Label from "./Label";

export interface TextAreaProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
  className?: string
  label?: ReactNode
  error?: string | false
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className: propClassName,
  ...props
}) => {

  let className = 'form-textarea block py-2.5 px-3.5 w-full rounded-[4px] border-lightPurple dark:border-gray-700 text-dimGray dark:text-white hover:border-mediumGray dark:hover:border-gray-600 bg-white dark:bg-dimGray focus:border-primary focus:ring-1 placeholder:text-mediumGray dark:placeholder:text-gray-600'
  if (error) className += 'border-red-500 text-red-500 focus:text-black '

  return (
    <div className="relative">
      <Label label={label} required={props.required}>
        <div className="relative">
          <textarea
            className={className}
            {...props}
          />
        </div>
      </Label>
      <Error error={error} />
    </div>
  );
}

export default TextArea;