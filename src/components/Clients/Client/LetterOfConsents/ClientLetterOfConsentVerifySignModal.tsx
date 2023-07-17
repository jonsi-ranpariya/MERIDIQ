import Button from '@components/form/Button';
import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import SignaturePad from 'signature_pad';
import api from '../../../../configs/api';
import { convertBase64ToFile } from '../../../../helper';
import { ClientLetterOfConsent } from '../../../../interfaces/model/clientLetterOfConsent';
import strings from '../../../../lang/Lang';
import ServerError from '../../../../partials/Error/ServerError';
import FormikErrorFocus from '../../../../partials/FormikErrorFocus/FormikErrorFocus';
import CancelButton from '../../../../partials/MaterialButton/CancelButton';
import Modal from '../../../../partials/MaterialModal/Modal';
import MaterialSignturePad from '../../../../partials/SignaturePad/MaterialSignaturePad';
import { validateClientLetterOfConsentEdit } from '../../../../validations';

export interface ClientLetterOfConsentVerifySignModalProps {
    selectedLetterOfConsent?: ClientLetterOfConsent,
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate?: () => Promise<any>,
}

export interface IClientLetterOfConsentEditValues {
    verified_sign: string,
    server?: string,
}

const ClientLetterOfConsentVerifySignModal: React.FC<ClientLetterOfConsentVerifySignModalProps> = ({
    openModal,
    setOpenModal,
    selectedLetterOfConsent,
    mutate = async () => {},
}) => {
    const navigate = useNavigate();

    const canvasRef = React.useRef<SignaturePad>(null);

    return (
        <Formik<IClientLetterOfConsentEditValues>
            initialValues={{
                verified_sign: '',
            }}
            enableReinitialize
            validate={validateClientLetterOfConsentEdit}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                const formData = new FormData();

                if (values.verified_sign) {
                    formData.append('verified_sign', convertBase64ToFile(values.verified_sign));
                }

                const response = await fetch(api.clientLetterOfConsentUpdate.replace(':id', selectedLetterOfConsent?.id.toString() || ''), {
                    method: 'POST',
                    headers: {
                        "Accept": 'application/json',
                        // "Content-Type": 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': 'test',
                        'X-App-Locale': strings.getLanguage(),
                    },
                    credentials: "include",
                    body: formData,
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

                const handleModelClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false)
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={strings.UPDATE_LETTER_OF_CONSENT}
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
                                    return handleSubmit();
                                }}
                            >{strings.Submit}
                            </Button>
                        }
                        closeOnBackdropClick={false}
                    >
                        <FormikErrorFocus />
                        <div className="">
                            <div className="p-4">
                                <div className="grid grid-flow-row grid-cols-1 gap-4">
                                    <MaterialSignturePad
                                        ref={canvasRef}
                                        onEnd={async () => {
                                            if (!canvasRef || !canvasRef.current) return;
                                            await setFieldValue('verified_sign', canvasRef.current.toDataURL());
                                            setFieldTouched('verified_sign', true);
                                        }}
                                        error={touched?.verified_sign && Boolean(errors.verified_sign)}
                                        helperText={touched?.verified_sign && errors.verified_sign}
                                        onClear={async () => {
                                            await setFieldValue('verified_sign', '');
                                            await setFieldTouched('verified_sign', false);
                                            canvasRef.current?.clear();
                                        }}
                                    />
                                    <ServerError error={errors?.server} className="mt-4" />
                                </div>
                            </div>
                        </div>
                    </Modal >
                );
            }}
        </Formik>
    );
}

export default ClientLetterOfConsentVerifySignModal;