import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../../../../../configs/api";
import { generateUserFullName } from "../../../../../helper";
import { User } from "../../../../../interfaces/model/user";
import strings from "../../../../../lang/Lang";
import DeleteIcon from "../../../../../partials/Icons/Delete";
import Button from '@components/form/Button';
import DeleteModal from "../../../../../partials/MaterialModal/DeleteModal";

export interface CompanyUserDeleteModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedUser?: User
    mutate: () => Promise<any>,
}

const CompanyUserDeleteModal: React.FC<CompanyUserDeleteModalProps> = ({ open = false, handleClose = () => {}, selectedUser, mutate }) => {

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const navigate = useNavigate();

    return (
        <DeleteModal
            open={open}
            handleClose={() => {
                if (isSubmitting) return;
                handleClose();
            }}
            icon={
                <div className="flex flex-col items-center">
                    <DeleteIcon />
                    <p className="text-base font-bold mt-2">{generateUserFullName(selectedUser)}</p>
                </div>
            }
            text={`${strings.DeleteUserQuestion}`}
            submitButton={
                <Button
                    fullWidth
                    className=""
                    loading={!!isSubmitting}
                    disabled={!!isSubmitting}
                    onClick={async () => {
                        setIsSubmitting(true);
                        const response = await fetch(api.userDelete.replace(':id', selectedUser?.id.toString() || ''), {
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
                >{strings.Delete}
                </Button>
            }
        />
    );
}

export default CompanyUserDeleteModal;