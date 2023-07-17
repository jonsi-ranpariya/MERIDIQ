import { Popover, Transition } from '@headlessui/react';
import DownIcon from "@partials/Icons/Down";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes, ReactNode } from "react";
import Label from "./Label";

export interface ColorProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    label?: string
    children?: ReactNode,
    value?: string
}

const Color = ({
    label,
    children,
    value,
    ...props
}: ColorProps, ref: any) => {


    return (
        <div className="relative">
            <Label label={label} required={props.required}>
                <div className="relative">
                    <Popover>
                        <Popover.Button
                            className="w-full form-input py-2.5 px-3.5 rounded-[4px] border-lightPurple dark:border-gray-700 text-dimGray dark:text-white hover:border-mediumGray dark:hover:border-gray-600 bg-white dark:bg-dimGray focus:border-primary focus:ring-1 placeholder:text-mediumGray dark:placeholder:text-gray-600 "
                        >
                            {value}
                            <div className="absolute top-3.5  right-2.5"><DownIcon /></div>
                        </Popover.Button>
                        <Transition
                            key={"Template_Modal"}
                            className="absolute w-full bg-white dark:bg-dimGray z-50 shadow-card rounded-md mt-2"
                            enter="transition-all duration-300"
                            enterFrom="top-[90%] opacity-0"
                            enterTo="top-full opacity-100"
                            leave="transition-all ease-out duration-75"
                            leaveFrom="top-full opacity-100"
                            leaveTo="top-[90%] opacity-0"
                        >
                            <Popover.Panel>
                                {children}
                            </Popover.Panel>
                        </Transition>
                    </Popover>
                </div>
            </Label>
        </div>
    );
}

export default forwardRef(Color);
