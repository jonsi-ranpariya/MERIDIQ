import { Formik, getIn } from 'formik';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import api from '../../../../../configs/api';
import { commonFetch, timeZone } from '../../../../../helper';
import { ClientResponse } from '../../../../../interfaces/common';
import { Covid19QuestionaryValues, INITIAL_COVID19_STATE } from '../../../../../interfaces/questionary';
import strings from '../../../../../lang/Lang';
import ServerError from '../../../../../partials/Error/ServerError';
import FormikErrorFocus from '../../../../../partials/FormikErrorFocus/FormikErrorFocus';
import Button from '@components/form/Button';
import CancelButton from '../../../../../partials/MaterialButton/CancelButton';
import Modal from '../../../../../partials/MaterialModal/Modal';
import Covid19QuestionaryComponent from '../../../../../partials/Qestionary/Covid19QuestionaryComponent';
import { validateCovid19Questionary } from '../../../../../validations';

export interface ClientCovid19QuestionaryModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate?: () => Promise<any>,
}

export interface IClientCovid19QuestionaryModalValues {
    title: string,
    notes: string,
    server?: string,
}

const ClientCovid19QuestionaryModal: React.FC<ClientCovid19QuestionaryModalProps> = ({
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
        <Formik<Covid19QuestionaryValues>
            initialValues={clientData?.data?.covid19s?.length ? {
                data: INITIAL_COVID19_STATE.map((data, index) => {
                    const newData = {
                        ...data,
                    };
                    const keys = Object.keys(data) as ("answer" | "more_info")[];
                    keys.forEach(key => {
                        if (key === 'answer') {
                            const value = getIn(clientData?.data?.covid19s?.length ? clientData?.data?.covid19s[0] : {}, `data.${index}.${key}`);

                            newData[key] = value === 'yes' ? 1 : (value === 'no' ? 0 : data[key]);
                        } else {
                            newData[key] = getIn(clientData?.data?.covid19s?.length ? clientData?.data?.covid19s[0] : {}, `data.${index}.${key}`) || data[key];
                        }

                    });

                    return newData;
                })
            } : {
                data: INITIAL_COVID19_STATE,
            }}
            enableReinitialize
            validate={validateCovid19Questionary}
            onSubmit={async (values, { setSubmitting, resetForm, setFieldError }) => {

                const response = await fetch(api.covid19Store.replace(':id', clientId!), {
                    method: 'POST',
                    headers: {
                        'X-App-Locale': strings.getLanguage(),
                        'X-Time-Zone': timeZone(),
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        covid19: values?.data?.map((covid19Question) => {
                            if (Object.keys(covid19Question).includes('answer')) {
                                return {
                                    ...covid19Question,
                                    answer: covid19Question.answer === 1 ? 'yes' : 'no',
                                };
                            }
                            return covid19Question;
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
                    mutate();
                    toast.success(strings.covid19_updated_successfully);
                    await resetForm()
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
                        size="large"
                        open={openModal}
                        title={strings.VIEWCOVID19}
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
                                    if (!dirty && clientData?.data?.covid19s?.length) {
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
                            <div className="grid place-items-center mb-2">

                                <Covid19QuestionaryComponent />
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

export default ClientCovid19QuestionaryModal;