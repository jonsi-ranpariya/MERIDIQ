import Button from '@components/form/Button';
import { Formik } from 'formik';
import { useRef } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import SignaturePad from 'signature_pad';
import api from '../../../../configs/api';
import { convertBase64ToFile } from '../../../../helper';
import { ClientTreatment } from '../../../../interfaces/model/clientTreatment';
import strings from '../../../../lang/Lang';
import ServerError from '../../../../partials/Error/ServerError';
import FormikErrorFocus from '../../../../partials/FormikErrorFocus/FormikErrorFocus';
import CancelButton from '../../../../partials/MaterialButton/CancelButton';
import Modal from '../../../../partials/MaterialModal/Modal';
import MaterialSignturePad from '../../../../partials/SignaturePad/MaterialSignaturePad';
import { validateClientProcedureEdit } from '../../../../validations';

export interface ClientProcedureSignModalProps {
    selectedProcedure?: ClientTreatment,
    openModal: boolean,
    onClose: () => void,
    mutate?: () => Promise<any>,
}

export interface IClientProcedureSignModalValues {
    sign: string,
    server?: string,
}

const ClientProcedureSignModal: React.FC<ClientProcedureSignModalProps> = ({
    openModal,
    onClose,
    selectedProcedure,
    mutate = async () => {},
}) => {
    const navigate = useNavigate();
    const canvasRef = useRef<SignaturePad>();

    return (
        <Formik<IClientProcedureSignModalValues>
            initialValues={{
                sign: '',
            }}
            enableReinitialize
            validate={validateClientProcedureEdit}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                const formData = new FormData();

                if (values.sign) {
                    formData.append('sign', convertBase64ToFile(values.sign));
                }

                const response = await fetch(api.clientProcedureUpdate.replace(':id', selectedProcedure?.id.toString() || ''), {
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
                    onClose()
                } else {
                    setFieldError('server', data.message || 'server error, please contact admin.');
                }
                setSubmitting(false);
            }}
        >
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, resetForm }) => {

                const handleModelClose = async () => {
                    if (isSubmitting || isValidating) return;
                    onClose()
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={strings.UPDATE_PROCEDURE}
                        handleClose={handleModelClose}
                        cancelButton={
                            <CancelButton
                                disabled={!!isSubmitting}
                                onClick={handleModelClose}
                            />
                        }
                        submitButton={
                            <Button
                                loading={!!isSubmitting}
                                onClick={() => handleSubmit()}
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
                                            await setFieldValue('sign', canvasRef.current.toDataURL());
                                            setFieldTouched('sign', true);
                                        }}
                                        error={touched?.sign && Boolean(errors.sign)}
                                        helperText={touched?.sign && errors.sign}
                                        onClear={async () => {
                                            await setFieldValue('sign', '');
                                            await setFieldTouched('sign', false);
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

export default ClientProcedureSignModal;