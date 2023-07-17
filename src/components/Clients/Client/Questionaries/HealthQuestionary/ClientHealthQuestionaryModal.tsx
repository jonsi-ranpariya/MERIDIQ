import { Formik, getIn } from 'formik';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import api from '../../../../../configs/api';
import { commonFetch, timeZone } from '../../../../../helper';
import { ClientResponse } from '../../../../../interfaces/common';
import { HealthQuestionaryValues, INITIAL_HEALTH_STATE } from '../../../../../interfaces/questionary';
import strings from '../../../../../lang/Lang';
import ServerError from '../../../../../partials/Error/ServerError';
import FormikErrorFocus from '../../../../../partials/FormikErrorFocus/FormikErrorFocus';
import Button from '@components/form/Button';
import CancelButton from '../../../../../partials/MaterialButton/CancelButton';
import Modal from '../../../../../partials/MaterialModal/Modal';
import HealthQuestionaryComponent from '../../../../../partials/Qestionary/HealthQuestionaryComponent';
import { validateHealthQuestionary } from '../../../../../validations';

export interface ClientHealthQuestionaryModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate?: () => Promise<any>,
}

export interface IClientHealthQuestionaryModalValues {
    title: string,
    notes: string,
    server?: string,
}

const ClientHealthQuestionaryModal: React.FC<ClientHealthQuestionaryModalProps> = ({
    openModal,
    setOpenModal,
    mutate = async () => {},
}) => {
    const navigate = useNavigate();
    const { clientId }: { clientId?: string } = useParams();
    const { data: clientData } = useSWR<ClientResponse, Error>(
        api.clientSingle(clientId),
        commonFetch
    );

    return (
        <Formik<HealthQuestionaryValues>
            initialValues={clientData?.data?.health_questionaries?.length ? {
                data: INITIAL_HEALTH_STATE.map((data, index) => {
                    const newData = {
                        ...data,
                    };
                    const keys = Object.keys(data) as ("answer" | "more_info")[];
                    keys.forEach(key => {
                        if (key === 'answer') {
                            const value = getIn(clientData?.data?.health_questionaries?.length ? clientData?.data?.health_questionaries[0] : {}, `data_new.${index}.${key}`);

                            newData[key] = value === 'yes' ? 1 : (value === 'no' ? 0 : data[key]);
                        } else {
                            newData[key] = getIn(clientData?.data?.health_questionaries?.length ? clientData?.data?.health_questionaries[0] : {}, `data_new.${index}.${key}`) || data[key];
                        }

                    });

                    return newData;
                })
            } : {
                data: INITIAL_HEALTH_STATE,
            }}
            enableReinitialize
            validate={validateHealthQuestionary}
            onSubmit={async (values, { setSubmitting, resetForm, setFieldError }) => {

                const response = await fetch(api.healthStore.replace(':id', clientId!), {
                    method: 'POST',
                    headers: {
                        'X-App-Locale': strings.getLanguage(),
                        Accept: 'application/json',
                        'X-Time-Zone': timeZone(),
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        health_questions: values?.data?.map((healthQuestion) => {
                            if (Object.keys(healthQuestion).includes('answer')) {
                                return {
                                    ...healthQuestion,
                                    answer: healthQuestion.answer === 1 ? 'yes' : 'no',
                                };
                            }
                            return healthQuestion;
                        }),
                    }),
                });
                if (response.status === 401) {
                    navigate('/');
                }
                const data = await response.json();
                if (data.status !== '1') {
                    setFieldError('server', data.message || 'server error, please contact admin.');
                } else {
                    toast.success(strings.Health_Questionnarie_updated_successfully);
                    await resetForm()
                    await mutate();
                    setOpenModal(false);
                }
                setSubmitting(false);
            }}
        >
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, resetForm }) => {
                const handleModelClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false)
                    await resetForm();
                }

                return (
                    <Modal
                        size="large"
                        open={openModal}
                        title={strings.VIEWHEALTHQUESTIONNAIRE}
                        handleClose={handleModelClose}
                        cancelButton={
                            <CancelButton
                                fullWidth
                                disabled={!!isSubmitting}
                                onClick={handleModelClose}
                            >{strings.Cancel}
                            </CancelButton>
                        }
                        submitButton={
                            <Button
                                fullWidth
                                className=""
                                loading={!!isSubmitting}
                                disabled={!!isSubmitting}
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >{strings.Submit}
                            </Button>
                        }
                    >
                        <FormikErrorFocus />
                        <div className="p-4">
                            <div className="grid place-items-center mb-2">

                                <HealthQuestionaryComponent />
                                <p className="mt-2">{strings.health_bottom_info}</p>
                                <ServerError error={errors?.server} className="mt-4" />
                            </div>
                        </div>
                    </Modal >
                );
            }}
        </Formik >
    );
}

export default ClientHealthQuestionaryModal;