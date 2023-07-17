import Button from "@components/form/Button";
import { Dialog, Transition } from "@headlessui/react";
import strings from "@lang/Lang";
import { Fragment } from "react";

export interface MobileFilterWrapperProps {
  show?: boolean
  onSubmit?: () => void
  onCancel?: () => void
  children: React.ReactNode
}

const MobileFilterWrapper: React.FC<MobileFilterWrapperProps> = ({
  show = false,
  onSubmit,
  children
}) => {
  return (
    <Transition
      show={show}
      appear
      as={Fragment}
    >
      <Dialog onClose={() => {}}>
        <Transition.Child
          className="fixed top-16 z-50 inset-0 bg-white dark:bg-black p-6 transform transition-all"
          enterFrom='translate-x-full'
          enterTo='translate-x-0'
          leaveFrom='translate-x-0'
          leaveTo='translate-x-full'
        >
          <div className="max-w-md flex flex-col h-full mx-auto">

            <p className='text-lg font-medium mb-2'>{strings.filter}</p>
            <div className="flex-grow grid gap-4 grid-cols-1 place-content-start">
              {children}
            </div>
            <div className="flex space-x-6">
              <Button
                fullWidth
                onClick={onSubmit}
              >
                {strings.Submit}
              </Button>
            </div>
          </div>

        </Transition.Child>

      </Dialog>
    </Transition>
  );
}

export default MobileFilterWrapper;