import Card from "@components/card";
import CustomTabs from "@components/form/CustomTabs";
import Heading from "@components/heading/Heading";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useLocalStorage from "../../hooks/useLocalStorage";
import useTranslation from "../../hooks/useTranslation";
import strings from "../../lang/Lang";
import CompanyDetails from "../CompanySettings/CompanyDetails";
import CompanyInvoices from "../CompanySettings/Invoices/CompanyInvoices";
import SystemSettings from "./CompanySettings";

export interface SettingsProps {
}

const settingsRoutes = [
    '/settings/system-settings',
    '/settings/company-information',
    '/settings/billing',
]

const Settings: React.FC<SettingsProps> = () => {
    useTranslation();
    const { getStoredValue: tab, setStorageValue: setTab } = useLocalStorage<number | null>('setting_tab_index', 0);
    const { pathname } = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (pathname === settingsRoutes[0]) setTab(0)
        if (pathname === settingsRoutes[1]) setTab(1)
        if (pathname === settingsRoutes[2]) setTab(2)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])

    const { user } = useAuth()
    const isSuperUser = user?.email === user?.company?.email;

    const tabs = [
        { text: strings.systemSettings, Component: <SystemSettings /> },
        ...(isSuperUser ? [{ text: strings.companyInformation, Component: <CompanyDetails /> }] : []),
        ...(isSuperUser ? [{ text: strings.billing, Component: <CompanyInvoices /> }] : [])
    ]

    function onTabChange(index: number) {
        if (tab === null || tab === index) setTab(tab !== null ? null : index)
        navigate(settingsRoutes[index])
    }

    return (
        <>
            <Heading text={strings.Settings} variant="bigTitle" className="mb-4" />
            <Card className="p-2">
                <CustomTabs
                    tabs={tabs}
                    onChange={onTabChange}
                    selectedIndex={tab}
                />
            </Card>
        </>
    );
}

export default Settings;