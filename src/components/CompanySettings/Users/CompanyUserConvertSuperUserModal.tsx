import Button from '@components/form/Button';
import useAuth from '@hooks/useAuth';
import SuperUserIcon from "@icons/SuperUser";
import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../../../configs/api";
import { User } from "../../../interfaces/model/user";
import strings from "../../../lang/Lang";
import DeleteModal from "../../../partials/MaterialModal/DeleteModal";

export interface CompanyUserConvertSuperUserModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedUser?: User
    mutate: () => Promise<any>,
}

const CompanyUserConvertSuperUserModal: React.FC<CompanyUserConvertSuperUserModalProps> = ({ open = false, handleClose = () => {}, selectedUser, mutate }) => {

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { mutate: authMutate } = useAuth()
    const navigate = useNavigate();

    async function logout() {
        try {
            const response = await fetch(api.logout, {
                method: "GET",
                headers: {
                    "Accept": 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': 'test',
                    'X-App-Locale': strings.getLanguage(),
                },
                credentials: "include",
            });

            const data = await response.json();

            if (response.status === 401) {
                toast.error(data.message || "Unauthorized", {});
            }

            await authMutate();
        } catch (ex) {}
    }

    async function onSubmit() {
        if (!window.confirm(strings.change_to_super_user_desc)) {
            return;
        }
        setIsSubmitting(true);
        const response = await fetch(api.convertSuperUser(selectedUser?.id), {
            method: 'POST',
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
            await logout();
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
                    <SuperUserIcon />
                    <p className='text-xl mt-2 font-semibold'>{strings.convert_to_super_user_desc}</p>
                </div>
            }
            text=""
            children={<p className='px-4 pb-8 text-center'>{strings.change_to_super_user_desc}</p>}
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

export default CompanyUserConvertSuperUserModal;