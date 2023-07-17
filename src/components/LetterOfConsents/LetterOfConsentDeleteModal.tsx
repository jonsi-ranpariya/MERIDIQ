import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../../configs/api";
import { LetterOfConsent } from "../../interfaces/model/letterOfConsent";
import strings from "../../lang/Lang";
import PowerIcon from "../../partials/Icons/Power";
import Button from '@components/form/Button';
import DeleteModal from "../../partials/MaterialModal/DeleteModal";

export interface LetterOfConsentDeleteModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedLetterOfConsent?: LetterOfConsent
    mutate: () => Promise<any>,
}

const LetterOfConsentDeleteModal: React.FC<LetterOfConsentDeleteModalProps> = ({ open = false, handleClose = () => { }, selectedLetterOfConsent, mutate }) => {

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const navigate = useNavigate();

    async function onSubmit() {
        setIsSubmitting(true);
        const url = selectedLetterOfConsent?.deleted_at
            ? api.letterOfConsentRestore(selectedLetterOfConsent?.id)
            : api.letterOfConsentDelete(selectedLetterOfConsent?.id)
        const response = await fetch(url, {
            method: selectedLetterOfConsent?.deleted_at ? 'GET' : 'DELETE',
            headers: {
                "Accept": 'application/json',
                'X-CSRF-TOKEN': 'test',
                'X-App-Locale': strings.getLanguage(),
                'Content-Type': 'application/json',
            },
            credentials: "include",
        })

        const data = await response.json();

        if (response.status === 401) {
            navigate('/');
        }

        if (data.status === '1') {
            await mutate();
            toast.success(data.message);
            handleClose();
        } else {
            toast.error(data.message || 'server error, please contact admin.');
        }
        setIsSubmitting(false);

        handleClose();
    }

    return (
        <DeleteModal
            open={open}
            handleClose={() => {
                if (isSubmitting) return;
                handleClose();
            }}
            icon={<PowerIcon slash={!selectedLetterOfConsent?.deleted_at} />}
            text={`${selectedLetterOfConsent?.deleted_at ? strings.RESTORE_CLIENT_1 : strings.INACTIVATE_CLIENT_1} ${strings.this_letter_of_consent}`}
            submitButton={
                <Button
                    loading={isSubmitting}
                    onClick={onSubmit}
                >{strings.Submit}
                </Button>
            }
        />
    );
}

export default LetterOfConsentDeleteModal;