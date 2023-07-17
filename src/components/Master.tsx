import ModalSuspense from '@partials/Loadings/ModalLoading';
import SectionSuspense from '@partials/Loadings/SectionLoading';
import CardDetailsNotFoundModal from '@partials/MaterialModal/CardDetailsNotFoundModal';
import { SideBarProvider } from '@provider/SideBarProvider';
import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useSideBar from '../hooks/useSideBar';
import useTranslation from '../hooks/useTranslation';
import PastDueSubscriptionModal from '../partials/MaterialModal/PastDueSubscriptionModal';
import ReadOnlyAccountModal from '../partials/MaterialModal/ReadOnlyAccountModal';
import UpgradePlanModal from '../partials/MaterialModal/UpgradePlanModal';
import SideBar from '../partials/SideBar/SideBar';
import TopBar from '../partials/TopBar/TopBar';

const LoggedOutModal = React.lazy(() => import("@partials/MaterialModal/LoggedOutModal"))

export interface MasterProps {

}

const Master: React.FC<MasterProps> = () => {

    const { loggedOut, user, sessionOut } = useAuth();
    const navigate = useNavigate();
    const { sideBarSticked } = useSideBar();
    useTranslation();

    // if logged in, redirect to the dashboard
    React.useEffect(() => {
        if (loggedOut || user?.user_role === 'master_admin') return
        const superUser = user?.company?.email === user?.email;
        const setupIncomplete = [user?.company?.company_name, user?.first_name, user?.last_name, user?.company?.country].includes("")
        if (superUser && setupIncomplete) {
            navigate("/sign-up/set-up");
            return;
        }
        if (superUser && user?.company?.is_subscribed === false) {
            navigate("/sign-up/subscription");
        }
    }, [user, navigate, loggedOut]);

    return (
        <>
            {(sessionOut || loggedOut) && <ModalSuspense><LoggedOutModal /></ModalSuspense>}
            <PastDueSubscriptionModal />
            <CardDetailsNotFoundModal />
            <UpgradePlanModal />
            {/* <QuickGuideModal /> */}
            <ReadOnlyAccountModal />
            <TopBar />
            <SideBar />
            <div className={`pt-20 ${sideBarSticked ? 'lg:pl-14' : 'lg:pl-72'}`}>
                <div className="mx-auto px-4 lg:px-6 relative pb-8">
                    <SectionSuspense>
                        <Outlet />
                    </SectionSuspense>
                </div>
            </div>
        </>
    );
}

const MasterHoC: React.FC = () => {
    return (
        <SideBarProvider>
            <Master />
        </SideBarProvider>
    );
}

export default MasterHoC;