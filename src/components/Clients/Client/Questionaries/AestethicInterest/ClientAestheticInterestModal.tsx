import { Formik, getIn } from 'formik';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useSWR from 'swr';
import api from '../../../../../configs/api';
import { commonFetch, getAestheticInterest, timeZone } from '../../../../../helper';
import { ClientResponse } from '../../../../../interfaces/common';
import { AestheticInterestValues, INITIAL_AESTETHIC_STATE } from '../../../../../interfaces/questionary';
import strings from '../../../../../lang/Lang';
import ServerError from '../../../../../partials/Error/ServerError';
import FormikErrorFocus from '../../../../../partials/FormikErrorFocus/FormikErrorFocus';
import Button from '@components/form/Button';
import CancelButton from '../../../../../partials/MaterialButton/CancelButton';
import Modal from '../../../../../partials/MaterialModal/Modal';
import AestheticInterestComponent from '../../../../../partials/Qestionary/AestheticInterestComponent';
import { validateAestheticInterest } from '../../../../../validations';

export interface ClientAestheticInterestModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate?: () => Promise<any>,
}

export interface IClientAestheticInterestModalValues {
    title: string,
    notes: string,
    server?: string,
}

const ClientAestheticInterestModal: React.FC<ClientAestheticInterestModalProps> = ({
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
        <Formik<AestheticInterestValues>
            initialValues={clientData?.data?.aesthetic_insterests?.length ? {
                data: INITIAL_AESTETHIC_STATE.map((data, index) => {
                    const newData = {
                        ...data,
                    };
                    const keys = Object.keys(data) as ("answer_checkbox" | "notes" | "image" | "other")[];
                    keys.forEach(key => {
                        if (key === 'answer_checkbox') {
                            const values: string[] = getIn(clientData?.data?.aesthetic_insterests?.length ? clientData?.data?.aesthetic_insterests[0] : [], `data_new.aesthetic_interest.${index}.${key}`) || [];

                            newData[key] = values.length === data.answer_checkbox?.length ? values.map((value: string) => parseInt(value.toString()) as 0 | 1) : data.answer_checkbox;
                        } else {
                            newData[key] = getIn(clientData?.data?.aesthetic_insterests?.length ? clientData?.data?.aesthetic_insterests[0] : '', `data_new.aesthetic_interest.${index}.${key}`) || data[key];
                        }

                    });

                    return newData;
                })
            } : {
                data: INITIAL_AESTETHIC_STATE,
            }}
            enableReinitialize
            validate={validateAestheticInterest}
            onSubmit={async (values, { setSubmitting, resetForm, setFieldError }) => {

                const response = await fetch(api.aestheticStore.replace(':id', clientId!), {
                    method: 'POST',
                    headers: {
                        'X-App-Locale': strings.getLanguage(),
                        'X-Time-Zone': timeZone(),
                        Accept: 'application/json',
                    },
                    credentials: 'include',
                    body: getAestheticInterest(values.data),
                });
                if (response.status === 401) {
                    navigate('/');
                }
                const data = await response.json();
                if (data.status !== '1') {
                    setFieldError('server', data.message || 'server error, please contact admin.');
                } else {
                    toast.success(data.message || 'aesthetic interest updated successfully.');
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
                        size="large"
                        open={openModal}
                        title={strings.VIEWAESTETHICINTEREST}
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
                                    if (!dirty && clientData?.data?.aesthetic_insterests?.length) {
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

                                <AestheticInterestComponent />
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

export default ClientAestheticInterestModal;