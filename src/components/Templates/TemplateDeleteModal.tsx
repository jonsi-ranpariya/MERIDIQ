import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../configs/api';
import { Template } from '../../interfaces/model/template';
import strings from '../../lang/Lang';
import DeleteIcon from '../../partials/Icons/Delete';
import PowerIcon from '../../partials/Icons/Power';
import Button from '@components/form/Button';
import DeleteModal from '../../partials/MaterialModal/DeleteModal';

export interface TemplateDeleteModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedTemplate?: Template,
    mutate: () => Promise<any>,
}

const TemplateDeleteModal: React.FC<TemplateDeleteModalProps> = ({ open = false, handleClose = () => { }, selectedTemplate, mutate }) => {

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const navigate = useNavigate();

    async function onSubmit() {
        setIsSubmitting(true);
        const response = await fetch(
            selectedTemplate?.deleted_at
                ? api.templateRestore(selectedTemplate?.id)
                : api.templateDelete(selectedTemplate?.id),
            {
                method: selectedTemplate?.deleted_at ? 'PATCH' : 'DELETE',
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
            icon={
                selectedTemplate?.is_editable
                    ? <DeleteIcon />
                    : <PowerIcon slash={!selectedTemplate?.deleted_at} />
            }
            text={
                selectedTemplate?.is_editable
                    ? strings.DeleteTemplateQuestion :
                    selectedTemplate?.deleted_at
                        ? strings.activateTemplateQuestion
                        : strings.InactivateTemplateQuestion
            }
            submitButton={
                <Button
                    loading={isSubmitting}
                    onClick={onSubmit}
                    children={selectedTemplate?.deleted_at ? strings.Submit : (selectedTemplate?.is_editable ? strings.Delete : strings.Submit)}
                />
            }
        />
    );
}

export default TemplateDeleteModal;