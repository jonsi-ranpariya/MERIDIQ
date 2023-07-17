import { ReactNode } from "react";

export interface CustomShowTextProps {
    icon?: ReactNode
    text?: string
    children?: React.ReactNode,
    className?: string,

}
const CustomShowText: React.FC<CustomShowTextProps> = ({ text, icon, children, className: propClassName, }) => {
    let className = 'flex py-16 justify-center '
    className += propClassName
    return (
        <div className={className}>
            <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-center items-center gap-4">
                    {
                        icon &&
                        <span className=" text-2xl text-gray-500">{icon}</span>
                    }
                    <p className='text-gray-600 dark:text-gray-400 text-center'>{text}</p>
                </div>
                <div className="flex justify-center">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default CustomShowText;