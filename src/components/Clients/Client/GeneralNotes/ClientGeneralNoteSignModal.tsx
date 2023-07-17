import Button from '@components/form/Button';
import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SignaturePad from 'signature_pad';
import api from '../../../../configs/api';
import { convertBase64ToFile } from '../../../../helper';
import { GeneralNote } from '../../../../interfaces/model/generalNote';
import strings from '../../../../lang/Lang';
import ServerError from '../../../../partials/Error/ServerError';
import FormikErrorFocus from '../../../../partials/FormikErrorFocus/FormikErrorFocus';
import CancelButton from '../../../../partials/MaterialButton/CancelButton';
import Modal from '../../../../partials/MaterialModal/Modal';
import MaterialSignturePad from '../../../../partials/SignaturePad/MaterialSignaturePad';
import { validateClientGeneralNoteSign } from '../../../../validations';

export interface ClientGeneralNoteSignModalProps {
    selectedGeneralNote?: GeneralNote,
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate?: () => Promise<any>,
}

export interface IClientGeneralNoteSignValues {
    sign: string,
    server?: string,
}

const ClientGeneralNoteSignModal: React.FC<ClientGeneralNoteSignModalProps> = ({
    selectedGeneralNote,
    openModal,
    setOpenModal,
    mutate = async () => {},
}) => {
    const navigate = useNavigate();
    const canvasRef = React.useRef<SignaturePad>(null);

    return (
        <Formik<IClientGeneralNoteSignValues>
            initialValues={{
                sign: '',
            }}
            enableReinitialize
            validate={validateClientGeneralNoteSign}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                const formData = new FormData();
                if (values.sign) {
                    formData.set('sign', convertBase64ToFile(values.sign));
                }
                const response = await fetch(api.generalNoteUpdate.replace(':generalNoteId', selectedGeneralNote?.id.toString() || ''), {
                    method: 'POST',
                    headers: {
                        "Accept": 'application/json',
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
                        title={!selectedGeneralNote ? strings.NewNote : strings.UpdateNote}
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
                                    if (handleSubmit) return handleSubmit();
                                }}
                            >{strings.Submit}
                            </Button>
                        }
                        closeOnBackdropClick={false}
                    >
                        <FormikErrorFocus />
                        <div className="p-4">
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
                    </Modal>
                );
            }}
        </Formik>
    );
}

export default ClientGeneralNoteSignModal;