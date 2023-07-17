import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../../../configs/api';
import { Company } from '../../../../interfaces/model/company';
import strings from '../../../../lang/Lang';
import DeleteIcon from '../../../../partials/Icons/Delete';
import Button from '@components/form/Button';
import DeleteModal from '../../../../partials/MaterialModal/DeleteModal';

export interface CompanyDeleteModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedCompany?: Company,
    mutate: () => Promise<any>,
}

const CompanyDeleteModal: React.FC<CompanyDeleteModalProps> = ({ open = false, handleClose = () => {}, selectedCompany, mutate }) => {

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const navigate = useNavigate();

    return (
        <DeleteModal
            open={open}
            handleClose={() => {
                if (isSubmitting) return;
                handleClose();
            }}
            text=""
            icon={<DeleteIcon />}
            submitButton={
                <Button
                    fullWidth
                    className=""
                    loading={!!isSubmitting}
                    disabled={!!isSubmitting}
                    onClick={async () => {
                        setIsSubmitting(true);
                        const response = await fetch(api.companyDelete.replace(':id', selectedCompany?.id.toString() || ''), {
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
                >{strings.DELETE_COMPANY}
                </Button>
            }
        >
            <div className="content text-center mb-4 font-weight-normal">
                <p className="">
                    {strings.DELETE_COMPANY_1}
                    <b>{` ${selectedCompany?.company_name || ''} `}</b>
                    {strings.DELETE_COMPANY_2}
                </p>
                <p>
                    {strings.DELETE_COMPANY_3}
                </p>
            </div>
        </DeleteModal>
    );
}

export default CompanyDeleteModal;