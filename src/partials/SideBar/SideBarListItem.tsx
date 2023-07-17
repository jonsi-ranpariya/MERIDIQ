import * as React from 'react';
import { NavLink, useLocation } from "react-router-dom";
import useSideBar from "../../hooks/useSideBar";

export interface SideBarListItemProps {
    text: string,
    show?: boolean,
    children?: React.ReactNode,
    icon?: React.ReactNode,
    selected?: boolean,
    navLinkTo?: string,
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void,
    setOpen?: () => void
}

const SideBarListItem: React.FC<SideBarListItemProps> = ({
    children,
    show = true,
    text,
    selected = false,
    icon,
    setOpen = () => {},
    navLinkTo = "",
    onClick = () => {},
}) => {
    const { setMobileShow, sideBarSticked } = useSideBar();
    const location = useLocation();
    const match = ["/", "/admin"].includes(navLinkTo) ? ["/", "/admin"].includes(location.pathname) : location.pathname.includes(navLinkTo)

    if (!show) {
        return <></>;
    }

    return (
        <div className="relative pl-2 pr-3 sidebar-item-parent">
            {match && <span className="w-1 bg-primary dark:bg-primaryLight absolute right-0 top-0 h-full rounded-l-full" />}
            <NavLink
                to={navLinkTo}
                key={`side_bar_button_${text}`}
                className={`flex transition-all space-x-3.5 items-center sidebar-item w-full rounded-lg 
                ${match
                        ? "text-primary dark:text-primaryLight font-semibold bg-primary/[16%] hover:bg-primary/20 active:bg-primary/[16%]"
                        : "text-dimGray dark:text-gray-400 hover:bg-purpleGray dark:hover:bg-primaryLight/10"}
                `}
                onClick={event => {
                    onClick(event);
                    setOpen();
                    setMobileShow(false);
                }}
            >
                <div className={`icon text-2xl ${sideBarSticked ? '' : ''} ${match ? '' : 'text-mediumGray dark:text-inherit'}`}>
                    {icon}
                </div>
                <div className={`text flex-grow text-left sidebar-item-text ${sideBarSticked ? 'hidden' : 'block'}`} >
                    {text}
                </div>
            </NavLink>
        </div >
    );

}

export default React.memo(SideBarListItem);