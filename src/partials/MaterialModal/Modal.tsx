import { Dialog, Transition } from '@headlessui/react'
import LoadingIcon from '@icons/Loading'
import React, { Fragment } from 'react'
import CloseIcon from '../Icons/Close'

export interface MaterialModalProps {
    open?: boolean,
    handleClose?: () => void,
    children?: React.ReactNode,
    title?: string,
    loading?: boolean
    cancelButton?: React.ReactNode
    submitButton?: React.ReactNode
    hideCloseButton?: boolean
    closeOnBackdropClick?: boolean
    size?: 'small' | 'medium' | 'large'
}

const Modal: React.FC<MaterialModalProps> = ({
    open = false, handleClose = () => { }, size = 'small', children, loading, title, cancelButton, submitButton, hideCloseButton = false,
    closeOnBackdropClick = false,
}) => {

    return (
        <Transition
            appear
            show={open}
            as={Fragment}
            afterLeave={() => document.documentElement.removeAttribute("style")}
        >
            <Dialog as="div" className="relative z-[999]" onClose={closeOnBackdropClick ? handleClose : () => { }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-75"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Backdrop className="fixed inset-0 bg-black dark:bg-white bg-opacity-25 dark:bg-opacity-5 z-[998]" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto modal-scrollable-element">
                    <div className="flex min-h-full items-center justify-center py-8 px-5 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className={`w-full relative transform rounded-2xl bg-white dark:bg-black text-left align-middle shadow-xl transition-all ${size === 'small' ? 'max-w-xl' : ''} ${size === 'medium' ? 'max-w-2xl' : ''} ${size === 'large' ? 'max-w-4xl' : ''}`}>
                                {
                                    !hideCloseButton &&
                                    <button onClick={handleClose} className="absolute z-10 rounded-full bg-white dark:bg-dimGray hover:bg-gray-100 dark:hover:bg-gray-800 -right-4 -top-4 text-4xl cursor-pointer">
                                        <CloseIcon className='p-2' />
                                    </button>
                                }
                                {title &&
                                    <Dialog.Title as="h3" className="text-lg flex relative justify-center items-center space-x-2 pt-6 font-semibold text-center">
                                        <span className='relative flex items-center'>
                                            {title}
                                            {loading && <LoadingIcon className='text-primary absolute -right-6' />}
                                        </span>
                                    </Dialog.Title>
                                }

                                <div className="mt-2">
                                    {children}
                                </div>

                                {(cancelButton || submitButton) && !(cancelButton && submitButton)
                                    ? <div className="p-4 flex justify-center border-t dark:border-dimGray">
                                        {cancelButton && <span className='col-span-2 col-start-2'>{cancelButton}</span>}
                                        {submitButton && <span className='col-span-2 col-start-2'>{submitButton}</span>}
                                    </div>
                                    : <></>}

                                {cancelButton && submitButton
                                    ? <div className="grid grid-cols-2 p-4 gap-4 border-t dark:border-dimGray">
                                        {cancelButton}
                                        {submitButton}
                                    </div>
                                    : <></>}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Modal
