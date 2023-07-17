import * as React from 'react';
// import { useNavigate } from 'react-router';
// import { toast } from 'react-toastify';
// import api from '../../configs/api';
import { Service } from '@interface/model/service';
import strings from '../../lang/Lang';
import DeleteIcon from '../../partials/Icons/Delete';
import Button from '@components/form/Button';
import DeleteModal from '../../partials/MaterialModal/DeleteModal';

export interface QuestionnaireDeleteModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedService?: Service,
    // mutate: () => Promise<any>,
}

const ServiceDeleteModal: React.FC<QuestionnaireDeleteModalProps> = ({ open = false, handleClose = () => { }, selectedService }) => {

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    // const navigate = useNavigate();

    return (
        <DeleteModal
            open={open}
            handleClose={() => {
                if (isSubmitting) return;
                handleClose();
            }}
            icon={<DeleteIcon />
            }
            text={strings.DeleteQuestionnairesQuestion}
            submitButton={
                <Button
                    fullWidth
                    className=""
                    loading={!!isSubmitting}
                    disabled={!!isSubmitting}
                    onClick={async () => {
                        setIsSubmitting(true);
                        // const response = await fetch(api.questionnaireDelete.replace(':id', selectedService?.id?.toString() || ''),
                        //     {
                        //         method: selectedService?.deleted_at ? 'PATCH' : 'DELETE',
                        //         headers: {
                        //             "Accept": 'application/json',
                        //             'X-CSRF-TOKEN': 'test',
                        //             'X-App-Locale': strings.getLanguage(),
                        //             'Content-Type': 'application/json',
                        //         },
                        //         credentials: "include",
                        //     })

                        // const data = await response.json();

                        // if (response.status === 401) {
                        //     navigate('/');
                        // }

                        // if (data.status === '1') {
                        //     // await mutate();
                        //     toast.success(data.message);
                        //     handleClose();
                        // } else {
                        //     toast.error(data.message || 'server error, please contact admin.');
                        // }
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

export default ServiceDeleteModal;