import Card from "@components/card";
import Button from "@components/form/Button";
import CustomTabs from "@components/form/CustomTabs";
import Heading from "@components/heading/Heading";
import RegPortalQuestionner from "@components/Settings/Questionnaires/RegPortalQuestionner";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../configs/api";
import useAuth from "../../hooks/useAuth";
import useLocalStorage from "../../hooks/useLocalStorage";
import useTranslation from "../../hooks/useTranslation";
import strings from "../../lang/Lang";
import RegistrationPortalSetting from "../Settings/RegistrationPortalSetting";
import RegistrationPortalStart from "./RegistrationPortalStart";


export interface RegistrationPortalInfoProps {

}

const regPortalRoutes = [
    '/registration-portal/mandatory-fields',
    '/registration-portal/questionnaire',
]

const RegistrationPortalInfo: React.FC<RegistrationPortalInfoProps> = () => {

    const { getStoredValue: tab, setStorageValue: setTab } = useLocalStorage<number | null>('registration_portal_tab_index', 0);
    const { user } = useAuth();
    const [language] = useTranslation();
    const { pathname } = useLocation()
    const navigate = useNavigate()

    const PortalUrl = `${process.env.PUBLIC_URL || ''}/registration/${user?.company?.encrypted_id.toString()}?lang=${language}`;

    const requestRedirect = window.location.search.split('redirect=')[1];

    useEffect(() => {
        if (user && requestRedirect && PortalUrl) {
            window.location.href = PortalUrl;
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (pathname === regPortalRoutes[0]) setTab(0)
        if (pathname === regPortalRoutes[1]) setTab(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname])


    const isAdmin = user?.user_role === api.adminRole;

    const tabs = useMemo(() =>
        [
            { text: strings.mandatoryFields, Component: <RegistrationPortalSetting /> },
            ...(isAdmin ? [{ text: strings.Questionnaire, Component: <RegPortalQuestionner /> }] : [])
        ]
        , [isAdmin]);

    function onTabChange(index: number) {
        if (tab === null || tab === index) setTab(tab !== null ? null : index)
        navigate(regPortalRoutes[index])
    }

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
                <Heading text={requestRedirect ? `${strings.Redirecting}...` : strings.RegistrationPortal} />
                <Button onClick={() => window.open(PortalUrl)} size="small">
                    {strings.reviewPortal}
                </Button>
            </div>

            <Card className="mb-6">
                <RegistrationPortalStart />
            </Card>

            {
                isAdmin &&
                <Card className="p-2">
                    <CustomTabs
                        tabs={tabs}
                        onChange={onTabChange}
                        selectedIndex={tab}
                    />
                </Card>
            }
        </div>
    );
}

export default RegistrationPortalInfo;