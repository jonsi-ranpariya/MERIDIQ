import Input from '@components/form/Input';
import Select from '@components/form/Select';
import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import api from '../../../configs/api';
import { QuestionaryQuestion } from '../../../interfaces/model/questionary';
import strings from '../../../lang/Lang';
import ServerError from '../../../partials/Error/ServerError';
import FormikErrorFocus from '../../../partials/FormikErrorFocus/FormikErrorFocus';
import Button from '@components/form/Button';
import CancelButton from '../../../partials/MaterialButton/CancelButton';
import Modal from '../../../partials/MaterialModal/Modal';
import { validateQuestionaryQuestionStore } from '../../../validations';

export interface IQuestionaryQuestionValues {
    questionary_id: number
    question: string
    required: 0 | 1
    type: 'yes_no_textbox' | 'textbox' | 'yes_no'
    order: string
    server?: string
}

export interface QuestionnaireQuestionModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate: () => Promise<any>,
    selectedQuestion?: QuestionaryQuestion
}

const QuestionnaireQuestionModal: React.FC<QuestionnaireQuestionModalProps> = ({
    openModal, setOpenModal, mutate, selectedQuestion
}) => {

    const navigate = useNavigate();
    const { questionnaireId }: { questionnaireId?: string } = useParams();


    return (
        <Formik<IQuestionaryQuestionValues>
            initialValues={!selectedQuestion ? {
                question: '',
                questionary_id: parseInt(questionnaireId!),
                order: '',
                required: 0,
                type: 'yes_no_textbox',
            } : {
                question: selectedQuestion?.question,
                questionary_id: parseInt(questionnaireId!),
                required: selectedQuestion?.required ? 1 : 0,
                type: selectedQuestion?.type,
                order: selectedQuestion?.order.toString(),
            }}
            enableReinitialize
            validate={validateQuestionaryQuestionStore}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                const response = await fetch(!selectedQuestion ? api.questionnaireQuestionCreate.replace(':questionary', questionnaireId!) : api.questionnaireQuestionUpdate.replace(':questionary', questionnaireId!).replace(':id', selectedQuestion.id.toString() || ''), {
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
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleBlur, handleChange, handleSubmit, isSubmitting, isValidating, resetForm }) => {

                const handleClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false)
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={!selectedQuestion ? strings.AddQuestion : strings.UpdateQuestion}
                        handleClose={handleClose}
                        cancelButton={
                            <CancelButton disabled={!!isSubmitting} onClick={handleClose}>
                                {strings.Cancel}
                            </CancelButton>
                        }
                        submitButton={
                            <Button
                                loading={isSubmitting}
                                onClick={() => {
                                    if (!dirty && selectedQuestion) {
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
                        <div className="p-4 space-y-4">
                            <Input
                                label={strings.Question}
                                required
                                name="question"
                                value={values.question}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.question && errors.question && errors.question}
                            />

                            <Input
                                label={strings.Order}
                                required
                                type="tel"
                                name="order"
                                value={values.order}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched?.order && errors.order && errors.order}
                            />

                            <Select
                                value={values.type}
                                // @ts-ignore
                                displayValue={(val) => strings[val]}
                                label={strings.Type}
                                onChange={(e) => {
                                    setFieldTouched('type');
                                    setFieldValue('type', e)
                                }}
                            >
                                {
                                    // @ts-ignore
                                    Object.keys(api.questionTypes).map((value) => <Select.Option key={value} value={value}>{strings[value]}</Select.Option>)
                                }
                            </Select>

                            <Select
                                displayValue={(val) => val ? strings.Yes : strings.No}
                                onChange={(e) => {
                                    setFieldTouched('required');
                                    setFieldValue('required', e ? 1 : 0)
                                }}
                                value={values.required}
                                label={strings.Required}
                            >
                                <Select.Option value={0}>{strings.No}</Select.Option>
                                <Select.Option value={1}>{strings.Yes}</Select.Option>
                            </Select>
                            <ServerError error={errors?.server} className="mt-4" />
                        </div>
                    </Modal>
                );
            }}
        </Formik>
    );
}

export default QuestionnaireQuestionModal;