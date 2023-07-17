import * as React from 'react';
import DesktopSidebar from "./DesktopSidebar";
import MobileSidebar from "./MobileSidebar";

export interface SideBarProps {
}

const SideBar: React.FC<SideBarProps> = () => {
    return (
        <>
            <MobileSidebar />
            <DesktopSidebar />
        </>
    );
}

export default SideBar;