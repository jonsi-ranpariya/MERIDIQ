import { ButtonProps } from "@components/form/Button";
import { FC, memo, ReactNode } from "react";

export interface CanvasEditingButtonProps extends ButtonProps {
  icon: ReactNode,
  text: string,
  active?: boolean,
}

const CanvasEditingButton: FC<CanvasEditingButtonProps> = ({
  icon,
  text = "",
  active = false,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`${active && "bg-primary/20"} dark:text-black h-8 w-8 rounded-full flex justify-center items-center`}
    >
      {icon}
    </button>
  );
}

export default memo(CanvasEditingButton);