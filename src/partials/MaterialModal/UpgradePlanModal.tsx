import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import strings from "../../lang/Lang";
import Button from '@components/form/Button';
import Modal from "./Modal";
import useLocalStorage from "@hooks/useLocalStorage";


function UpgradePlanModal() {

    const [open, setOpen] = useState(false);
    const { storedValue: modalShown, setStorageValue: setModalShown } = useLocalStorage("upgrade_plan_showed", false)
    const location = useLocation();
    const navigate = useNavigate();
    const { user: authUser } = useAuth();

    useEffect(() => {
        const freePlan = authUser?.company?.subscriptions.find((subscription) => subscription?.plan.name === 'Free' && subscription?.stripe_status === 'active');
        if (freePlan && !location.pathname.includes('subscription') && !location.pathname.includes('upgrade-plan') && !location.pathname.includes('registration')) {
            if (!modalShown) setOpen(true);
        }
        // eslint-disable-next-line
    }, []);

    if (authUser?.user_role === 'master_admin') {
        return <></>;
    }

    return (
        <Modal
            open={open}
            title={`${strings.UpgradePlan}!`}
            handleClose={() => { setOpen(false); setModalShown(true) }}
            submitButton={
                <Button
                    onClick={() => {
                        setOpen(false);
                        setModalShown(true)
                        navigate('/upgrade-plan', { replace: true })
                    }}
                >{strings.View}
                </Button>
            }
        >
            <div className="p-4">
                <p>{strings.upgradePlanMessage}</p>
            </div>
        </Modal>
    )
}

export default UpgradePlanModal
