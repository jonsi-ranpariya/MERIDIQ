import * as React from 'react';
import { useParams } from "react-router";
import useSWR from "swr";
import api from "../../configs/api";
import { commonFetch, convertBase64ToFile, getAestheticInterest, isDataURL, timeZone } from "../../helper";
import { CompanyClientExtraFieldResponse, QuestionaryResponse, SettingResponse, UsersResponse } from "../../interfaces/common";
import { AestheticInterestValues, Covid19QuestionaryValues, HealthQuestionaryValues, INITIAL_AESTETHIC_STATE, INITIAL_COVID19_STATE, INITIAL_HEALTH_STATE } from '../../interfaces/questionary';
import strings from '../../lang/Lang';
import FullPageError from '../../partials/Error/FullPageError';
import ServerError from "../../partials/Error/ServerError";
import FullPageLoading from '../../partials/Loadings/FullPageLoading';
import { useConfirmation } from '../../provider/ConfirmationProvider';
import {
    validateAestheticInterest, validateClientDynamicQuestionnaire, validateCovid19Questionary, validateHealthQuestionary, validateRegistrationPortalClient
} from '../../validations';
import { DynamicQuestionaryValues } from '../Clients/Client/Questionaries/DynamicQuestionary/ClientDynamicQuestionariesModal';
import RegistrationPortal1 from "./pages/RegistrationPortal1";
import RegistrationPortal2, { RegistrationPortal2Values } from "./pages/RegistrationPortal2";
import RegistrationPortal3 from './pages/RegistrationPortal3';
import RegistrationPortal4 from './pages/RegistrationPortal4';
import RegistrationPortal5 from './pages/RegistrationPortal5';
import RegistrationPortal6LoC, { IClientLetterOfConsentMultipleValues } from './pages/RegistrationPortal6LoC';
import RegistrationPortalDynamicQuestionary from './pages/RegistrationPortalDynamicQuestionary';
import RegistrationPortalWizard, { RegistrationPortalWizardStep } from './RegistrationPortalWizard';

export interface RegistrationPortalProps {

}

