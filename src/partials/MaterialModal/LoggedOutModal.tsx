import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import strings from "../../lang/Lang";
import Button from '@components/form/Button';
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";


function LoggedOutModal() {

    const [open, setOpen] = useState(true);
    const { sessionOut } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (sessionOut) {
            const shown = sessionStorage.getItem('loggedOutShown')
            if (shown !== 'true') {
                setOpen(true);
            }
        }
        // eslint-disable-next-line
    }, [sessionOut]);

    const onClose = () => {
        setOpen(false);
        navigate("/login");
        sessionStorage.setItem('loggedOutShown', 'true')
    }

    return (
        <Modal
            open={open}
            title={`${strings.logged_out}`}
            handleClose={onClose}
            submitButton={
                <Button onClick={onClose}>
                    {strings.Okay}
                </Button>
            }
        >
            <div className="pb-4 text-center">
                <p>{strings.logged_out_desc}</p>
            </div>
        </Modal>
    )
}

export default LoggedOutModal
