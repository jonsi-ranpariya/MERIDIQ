import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import strings from "../../lang/Lang";
import Button from '@components/form/Button';
import Modal from "./Modal";


function ReadOnlyAccountModal() {
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const { user: authUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser?.company?.is_read_only && !location.pathname.includes('subscription') && !location.pathname.includes('upgrade-plan') && !location.pathname.includes('registration')) {
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
            title={`${strings.read_only_title}!`}
            handleClose={() => {
                setOpen(false);
            }}
            submitButton={
                authUser?.email === authUser?.company?.email ? <Button
                    fullWidth
                    className=""
                    onClick={() => {
                        setOpen(false);
                        navigate('/settings?tab=3', { replace: true })
                    }}
                >{strings.Pay}
                </Button> : undefined
            }
        >
            <div className="p-4">
                <p>{strings.read_only_message}</p>
            </div>
        </Modal>
    )
}

export default ReadOnlyAccountModal
