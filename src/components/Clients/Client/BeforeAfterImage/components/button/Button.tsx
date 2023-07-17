import { FC, SVGProps } from "react";

export interface NextButtonProps extends Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'className'> {
  loading?: boolean
}

const Button: FC<NextButtonProps> = ({
  children,
  loading = false,
  ...props
}) => {
  return (
    <button {...props} className="px-4 py-2 bg-gray-300 text-sm font-medium hover:bg-gray-400 rounded-xl uppercase text-black duration-150 relative">
      <span className={`${loading && 'opacity-0'}`}>
        {children}
      </span>
      {loading &&
        <span className="text-base left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 absolute">
          <LoaderIcon className="animate-spin" />
        </span>
      }
    </button>
  );
}

export default Button;

const LoaderIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
)