import { FC, ReactNode } from "react";

export interface CardProps {
  children: ReactNode
}

const Card: FC<CardProps> = ({
  children
}) => {
  return (
    <div className='container shadow rounded-md mx-auto h-full p-6 text-center bg-[#1E1E1E]'>
      {children}
    </div>
  );
}

export default Card;