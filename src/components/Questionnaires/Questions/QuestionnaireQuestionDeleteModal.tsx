import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../../configs/api';
import { QuestionaryQuestion } from '../../../interfaces/model/questionary';
import strings from '../../../lang/Lang';
import DeleteIcon from '../../../partials/Icons/Delete';
import Button from '@components/form/Button';
import DeleteModal from '../../../partials/MaterialModal/DeleteModal';

export interface QuestionnaireQuestionDeleteModalProps {
    open?: boolean,
    handleClose?: () => void,
    selectedQuestion?: QuestionaryQuestion,
    mutate: () => Promise<any>,
}

const QuestionnaireQuestionDeleteModal: React.FC<QuestionnaireQuestionDeleteModalProps> = ({ open = false, handleClose = () => {}, selectedQuestion, mutate }) => {

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const navigate = useNavigate();
    const { questionnaireId }: { questionnaireId?: string } = useParams();

    return (
        <DeleteModal
            open={open}
            handleClose={() => {
                if (isSubmitting) return;
                handleClose();
            }}
            icon={<DeleteIcon />
            }
            text={strings.DeleteQuestionQuestion}
            submitButton={
                <Button
                    fullWidth
                    className=""
                    loading={!!isSubmitting}
                    disabled={!!isSubmitting}
                    onClick={async () => {
                        setIsSubmitting(true);
                        const response = await fetch(api.questionnaireQuestionDelete.replace(':questionary', questionnaireId!).replace(':id', selectedQuestion?.id?.toString() || ''),
                            {
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

export default QuestionnaireQuestionDeleteModal;