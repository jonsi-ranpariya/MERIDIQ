import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../../../configs/api";
import { generateUserFullName } from "../../../helper";
import { User } from "../../../interfaces/model/user";
import strings from "../../../lang/Lang";
import PowerIcon from "../../../partials/Icons/Power";
import Button from '@components/form/Button';
import DeleteModal from "../../../partials/MaterialModal/DeleteModal";

export interface CompanyUserStatusModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedUser?: User
    mutate: () => Promise<any>,
}

const CompanyUserStatusModal: React.FC<CompanyUserStatusModalProps> = ({ open = false, handleClose = () => { }, selectedUser, mutate }) => {

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const navigate = useNavigate();

    async function onSubmit() {

        setIsSubmitting(true);
        const response = await fetch(api.userChangeStatus.replace(':id', selectedUser?.id.toString() || ''), {
            method: 'GET',
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
                <div className="flex flex-col items-center">
                    <PowerIcon slash={!selectedUser?.is_active} />
                </div>
            }
            text={`${selectedUser?.is_active ? strings.INACTIVATE_CLIENT_1 : strings.RESTORE_CLIENT_1} ${generateUserFullName(selectedUser)}?`}
            submitButton={
                <Button
                    loading={isSubmitting}
                    onClick={onSubmit}
                    children={strings.Submit}
                />
            }
        />
    );
}

export default CompanyUserStatusModal;