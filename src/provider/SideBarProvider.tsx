import * as React from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface SideBarProps {
    children?: React.ReactNode,
}

export const SideBarContext = React.createContext<{
    mobileShow: boolean,
    sideBarSticked: boolean,
    setMobileShow: React.Dispatch<React.SetStateAction<boolean>>,
    setSideBarSticked: React.Dispatch<React.SetStateAction<boolean>>,
}>({
    mobileShow: false,
    sideBarSticked: false,
    setMobileShow: () => {},
    setSideBarSticked: () => {},
});

export const SideBarProvider: React.FC<SideBarProps> = ({ children }) => {
    const [mobileShow, setMobileShow] = React.useState(false);
    const { storedValue: storedSideBarSticked, setStorageValue: setStoredSideBarSticked } = useLocalStorage('sidebar_sticked', false);
    const [sideBarSticked, setSideBarSticked] = React.useState(storedSideBarSticked ?? false);

    React.useEffect(() => {
        if (mobileShow && sideBarSticked) {
            setSideBarSticked(false);
        }
        if (storedSideBarSticked !== sideBarSticked) {
            setStoredSideBarSticked(sideBarSticked);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mobileShow, sideBarSticked])

    return (
        <SideBarContext.Provider value={{ mobileShow, setMobileShow, sideBarSticked, setSideBarSticked }}>
            {children}
        </SideBarContext.Provider>
    );
}
