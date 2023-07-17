import api from "@configs/api";
import useAuth from "@hooks/useAuth";
import BuildingIcon from "@icons/Building";
import ClientsIcon from "@icons/Clients";
import CogIcon from "@icons/Cog";
import DollarIcon from "@icons/Dollar";
import HelpIcon from "@icons/Help";
import HomeIcon from "@icons/Home";
import LocIcon from "@icons/LoC";
import QuestionnerIcon from "@icons/Questionner";
import RecommendIcon from "@icons/Recommend";
import TemplateIcon from "@icons/Template";
import UserIcon from "@icons/User";
import OfficeIcon from "@partials/Icons/Office";
import ReportIcon from "@partials/Icons/Report";
import * as React from "react";
import { useLocation } from "react-router-dom";
import strings from "../../lang/Lang";

import SideBarListItem from "./SideBarListItem";
import SidebarListMenu from "./SidebarListMenu";

export interface SideBarListProps {
    sideBarSticked: boolean;
}
export interface SidebarMenuItemsProps {
    text: string
    navLinkTo?: string
}

const SideBarList: React.FC<SideBarListProps> = ({ sideBarSticked }) => {
    const location = useLocation();
    const { user } = useAuth();
    const isAdmin = user?.user_role === api.adminRole;
    const isSuperUser = user?.email === user?.company?.email;
    const isMasterAdmin = user?.user_role === 'master_admin'

    if (isMasterAdmin) {
        return masterAdminSidebar()
    }

    const settingsListItems = [
        { text: strings.systemSettings, navLinkTo: '/settings/system-settings' },
        ...[isSuperUser ? { text: strings.companyInformation, navLinkTo: '/settings/company-information' } : {}],
        ...[isSuperUser ? { text: strings.billing, navLinkTo: '/settings/billing' } : {}],
    ].filter((val) => val && !!val.text) as SidebarMenuItemsProps[]

    const regPortalListItems = isAdmin ? [
        { text: strings.mandatoryFields, navLinkTo: '/registration-portal/mandatory-fields' },
        { text: strings.Questionnaire, navLinkTo: '/registration-portal/questionnaire' },
    ] : [
        { text: strings.RegistrationPortal, navLinkTo: '/registration-portal' },
    ]

    return (
        <div className="relative mt-6 pb-4 space-y-2 lg:mt-12 flex-grow flex flex-col">
            <div className="flex-grow space-y-2">
                <SideBarListItem
                    text={strings.Home}
                    selected={location.pathname === "/"}
                    navLinkTo="/"
                    icon={<HomeIcon />}
                />
                <SideBarListItem
                    text={strings.Clients}
                    navLinkTo="/clients"
                    selected={location.pathname.includes("/clients")}
                    icon={<ClientsIcon />}
                />
                <SidebarListMenu
                    text={strings.RegistrationPortal}
                    navLinkTo="/registration-portal"
                    icon={<UserIcon />}
                    items={regPortalListItems}
                />
                <SideBarListItem
                    text={strings.CustomQuestionnaire}
                    navLinkTo="/questionnaires"
                    show={isAdmin || isSuperUser}
                    icon={<QuestionnerIcon />}
                />
                <SideBarListItem
                    text={strings.LettersofConsents}
                    navLinkTo="/letters-of-consents"
                    show={isAdmin || isSuperUser}
                    icon={<LocIcon />}
                />
                <SidebarListMenu
                    text={strings.Templates}
                    navLinkTo="/templates/"
                    icon={<TemplateIcon />}
                    items={[
                        { text: strings.Treatments, navLinkTo: '/templates/treatments' },
                        { text: strings.Text, navLinkTo: '/templates/text' },
                        { text: strings.Image, navLinkTo: '/templates/image' },
                    ]}
                />
                <SideBarListItem
                    text={strings.team}
                    navLinkTo="/team"
                    show={isAdmin || isSuperUser}
                    icon={<BuildingIcon />}
                />
                <SidebarListMenu
                    text={strings.Settings}
                    navLinkTo="/settings"
                    icon={<CogIcon />}
                    items={settingsListItems}
                />
            </div>
            <SideBarListItem
                text={strings.RecommendMeridiq}
                navLinkTo="/invite-a-friend"
                selected={location.pathname.includes("/invite-a-friend")}
                icon={<RecommendIcon />}
            />
            <SideBarListItem
                show={isSuperUser}
                text={strings.Upgrade_Plan}
                navLinkTo={user?.company?.is_subscribed ? "/upgrade-plan" : "/subscription"}
                selected={location.pathname.includes("/upgrade-plan")}
                icon={<DollarIcon />}
            />
            <SideBarListItem
                text={strings.Support}
                navLinkTo="/support"
                selected={location.pathname.includes("/support")}
                icon={<HelpIcon />}
            />
        </div >
    );

    function masterAdminSidebar() {
        return (
            <div className="relative space-y-2 mt-6 lg:mt-12">
                <SideBarListItem
                    text={strings.dashboard}
                    navLinkTo="/admin"
                    icon={<HomeIcon />}
                />
                <SideBarListItem
                    text={strings.reports}
                    navLinkTo="/admin/reports"
                    icon={<ReportIcon />}
                />
                <SideBarListItem
                    text={strings.Companies}
                    navLinkTo="/admin/companies"
                    icon={<OfficeIcon />}
                />
            </div>
        );
    }
};

export default SideBarList;
