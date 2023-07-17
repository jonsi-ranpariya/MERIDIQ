import Input from '@components/form/Input';
import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../configs/api';
import { Questionary } from '../../interfaces/model/questionary';
import strings from '../../lang/Lang';
import ServerError from '../../partials/Error/ServerError';
import FormikErrorFocus from '../../partials/FormikErrorFocus/FormikErrorFocus';
import Button from '@components/form/Button';
import CancelButton from '../../partials/MaterialButton/CancelButton';
import Modal from '../../partials/MaterialModal/Modal';
import { validateQuestionaryStore } from '../../validations';

export interface IQuestionaryValues {
    title: string,
    server?: string,
}
export interface QuestionnaireModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate: () => Promise<any>,
    selectedQuestionary?: Questionary
}

const QuestionnaireModal: React.FC<QuestionnaireModalProps> = ({
    openModal, setOpenModal, mutate, selectedQuestionary
}) => {

    const navigate = useNavigate();

    return (
        <Formik<IQuestionaryValues>
            initialValues={!selectedQuestionary ? {
                title: '',
            } : {
                title: selectedQuestionary?.title,
            }}
            enableReinitialize
            validate={validateQuestionaryStore}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                const response = await fetch(!selectedQuestionary ? api.questionnaireCreate : api.questionnaireUpdate.replace(':id', selectedQuestionary.id.toString() || ''), {
                    method: 'POST',
                    headers: {
                        "Accept": 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': 'test',
                        'Content-Type': 'application/json',
                        'X-App-Locale': strings.getLanguage(),
                    },
                    credentials: "include",
                    body: JSON.stringify(values),
                });

                const data = await response.json();

                if (response.status === 401) {
                    navigate('/');
                }

                if (data.status === '1') {
                    await mutate();
                    await resetForm();
                    toast.success(data.message);
                    setOpenModal(false);
                } else {
                    setFieldError('server', data.message || 'server error, please contact admin.');
                }
                setSubmitting(false);
            }}
        >
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, resetForm }) => {

                const handleClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false)
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={!selectedQuestionary ? strings.AddQuestionnaire : strings.UpdateQuestionnaire}
                        handleClose={handleClose}
                        cancelButton={
                            <CancelButton
                                fullWidth
                                disabled={!!isSubmitting}
                                onClick={handleClose}
                            >{strings.Cancel}
                            </CancelButton>
                        }
                        submitButton={
                            <Button
                                loading={isSubmitting}
                                onClick={() => {
                                    if (!dirty && selectedQuestionary) {
                                        toast.success(strings.no_data_changed)
                                        handleClose();
                                        return;
                                    }
                                    if (handleSubmit) return handleSubmit();
                                }}
                            >{strings.Submit}
                            </Button>
                        }
                    >
                        <FormikErrorFocus />
                        <div className="p-4">
                            <Input
                                name="title"
                                label={strings.TITLE}
                                required
                                onChange={(e) => {
                                    setFieldTouched('title');
                                    setFieldValue('title', e.target.value)
                                }}
                                value={values.title}
                                error={touched?.title && errors.title && errors.title}
                            />

                            <ServerError error={errors?.server} className="mt-4" />
                        </div>
                    </Modal >
                );
            }}
        </Formik>
    );
}

export default QuestionnaireModal;