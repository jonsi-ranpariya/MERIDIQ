import { Transition } from '@headlessui/react';
import LoadingIcon from '@icons/Loading';
import * as React from 'react';

export interface FullPageLoadingProps {
    show?: boolean
}

export const ModalLoading: React.FC<FullPageLoadingProps> = ({ show = true }) => {
    return (
        <Transition
            show
            className="transition-all fixed inset-0"
            enter="ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            style={{ zIndex: 999 }}
        >
            <div className="fixed inset-0 bg-black dark:bg-white bg-opacity-25 dark:bg-opacity-5 flex justify-center items-center">
                <LoadingIcon className='text-2xl text-primary' />
            </div>
        </Transition>
    );
}

export interface ModalSuspenseProps {
    children: React.ReactNode
}

const ModalSuspense: React.FC<ModalSuspenseProps> = ({
    children
}) => {
    return (
        <React.Suspense fallback={<ModalLoading />}>
            {children}
        </React.Suspense>
    );
}

export default ModalSuspense;