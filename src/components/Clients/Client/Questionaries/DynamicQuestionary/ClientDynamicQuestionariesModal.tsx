import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import useSWR from 'swr';
import api from '../../../../../configs/api';
import { commonFetch, timeZone } from '../../../../../helper';
import { Questionary } from '../../../../../interfaces/model/questionary';
import { QuestionaryQuestionResponse } from '../../../../../interfaces/common';
import strings from '../../../../../lang/Lang';
import { toast } from 'react-toastify';
import Modal from '../../../../../partials/MaterialModal/Modal';
import Button from '@components/form/Button';
import FormikErrorFocus from '../../../../../partials/FormikErrorFocus/FormikErrorFocus';
import ServerError from '../../../../../partials/Error/ServerError';
import config from '../../../../../config';
import { validateClientDynamicQuestionnaire } from '../../../../../validations';
import DynamicQuestionaryComponent from '../../../../../partials/Qestionary/DynamicQuestionaryComponent';
import FullPageError from '../../../../../partials/Error/FullPageError';
import CancelButton from '../../../../../partials/MaterialButton/CancelButton';
import LoadingIcon from '@icons/Loading';

interface IClientDynamicQuestionariesModalProps {
    openModal?: boolean,
    setOpenModal?: React.Dispatch<React.SetStateAction<boolean>>,
    mutate?: () => Promise<any>,
    selectedQuestionary?: Questionary,
}

export interface DynamicQuestionaryValues {
    data: ({
        question: string,
        type: string,
        value?: 0 | 1 | '',
        text: string,
    })[],
    server?: string,
}

const ClientDynamicQuestionariesModal: React.FC<IClientDynamicQuestionariesModalProps> = ({
    openModal = false,
    setOpenModal = () => {},
    mutate = async () => {},
    selectedQuestionary,
}) => {
    const navigate = useNavigate();
    const { clientId }: { clientId?: string } = useParams();

    const { data: questionnaireQuestionData, error } = useSWR<QuestionaryQuestionResponse, Error>(
        api.questionnaireQuestions.replace(":questionary", selectedQuestionary?.id.toString() || ""),
        commonFetch
    );

    const loading = !questionnaireQuestionData && !error;

    if (error && selectedQuestionary) {
        return <FullPageError message={error.message || 'server error'} code={error.status || 500} />
    }

    return (
        <Formik<DynamicQuestionaryValues>
            initialValues={selectedQuestionary ? {
                data: questionnaireQuestionData?.data.map((question, index) => {
                    if (question.type === config.questionTypes1.yes_no_textbox.value) {
                        return {
                            question: question.question,
                            type: question.type,
                            text: selectedQuestionary?.data && selectedQuestionary.data?.formatted_response[index]?.text ? selectedQuestionary.data.formatted_response[index]?.text : '',
                            value: selectedQuestionary?.data && selectedQuestionary.data?.formatted_response[index]?.value ? (selectedQuestionary.data.formatted_response[index]?.value === 'yes' ? 1 : 0) : '',
                        };
                    }

                    if (question.type === config.questionTypes1.yes_no.value) {
                        return {
                            question: question.question,
                            type: question.type,
                            value: selectedQuestionary?.data && selectedQuestionary.data?.formatted_response[index]?.value ? (selectedQuestionary.data.formatted_response[index]?.value === 'yes' ? 1 : 0) : '',
                            text: "",
                        };
                    }

                    if (question.type === config.questionTypes1.textbox.value) {
                        return {
                            question: question.question,
                            type: question.type,
                            text: selectedQuestionary?.data && selectedQuestionary.data?.formatted_response[index] ? selectedQuestionary.data.formatted_response[index] : ''
                        };
                    }

                    return {
                        question: question.question,
                        type: question.type,
                        text: ""
                    };
                }) || []
            } : {
                data: [],
            }}
            enableReinitialize
            validate={(values) => validateClientDynamicQuestionnaire(values, questionnaireQuestionData?.data || [])}
            onSubmit={async (values, { setSubmitting, resetForm, setFieldError }) => {
                const formData = new FormData();
                formData.set('client_id', clientId!);
                for (let index = 0; index < values.data.length; index++) {
                    const data = values.data[index];
                    const keys = Object.keys(data);
                    const hasAnswer = keys.includes('value');
                    if (hasAnswer) {
                        formData.set(`data[${index}][value]`, data.value === 1 ? 'yes' : (data.value === 0 ? 'no' : ''))
                    }

                    formData.set(hasAnswer ? `data[${index}][text]` : `data[${index}]`, data.text);
                }

                const response = await fetch(api.questionnaireAnswerCreate.replace(':questionary', selectedQuestionary?.id.toString() || ''), {
                    method: 'POST',
                    headers: {
                        'X-App-Locale': strings.getLanguage(),
                        'X-Time-Zone': timeZone(),
                        Accept: 'application/json',
                    },
                    credentials: 'include',
                    body: formData,
                });
                if (response.status === 401) {
                    navigate('/');
                }
                const data = await response.json();
                if (data.status !== '1') {
                    setFieldError('server', data.message || 'server error, please contact admin.');
                } else {
                    toast.success(data.message || 'dynamic questionary updated successfully.');
                    await resetForm()
                    await mutate();
                    setOpenModal(false);
                }
                setSubmitting(false);
            }}
        >
            {({ errors, handleSubmit, dirty, isSubmitting, isValidating, resetForm }) => {
                const handleModelClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false)
                    await resetForm();
                }

                return (
                    <Modal
                        size="medium"
                        open={openModal}
                        title={selectedQuestionary?.title || ''}
                        handleClose={handleModelClose}
                        cancelButton={
                            <CancelButton
                                fullWidth
                                disabled={!!isSubmitting || loading}
                                onClick={handleModelClose}
                            >{strings.Cancel}
                            </CancelButton>
                        }
                        submitButton={
                            <Button
                                fullWidth
                                className=""
                                loading={!!isSubmitting}
                                disabled={!!isSubmitting || loading}
                                onClick={() => {
                                    if (!dirty && selectedQuestionary?.data) {
                                        toast.success(strings.no_data_changed)
                                        handleModelClose();
                                        return;
                                    }

                                    return handleSubmit();
                                }}
                            >{strings.Submit}
                            </Button>
                        }
                    >
                        <FormikErrorFocus />
                        <div className="p-4">
                            <div className="grid grid-flow-row gap-4 mb-2">

                                <DynamicQuestionaryComponent />
                                {
                                    questionnaireQuestionData?.data && !questionnaireQuestionData?.data?.length
                                        ? strings.NoQuestions
                                        : ''
                                }
                                {loading
                                    ? <div className="w-full flex justify-center">
                                        <LoadingIcon className="mx-auto" />
                                    </div>
                                    : ''
                                }
                                <ServerError error={errors?.server} className="mt-4" />
                            </div>
                        </div>
                    </Modal >
                );
            }}
        </Formik >
    );
};

export default ClientDynamicQuestionariesModal;
