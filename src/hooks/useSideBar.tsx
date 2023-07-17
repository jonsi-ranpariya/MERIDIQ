import { useContext } from "react";
import { SideBarContext } from "../provider/SideBarProvider";

export default function useSideBar() {
    const context = useContext(SideBarContext);

    return context;
}