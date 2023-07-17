import Autocomplete from '@components/form/Autocomplete';
import Button from '@components/form/Button';
import { LetterOfConsent } from '@interface/model/letterOfConsent';
import { Formik } from 'formik';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import SignaturePad from 'signature_pad';
import useSWR from 'swr';
import api from '../../../../configs/api';
import { commonFetch, convertBase64ToFile, generateClientFullName } from '../../../../helper';
import useTheme from '../../../../hooks/useTheme';
import { ClientResponse, LetterOfConsentResponse, SettingResponse } from '../../../../interfaces/common';
import strings from '../../../../lang/Lang';
import ServerError from '../../../../partials/Error/ServerError';
import FormikErrorFocus from '../../../../partials/FormikErrorFocus/FormikErrorFocus';
import CancelButton from '../../../../partials/MaterialButton/CancelButton';
import Checkbox from '../../../../partials/MaterialCheckbox/MaterialCheckbox';
import Modal from '../../../../partials/MaterialModal/Modal';
import QuestionYesNo from '../../../../partials/Portal/QuestionYesNo';
import MaterialSignturePad from '../../../../partials/SignaturePad/MaterialSignaturePad';
import { validateClientLetterOfConsent } from '../../../../validations';

export interface ClientLetterOfConsentModalProps {
    openModal: boolean,
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>,
    mutate?: () => Promise<any>,
}

export interface IClientLetterOfConsentValues {
    consent_id: number,
    is_publish_before_after_pictures: 0 | 1 | null,
    signature?: string | null,
    showSignature?: boolean,
    server?: string,
    consent_agreed: boolean,
}

const ClientLetterOfConsentModal: React.FC<ClientLetterOfConsentModalProps> = ({
    openModal,
    setOpenModal,
    mutate = async () => { },
}) => {
    const navigate = useNavigate();

    const { clientId }: { clientId?: string } = useParams();

    const { isSystemDarkTheme } = useTheme()

    const { data: client } = useSWR<ClientResponse, Error>(
        api.clientSingle(clientId),
        commonFetch
    );

    const { data } = useSWR<LetterOfConsentResponse, Error>(api.letterOfConsent, commonFetch);
    const { data: settingData } = useSWR<SettingResponse, Error>(api.setting, commonFetch);

    const showSignature = React.useMemo(() => !!settingData?.data.find((setting) => setting.key === api.LOC_CHECKBOX && setting.value === '0'), [settingData?.data])

    const canvasRef = React.useRef<SignaturePad>(null);

    const textData = React.useCallback((consent_id: number) => {
        if (data?.data && data?.data.length) {
            const letterOfConsent = data.data.find((letterOfConsent) => letterOfConsent.id === consent_id);
            if (letterOfConsent && letterOfConsent.letter_html) {
                // eslint-disable-next-line react/no-danger
                return <div className={isSystemDarkTheme ? 'prose-dark' : 'prose'} dangerouslySetInnerHTML={{ __html: letterOfConsent.letter_html }} />;
            } if (letterOfConsent && letterOfConsent.letter) {
                return <p>{letterOfConsent.letter}</p>;
            }
        }
    }, [data, isSystemDarkTheme]);

    return (
        <Formik<IClientLetterOfConsentValues>
            initialValues={{
                consent_id: 0,
                signature: '',
                showSignature: showSignature,
                is_publish_before_after_pictures: null,
                consent_agreed: false,
            }}
            enableReinitialize
            validate={validateClientLetterOfConsent}
            onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                const formData = new FormData();
                formData.set('is_publish_before_after_pictures', values.is_publish_before_after_pictures?.toString() || '');
                if (values.consent_id) {
                    formData.set('consent_id', values.consent_id.toString());
                }

                if (values.signature) {
                    formData.set('signature', convertBase64ToFile(values.signature))
                }

                const response = await fetch(api.clientLetterOfConsentStore.replace(':id', clientId!), {
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
            {({ errors, values, touched, dirty, setFieldValue, setFieldTouched, handleSubmit, isSubmitting, isValidating, resetForm, submitForm }) => {

                const handleModelClose = async () => {
                    if (isSubmitting || isValidating) return;
                    setOpenModal(false)
                    await resetForm();
                }
                return (
                    <Modal
                        open={openModal}
                        title={strings.ADD_LETTER_OF_CONSENT}
                        handleClose={handleModelClose}
                        cancelButton={
                            <CancelButton
                                disabled={isSubmitting}
                                onClick={handleModelClose}
                                children={strings.Cancel}
                            />
                        }
                        submitButton={
                            <Button
                                loading={isSubmitting || isValidating}
                                type="submit"
                                onClick={submitForm}
                                children={strings.Submit}
                            />
                        }
                    // closeOnBackdropClick={!showSignature}
                    >
                        <FormikErrorFocus />
                        <div className="">
                            <div className="p-4">
                                <div className="grid grid-flow-row grid-cols-1 gap-4">
                                    <Autocomplete<LetterOfConsent>
                                        options={data?.data || []}
                                        filteredValues={(query) => data?.data.filter((val) => val.consent_title.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))) ?? []}
                                        value={data?.data.find((consent) => consent.id === values.consent_id)}
                                        displayValue={(option) => option?.consent_title ?? ""}
                                        renderOption={(option) => option.consent_title}
                                        onChange={(value) => {
                                            setFieldTouched('consent_id')
                                            setFieldValue('consent_id', value?.id)
                                        }}
                                        error={touched?.consent_id && errors.consent_id}
                                        inputProps={{ placeholder: strings.Select_a_consent }}
                                    />

                                    {values.consent_id ?
                                        <div>
                                            <p className="font-semibold mb-1">{strings.Information}</p>
                                            {textData(values.consent_id)}
                                        </div>
                                        : <></>}

                                    <QuestionYesNo
                                        question={strings.Are_we_allowed_to_publish_before_and_after_pictures}
                                        onChange={(val) => {
                                            setFieldTouched('is_publish_before_after_pictures');
                                            setFieldValue('is_publish_before_after_pictures', val)
                                        }}
                                        name="is_publish_before_after_pictures"
                                        showBullet
                                        value={values.is_publish_before_after_pictures}
                                        error={touched?.is_publish_before_after_pictures && Boolean(errors.is_publish_before_after_pictures)}
                                        helperText={touched?.is_publish_before_after_pictures && errors.is_publish_before_after_pictures}
                                    />

                                    {
                                        showSignature
                                            ? <MaterialSignturePad
                                                ref={canvasRef}
                                                onEnd={async () => {
                                                    if (!canvasRef || !canvasRef.current) return;
                                                    await setFieldValue('signature', canvasRef.current.toDataURL());
                                                    setFieldTouched('signature', true);
                                                }}
                                                error={touched?.signature && Boolean(errors.signature)}
                                                helperText={touched?.signature && errors.signature}
                                                onClear={async () => {
                                                    await setFieldValue('signature', '');
                                                    await setFieldTouched('signature', false);
                                                    canvasRef.current?.clear();
                                                }}
                                            />
                                            : <Checkbox
                                                checked={values.consent_agreed}
                                                onChange={(e) => {
                                                    setFieldTouched('consent_agreed');
                                                    setFieldValue('consent_agreed', e.target.checked)
                                                }}
                                                error={touched?.consent_agreed && Boolean(errors.consent_agreed)}
                                                helperText={touched?.consent_agreed && errors.consent_agreed}
                                                name="consent_agreed"
                                                label={strings.formatString(strings.i_accept_the_consent, generateClientFullName(client?.data)) as string}
                                            />
                                    }


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

export default ClientLetterOfConsentModal;