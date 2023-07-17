import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../../../configs/api';
import { ClientLetterOfConsent } from '../../../../interfaces/model/clientLetterOfConsent';
import strings from '../../../../lang/Lang';
import DeleteIcon from '../../../../partials/Icons/Delete';
import Button from '@components/form/Button';
import DeleteModal from '../../../../partials/MaterialModal/DeleteModal';

export interface ClientLetterOfConsentDeleteModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedClientLetterOfConsent?: ClientLetterOfConsent,
    mutate: () => Promise<any>,
}

const ClientLetterOfConsentDeleteModal: React.FC<ClientLetterOfConsentDeleteModalProps> = ({ open = false, handleClose = () => {}, selectedClientLetterOfConsent, mutate }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const navigate = useNavigate();

    return (
        <DeleteModal
            open={open}
            handleClose={() => {
                if (isSubmitting) return;
                handleClose()
            }}
            icon={<DeleteIcon className="mb-2" />}
            text={`${strings.Are_you_sure_you_want_to_delete_this_letter.replace(':name', selectedClientLetterOfConsent?.consent_title || '')}`}
            submitButton={
                <Button
                    fullWidth
                    className=""
                    loading={!!isSubmitting}
                    disabled={!!isSubmitting}
                    onClick={async () => {
                        setIsSubmitting(true);
                        const response = await fetch(`${api.clientLetterOfConsentDelete.replace(':id', selectedClientLetterOfConsent?.id.toString() || '')}`, {
                            method: 'DELETE',
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
                        // if (handleSubmit) return handleSubmit();
                    }}
                >{strings.Submit}
                </Button>
            }
        />
    );
}

export default ClientLetterOfConsentDeleteModal;