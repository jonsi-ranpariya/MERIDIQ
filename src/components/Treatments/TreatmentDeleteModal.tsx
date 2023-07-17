import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../configs/api';
import { Treatment } from '../../interfaces/model/treatment';
import strings from '../../lang/Lang';
import PowerIcon from '../../partials/Icons/Power';
import Button from '@components/form/Button';
import DeleteModal from '../../partials/MaterialModal/DeleteModal';

export interface TreatmentDeleteModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedTreatment: Treatment,
    mutate: () => Promise<any>,
}

const TreatmentDeleteModal: React.FC<TreatmentDeleteModalProps> = ({ open = false, handleClose = () => { }, selectedTreatment, mutate }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const navigate = useNavigate();

    async function onSubmit() {
        if (!selectedTreatment) return;
        setIsSubmitting(true);
        const url = selectedTreatment.deleted_at ? api.treatmentRestore(selectedTreatment.id) : api.treatmentDelete(selectedTreatment.id);
        const response = await fetch(url, {
            method: selectedTreatment?.deleted_at ? 'GET' : 'DELETE',
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
                handleClose()
            }}
            icon={<PowerIcon slash={!selectedTreatment?.deleted_at} />}
            text={`${selectedTreatment?.deleted_at ? strings.RESTORE_CLIENT_1 : strings.INACTIVATE_CLIENT_1} ${strings.this_treatment}`}
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

export default TreatmentDeleteModal;