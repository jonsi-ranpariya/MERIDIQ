import { Dialog, Transition } from '@headlessui/react'
import CancelButton from '@partials/MaterialButton/CancelButton'
import React, { Fragment, ReactNode } from 'react'
import strings from '../../lang/Lang'

interface DeleteProps {
    open?: boolean,
    handleClose?: () => void,
    text: string,
    icon?: ReactNode,
    submitButton?: ReactNode,
    children?: ReactNode,
    closeOnBackdropClick?: boolean
}

const DeleteModal: React.FC<DeleteProps> = ({ open = false, handleClose = () => { }, children, text, icon, submitButton = <></>, closeOnBackdropClick = false }) => {

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-[999]" onClose={closeOnBackdropClick ? handleClose : () => { }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black dark:bg-white bg-opacity-25 dark:bg-opacity-5" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`w-11/12 max-w-lg relative transform rounded-2xl bg-white dark:bg-black text-left align-middle shadow-xl transition-all `}>
                                <div className="p-6 text-center break-all">
                                    <div className="text-5xl inline-block mb-4">
                                        {icon}
                                    </div>
                                    <h2 className="">{text}</h2>
                                </div>
                                <div className="">
                                    {children}
                                </div>
                                <div className="grid grid-cols-2 p-4 gap-4 ">
                                    <CancelButton
                                        fullWidth
                                        onClick={handleClose}
                                    >{strings.Cancel}
                                    </CancelButton>
                                    {submitButton}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default DeleteModal
