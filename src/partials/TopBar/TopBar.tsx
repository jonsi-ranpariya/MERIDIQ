
import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import useSideBar from "../../hooks/useSideBar";
import MenuIcon from "../Icons/Menu";
import TopBarProfile from "./TopBarProfile";
import TopBarSearch from "./TopBarSearch";

export interface TopBarProps {

}

const TopBar: React.FC<TopBarProps> = () => {

    const { setMobileShow, sideBarSticked } = useSideBar();
    const { user } = useAuth();

    useEffect(() => {
        function onScroll() {
            if (window.scrollY > 2) {
                document.getElementById("top_bar_with_bg")?.classList.add("scrolled")
            } else {
                document.getElementById("top_bar_with_bg")?.classList.remove("scrolled")
            }
        }
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener('scroll', onScroll);
    }, [])

    return (
        <div id="top_bar_with_bg" className={`w-full flex items-center transition-all duration-75 fixed z-50 bg-white dark:bg-dimGray lg:bg-transparent dark:lg:bg-transparent topbar h-16 md:h-auto ${sideBarSticked ? 'pl-0 lg:pl-14' : 'lg:pl-72'}`}>
            <div className="px-4 py-3 w-full flex justify-between" style={{ flexFlow: 'row', flexShrink: 0 }}>
                <div className="flex items-center justify-start flex-grow max-w-lg">
                    <span className="block lg:hidden cursor-pointer -ml-3 px-3 py-2" onClick={() => setMobileShow(val => !val)}>
                        <MenuIcon className="text-xl" />
                    </span>
                    {user?.user_role === 'master_admin' ? '' : <TopBarSearch />}
                </div>
                <TopBarProfile />
            </div>
        </div>
    );
}

export default TopBar;