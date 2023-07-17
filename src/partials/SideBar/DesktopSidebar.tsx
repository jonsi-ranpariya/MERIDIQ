import { FC } from "react";
import useSideBar from "../../hooks/useSideBar";
import SidebarContent from "./SidebarContent";

export interface DesktopSidebarProps {

}

const DesktopSidebar: FC<DesktopSidebarProps> = () => {
  const { sideBarSticked } = useSideBar();

  return (
    <div className={`bg-white dark:bg-dimGray hidden lg:block desktop-sidebar overflow-y-auto shadow fixed top-0 bottom-0 left-0 z-50 ${sideBarSticked && 'sticked'}`}>
      <SidebarContent />
    </div>
  );
}

export default DesktopSidebar;