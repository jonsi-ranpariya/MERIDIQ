import Button from '@components/form/Button';
import Input from "@components/form/Input";
import TipTapEditor from "@components/TipTap/TipTapEditor";
import { Formik } from "formik";
import React from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../../configs/api";
import { LetterOfConsent } from "../../interfaces/model/letterOfConsent";
import strings from "../../lang/Lang";
import ServerError from "../../partials/Error/ServerError";
import FormikErrorFocus from "../../partials/FormikErrorFocus/FormikErrorFocus";
import CancelButton from "../../partials/MaterialButton/CancelButton";
import Modal from "../../partials/MaterialModal/Modal";
import { validateLetterConsentStore } from "../../validations";

export interface ILetterOfConsentValues {
    consent_title: string,
    // letter_json: string,
    letter_html: string,
    // initialLetterJson: string | object,
    is_publish_before_after_pictures: "0" | "1",
    server?: string,
}

export interface LetterOfConsentModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate: () => Promise<any>,
    selectedLetter?: LetterOfConsent
}

const LetterOfConsentModal: React.FC<LetterOfConsentModalProps> = ({
    openModal, setOpenModal, mutate, selectedLetter
}) => {

    const navigate = useNavigate();

    return (
        <Formik<ILetterOfConsentValues>
            initialValues={!selectedLetter ? {
                consent_title: '',
                letter_html: '',
                is_publish_before_after_pictures: "0",
                // initialLetterJson: '',
            } : {
                consent_title: selectedLetter.consent_title,
                letter_html: `${selectedLetter.letter_html ? selectedLetter.letter_html ?? '' : (selectedLetter.letter ?? '')}`,
                // initialLetterJson: (selectedLetter.letter_json && selectedLetter.letter_json.blocks.length && selectedLetter.letter_html) ? selectedLetter.letter_json : selectedLetter.letter,
                is_publish_before_after_pictures: selectedLetter.is_publish_before_after_pictures,
            }}
            enableReinitialize
            validate={validateLetterConsentStore}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                const response = await fetch(!selectedLetter ? api.letterOfConsentStore : api.letterOfConsentUpdate(selectedLetter.id), {
                    method: 'POST',
                    headers: {
                        "Accept": 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': 'test',
                        'Content-Type': 'application/json',
                        'X-App-Locale': strings.getLanguage(),
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        ...values,
                        is_publish_before_after_pictures: values.is_publish_before_after_pictures ? '1' : '0',
                    }),
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
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, setFieldError, resetForm, handleBlur, handleChange }) => {

                const handleClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false);
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={!selectedLetter ? strings.ADD_LETTER_OF_CONSENT : strings.UPDATE_LETTER_OF_CONSENT}
                        handleClose={handleClose}
                        cancelButton={
                            <CancelButton
                                disabled={isSubmitting}
                                onClick={handleClose}
                            />
                        }
                        submitButton={
                            <Button
                                loading={isSubmitting}
                                onClick={() => {
                                    if (!dirty && selectedLetter) {
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
                        <div className="p-4 space-y-4">
                            <FormikErrorFocus />
                            <Input
                                label={strings.CONSENT_TITLE}
                                required
                                name="consent_title"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.consent_title}
                                error={touched?.consent_title && errors.consent_title}
                            />
                            <TipTapEditor
                                onChange={async (data) => {

                                    await setFieldValue('letter_html', data)
                                    await setFieldTouched('letter_html');
                                }}
                                data={values.letter_html ?? values.letter_html ?? ''}
                                error={touched?.letter_html && Boolean(errors.letter_html)}
                                helperText={touched?.letter_html ? errors.letter_html : ''}
                            />
                            <ServerError error={errors?.server} className="mt-4" />
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{strings.form_bottom_sign_line}</p>
                        </div>
                    </Modal >
                );
            }}
        </Formik>

    );
}

export default LetterOfConsentModal;