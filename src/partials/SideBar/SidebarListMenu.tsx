import { Menu, Transition } from "@headlessui/react";
import useSideBar from "@hooks/useSideBar";
import { NavLink, useLocation } from "react-router-dom";

export interface SidebarMenuProps {
  text: string,
  show?: boolean,
  children?: React.ReactNode,
  icon?: React.ReactNode,
  navLinkTo?: string,
  items: SidebarMenuItemsProps[]
}

export interface SidebarMenuItemsProps {
  text: string
  navLinkTo?: string
}

const SidebarListMenu: React.FC<SidebarMenuProps> = ({
  show = true,
  text,
  icon,
  navLinkTo = "/",
  items,
}) => {

  const { setMobileShow, sideBarSticked } = useSideBar();
  const location = useLocation();
  // const navigate = useNavigate()
  const match = navLinkTo === "/" ? location.pathname === "/" : location.pathname.includes(navLinkTo)

  if (!show) {
    return <></>;
  }

  return (
    <Menu as="div" className="w-full relative overflow-hidden">
      <Menu.Button className="relative pl-2 pr-3 w-full sidebar-item-parent">
        {({ open }) => {
          return (
            <>
              {match && <span className="w-1 bg-primary dark:bg-primaryLight absolute right-0 top-0 h-full rounded-l-full" />}
              <div
                key={`side_bar_button_${text}`}
                className={`flex transition-all space-x-3.5 items-center sidebar-item w-full rounded-lg  
                ${match
                    ? "text-primary dark:text-primaryLight font-semibold bg-primary/[16%] hover:bg-primary/20 active:bg-primary/[16%]"
                    : "text-dimGray dark:text-gray-400 hover:bg-purpleGray dark:hover:bg-primaryLight/10"}
                `}
              >
                <div className={`icon text-2xl ${sideBarSticked ? '' : ''} ${match ? '' : 'text-mediumGray dark:text-gray-400'}`}>
                  {icon}
                </div>
                <div className={`text flex-grow text-left sidebar-item-text`} >
                  {text}
                </div>
                <div className={`icon text-xl transition-all sidebar-item-chevron ${match || open ? 'rotate-0 opacity-80' : 'rotate-180 opacity-30'}`}>
                  <svg className={`w-2.5`} viewBox="0 0 10 6" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.76117 5.71436L5 2.26941L1.23883 5.71436L0 4.57968L5 6.96182e-05L10 4.57968L8.76117 5.71436Z" />
                  </svg>
                </div>
              </div>
            </>
          )
        }}
      </Menu.Button>
      <Transition
        show={match ? match : undefined}
        className="ease-out transition-all origin-top sidebar-item-items"
        enter="duration-300"
        enterFrom="max-h-0"
        enterTo="max-h-40"
        leave="duration-150"
        leaveFrom="max-h-40"
        leaveTo="max-h-0"
      >
        <Menu.Items>

          {items.map((item) => {
            const matchInside = location.pathname === item.navLinkTo;
            return (
              <Menu.Item key={item.text} as="div" className={`sidebar-menu-item space-y-1 pl-[50px] pr-3 text-left`}>
                <NavLink
                  to={item.navLinkTo ?? '/'}
                  className={`block ${matchInside ? 'text-primary dark:text-primaryLight font-medium' : 'dark:text-gray-400'} transition-all text-left px-4 py-2 rounded-md w-full hover:bg-purpleGray dark:hover:bg-primary/10 active:bg-primary/10`}
                  onClick={() => setMobileShow(false)}
                >
                  {item.text}
                </NavLink>
              </Menu.Item>
            )
          })}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default SidebarListMenu;