const RegistrationPortal: React.FC<RegistrationPortalProps> = () => {

    const { companyId }: { companyId?: string } = useParams();

    const { data: companyData, error: companyError } = useSWR<UsersResponse, Error>(api.companyPublicUsers.replace(":id", companyId!), commonFetch);
    const { data: settingData, error: settingError } = useSWR<SettingResponse, Error>(api.settingPublic.replace(":id", companyId!), commonFetch);
    const { data: questionaryData, error: questionaryError } = useSWR<QuestionaryResponse, Error>(api.questionnairesPublic.replace(":company_id", companyId!), commonFetch);
    const { data: clientFieldData, error: clientFieldError } = useSWR<CompanyClientExtraFieldResponse, Error>(api.companyClientExtraFieldsPublic.replace(":id", companyId!), commonFetch);
    const showSignature = React.useMemo(() => !!settingData?.data.find((setting) => setting.key === api.LOC_CHECKBOX && setting.value === '0'), [settingData?.data])

    const [serverError, setServerError] = React.useState('');
    const confirm = useConfirmation();
    const clientEmail = React.useRef('');
    const loading = !companyData && !companyError;
    const settingloading = !settingData && !settingError;
    const questionaryloading = !questionaryData && !questionaryError;
    const clientFieldLoading = !clientFieldData && !clientFieldError;

    if (loading || settingloading || questionaryloading || clientFieldLoading) {
        return <FullPageLoading />
    }

    if (companyError) {
        return <FullPageError code={companyError?.status || 500} message={companyError.message || 'Server error, contact admin.'} />
    }

    if (questionaryError) {
        return <FullPageError code={questionaryError?.status || 500} message={questionaryError.message || 'Server error, contact admin.'} />
    }

    if (settingError) {
        return <FullPageError code={settingError?.status || 500} message={settingError.message || 'Server error, contact admin.'} />
    }

    if (clientFieldError) {
        return <FullPageError code={clientFieldError?.status || 500} message={clientFieldError.message || 'Server error, contact admin.'} />
    }

    return (
        <div className="container max-w-5xl mx-auto bg-white md:bg-transparent p-0 md:px-4">
            <RegistrationPortalWizard
                onSubmit={async (values) => {
                    let formData = new FormData();

                    const keys = Object.keys(values);

                    formData.set('verify', values?.hasConsent ?? false);

                    if (keys.includes('client')) {
                        const clientData = values.client as RegistrationPortal2Values;

                        formData.set('first_name', clientData.first_name);
                        formData.set('last_name', clientData.last_name);
                        formData.set('email', clientData.email);
                        formData.set('company_id', clientData.companyId);
                        formData.set('phone_number', clientData.phone_number);
                        formData.set('personal_id', clientData.personal_id);
                        formData.set('social_security_number', clientData.social_security_number);
                        formData.set('occupation', clientData.occupation);

                        formData.set('addressess[0][street_address]', clientData.street_address);
                        formData.set('addressess[0][city]', clientData.city);
                        formData.set('addressess[0][state]', clientData.state);
                        formData.set('addressess[0][zip_code]', clientData.zip_code);
                        formData.set('addressess[0][country]', clientData.country || '');

                        if (clientData.profile_picture) {
                            formData.set('profile_picture', convertBase64ToFile(clientData.profile_picture))
                        }

                        for (let index = 0; index < (clientData.extra ?? []).length; index++) {
                            formData.set(`extra[${index}][id]`, clientData.extra[index].id.toString());
                            formData.set(`extra[${index}][value]`, clientData.extra[index].value);
                        }
                    }

                    if (keys.includes('health_questionaries')) {
                        const healthData = values.health_questionaries as HealthQuestionaryValues;
                        healthData.data.forEach((healthQuestion, index) => {
                            if (Object.keys(healthQuestion).includes('answer')) {
                                formData.set(`health_questions[${index}][answer]`, healthQuestion.answer === 1 ? 'yes' : 'no')
                            }
                            if (Object.keys(healthQuestion).includes('more_info')) {
                                formData.set(`health_questions[${index}][more_info]`, healthQuestion?.more_info || '');
                            }
                        })
                    }

                    if (keys.includes('aesthetic_interest')) {
                        const aestheticData = values.aesthetic_interest as AestheticInterestValues;
                        formData = getAestheticInterest(aestheticData.data, '', formData);
                    }

                    if (keys.includes('covid19')) {
                        const covid19Data = values.covid19 as Covid19QuestionaryValues;
                        covid19Data.data.forEach((covid19, index) => {
                            if (Object.keys(covid19).includes('answer')) {
                                formData.set(`covid19[${index}][answer]`, covid19.answer === 1 ? 'yes' : 'no')
                            }
                            if (Object.keys(covid19).includes('more_info')) {
                                formData.set(`covid19[${index}][more_info]`, covid19?.more_info || '');
                            }
                        })
                    }

                    if (keys.includes('letter_of_consent')) {
                        const letterData = values.letter_of_consent as IClientLetterOfConsentMultipleValues;
                        letterData.values.forEach((letter, index) => {
                            const letterKeys = Object.keys(letter);

                            if (letterKeys.includes('consent_id')) {
                                formData.set(`letter_of_consents[${index}][consent_id]`, letter.consent_id.toString());
                            }
                            if (letterKeys.includes('is_publish_before_after_pictures')) {
                                formData.set(`letter_of_consents[${index}][is_publish_before_after_pictures]`, letter.is_publish_before_after_pictures?.toString() || '');
                            }
                            if (letterKeys.includes('signed_file') && letter.signed_file) {
                                formData.set(`letter_of_consents[${index}][signed_file]`, letter.signed_file);
                            }
                            if (letterKeys.includes('signature') && letter.signature && isDataURL(letter.signature)) {
                                formData.set(`letter_of_consents[${index}][signature]`, convertBase64ToFile(letter.signature));
                            }
                        })
                    }


                    questionaryData?.data?.forEach((questionary, index) => {
                        if (keys.includes(`questionary_${questionary.id}`)) {
                            const questionaryData = values[`questionary_${questionary.id}`] as DynamicQuestionaryValues;


                            questionaryData.data.forEach((data, dataIndex) => {
                                const isTextArea = data.type === api.questionTypes1.textbox.value;
                                const isYesNo = data.type === api.questionTypes1.yes_no_textbox.value || data.type === api.questionTypes1.yes_no.value;
                                const isYesNoTextArea = data.type === api.questionTypes1.yes_no_textbox.value;

                                if (isYesNo) {
                                    formData.set(`questionary[${index}][data][${dataIndex}][value]`, data.value === 1 ? 'yes' : (data.value === 0 ? 'no' : ''))
                                }
                                if (isYesNoTextArea) {
                                    formData.set(`questionary[${index}][data][${dataIndex}][text]`, data.text);
                                }
                                if (isTextArea) {
                                    formData.set(`questionary[${index}][data][${dataIndex}]`, data.text);
                                }

                            })
                        }
                    });

                    const response = await fetch(api.clientPublicStore, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'X-App-Locale': strings.getLanguage(),
                            'X-Time-Zone': timeZone(),
                        },
                        body: formData,
                    })
                    const data = await response.json();

                    if (data.status === '1') {
                        try {
                            await confirm({
                                open: true,
                                submitText: strings.Okay,
                                showSubmit: true,
                                title: "Congrats",
                                children: (
                                    <div className="p-4">
                                        <div className="mb-2">{strings.You_have_now_sucessfully_created_your_profile_at} <b>{companyData?.data?.find(() => true)?.company?.company_name}</b>.</div>
                                        <div className="mb-2">{`${strings.We_are_looking_forward_to_your_visit}`}</div>
                                    </div>
                                )
                            });
                            window.location.reload();
                        } catch (error) {
                        }

                    } else {
                        setServerError(data?.message || 'server error, please contact admin.');
                    }
                }}
            >
                <RegistrationPortalWizardStep<{}>
                    name="test"
                    initialValues={{}}
                    title=""
                    validate={() => { }}
                    onSubmit={() => { }}
                >
                    <RegistrationPortal1 />
                </RegistrationPortalWizardStep>

                <RegistrationPortalWizardStep<RegistrationPortal2Values>
                    title={strings.continue}
                    name="client"
                    validate={(values) => validateRegistrationPortalClient(values, settingData?.data ?? [], clientFieldData?.data ?? [])}
                    initialValues={{
                        profile_picture: '',
                        first_name: '',
                        last_name: '',
                        personal_id: '',
                        social_security_number: '',
                        email: '',
                        phone_number: '',
                        occupation: '',
                        country_code: '',
                        city: '',
                        country: '',
                        state: '',
                        street_address: '',
                        zip_code: '',
                        companyId: companyId!,
                        extra: clientFieldData?.data?.map((field) => {
                            return {
                                id: field.id,
                                value: '',
                                name: field.name,
                                required: field.required
                            };
                        }) ?? [],
                    }}
                    onSubmit={async (values, { resetForm, setErrors, setSubmitting, setFieldError }) => {
                        clientEmail.current = values.email;

                        const response = await fetch(api.clientPublicCreate, {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                                'X-App-Locale': strings.getLanguage(),
                            },
                            body: JSON.stringify({ ...values, company_id: values.companyId }),
                        });

                        const data = await response.json();
                        if (response.status === 200) {
                            if (data.status === '1') {
                                if (data?.data?.email) {
                                    setFieldError('email', strings.enter_unique_email);
                                    return false;
                                }
                            }
                        }
                        if (data?.message && data?.status !== '1') {
                            setFieldError('server', data.message);
                            return false;
                        }
                    }}
                >
                    <RegistrationPortal2 settings={settingData?.data ?? []} />
                </RegistrationPortalWizardStep>
                {settingData?.data.filter((data) => data.value === '1').sort((a, b) => {
                    if (a.key === 'SHOW_HEALTH_QUESTIONNAIRE') {
                        return 1;
                    }
                    if (a.key === 'SHOW_AESTHETIC_INTEREST') {
                        return 2;
                    }
                    if (a.key === 'SHOW_LETTER_OF_CONSENT') {
                        return 3;
                    }
                    if (a.key === 'SHOW_COVID_19') {
                        return 4;
                    }
                    return 0
                }).map((data) => {
                    if (data.key === 'SHOW_HEALTH_QUESTIONNAIRE') {
                        return (
                            <RegistrationPortalWizardStep<HealthQuestionaryValues>
                                title={strings.NEXT_HEALTHQUESTIONNAIRE}
                                initialValues={{
                                    data: INITIAL_HEALTH_STATE
                                }}
                                name="health_questionaries"
                                validate={validateHealthQuestionary}
                                onSubmit={() => { }}
                                key={data.key}
                            >
                                <RegistrationPortal3 />
                            </RegistrationPortalWizardStep>
                        )
                    }

                    if (data.key === 'SHOW_AESTHETIC_INTEREST') {
                        return (
                            <RegistrationPortalWizardStep<AestheticInterestValues>
                                title={strings.NEXT_AESTETHIC_QUESTIONNAIRE}
                                initialValues={{
                                    data: INITIAL_AESTETHIC_STATE
                                }}
                                name="aesthetic_interest"
                                validate={validateAestheticInterest}
                                onSubmit={() => { }}
                                key={data.key}
                            >
                                <RegistrationPortal4 />
                            </RegistrationPortalWizardStep>
                        );

                    }

                    if (data.key === 'SHOW_COVID_19') {
                        return (
                            <RegistrationPortalWizardStep<Covid19QuestionaryValues>
                                title={strings.NEXT_COVID19}
                                initialValues={{
                                    data: INITIAL_COVID19_STATE
                                }}
                                name="covid19"
                                validate={validateCovid19Questionary}
                                onSubmit={() => { }}
                                key={data.key}
                            >
                                <RegistrationPortal5 />
                            </RegistrationPortalWizardStep>
                        );

                    }

                    if (data.key === 'SHOW_LETTER_OF_CONSENT') {
                        return (
                            <RegistrationPortalWizardStep<IClientLetterOfConsentMultipleValues>
                                title={strings.NEXT_LETTER_OF_CONSENTS}
                                initialValues={{
                                    values: [],
                                    consent_id: 0,
                                    signature: '',
                                    showSignature: showSignature,
                                    consent_agreed: false,
                                    is_publish_before_after_pictures: null,
                                }}
                                name="letter_of_consent"
                                validate={() => { }}
                                onSubmit={async () => {
                                    try {
                                        await confirm({
                                            open: true,
                                            submitText: 'Ok',
                                            showSubmit: true,
                                            title: strings.Information,
                                            children: (
                                                <div className="p-4">
                                                    <div className="mb-2">{strings.letter_of_consent_email_message}</div>
                                                    <p className="text-xl mb-2 text-break font-bold">{clientEmail.current}</p>
                                                    <div className="">{strings.letter_of_consent_email_message_2}</div>
                                                </div>
                                            )
                                        })
                                    } catch (error) {

                                    }
                                }}
                                key={data.key}
                            >
                                <RegistrationPortal6LoC />
                            </RegistrationPortalWizardStep>
                        );

                    }

                    return undefined;
                })}
                {questionaryData?.data?.map((questionary, index) => {
                    return <RegistrationPortalWizardStep<DynamicQuestionaryValues>
                        key={`questionary_${questionary.id}`}
                        initialValues={{
                            data: questionary.questions?.map((question, index) => {
                                return {
                                    question: question.question,
                                    type: question.type,
                                    value: '',
                                    text: '',
                                };
                            }) || []
                        }}
                        validate={(values) => validateClientDynamicQuestionnaire(values, questionary?.questions || [])}
                        name={`questionary_${questionary.id}`}
                        title={`NEXT: ${questionary.title}`}
                    >
                        <RegistrationPortalDynamicQuestionary title={questionary.title} />
                    </RegistrationPortalWizardStep>
                })}
            </RegistrationPortalWizard>
            <ServerError className="mt-4" error={serverError} />
        </div >
    );
}

export default RegistrationPortal;