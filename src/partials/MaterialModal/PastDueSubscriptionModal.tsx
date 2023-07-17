import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import strings from "../../lang/Lang";
import Button from '@components/form/Button';
import Modal from "./Modal";


function PastDueSubscriptionModal() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user: authUser } = useAuth();

    useEffect(() => {
        if (authUser?.company?.has_pending_payment && !location.pathname.includes('subscription') && !location.pathname.includes('upgrade-plan') && !location.pathname.includes('registration')) {
            setOpen(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setOpen]);

    if (authUser?.user_role === 'master_admin') {
        return null;
    }

    return (
        <Modal
            open={!!(open)}
            title={`${strings.incomplete_payment_title}!`}
            handleClose={() => setOpen(false)}
            submitButton={
                authUser?.email === authUser?.company?.email ?
                    <Button
                        onClick={() => {
                            setOpen(false);
                            navigate('/settings/billing', { replace: true })
                        }}
                    >
                        {strings.Pay}
                    </Button>
                    : undefined
            }
        >
            <div className="p-4">
                <p>{strings.incomplete_payment_message}</p>
            </div>
        </Modal>
    )
}

export default PastDueSubscriptionModal
