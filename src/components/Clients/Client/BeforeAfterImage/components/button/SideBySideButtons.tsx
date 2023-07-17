import { FC } from "react";

export interface SideBySideButtonsProps {
  children: React.ReactNode
}

const ButtonGroup = ({
  children
}: SideBySideButtonsProps) => {
  return (
    <div className="overflow-hidden flex rounded-xl border border-gray-300">
      {children}
    </div>
  );
}

export interface SideBySideButtonProps extends Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'className'> {
  selected: boolean,
}

const GroupButton: FC<SideBySideButtonProps> = ({
  children,
  selected,
  ...props
}) => {
  return (
    <button {...props} className={`px-4 py-2 text-sm font-medium  uppercase duration-150 relative ${selected ? 'hover:bg-white/10' : 'bg-gray-300 hover:bg-gray-400 text-black'}`}>
      {children}
    </button>
  );
}

ButtonGroup.Button = GroupButton;

export default ButtonGroup;