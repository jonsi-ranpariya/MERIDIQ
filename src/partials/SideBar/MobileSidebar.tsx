import { Transition } from "@headlessui/react";


import { FC } from "react";
import useSideBar from "../../hooks/useSideBar";
import SidebarContent from "./SidebarContent";

export interface MobileSidebarProps {

}

const MobileSidebar: FC<MobileSidebarProps> = () => {
  const { mobileShow, setMobileShow } = useSideBar();

  return (
    <Transition show={mobileShow} key="mobile_sidebar" className="fixed mobile-sidebar inset-0 z-[999]">
      {/* Sidebar */}
      <Transition.Child
        key="sidebar"
        className="transition-all w-full h-full max-w-[80%] sm:max-w-xs bg-white dark:bg-dimGray absolute top-0 z-[999] overflow-y-auto"
        enter="ease duration-300"
        enterFrom="-left-full"
        enterTo="left-0"
        leave="ease-out duration-500"
        leaveFrom="left-0"
        leaveTo="-left-full"
      >
        <SidebarContent />
      </Transition.Child>

      {/* Backdrop */}
      <Transition.Child
        key="backdrop"
        className="bg-black/20 dark:bg-white dark:bg-opacity-5 fixed inset-0 z-[995]"
        enter="transition-opacity ease-linear duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-linear duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        onClick={() => setMobileShow(val => !val)}
      >
      </Transition.Child>
    </Transition>
  );
}

export default MobileSidebar;