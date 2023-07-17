import { IClientVerificationValues } from '@components/Clients/Client/Verification/ClientVerificationModal';
import { FormikErrors } from 'formik';
import { ICategoryValues } from './components/Category/CategoryModal';
import { IClientAftercareValues } from './components/Clients/Client/Aftercare/ClientAftercareModal';
import { IClientGeneralNotesValues } from './components/Clients/Client/GeneralNotes/ClientGeneralNoteModal';
import { IClientGeneralNoteSignValues } from './components/Clients/Client/GeneralNotes/ClientGeneralNoteSignModal';
import { IClientLetterOfConsentValues } from './components/Clients/Client/LetterOfConsents/ClientLetterOfConsentModal';
import { IClientLetterOfConsentEditValues } from './components/Clients/Client/LetterOfConsents/ClientLetterOfConsentVerifySignModal';
import { IClientMediaValues } from './components/Clients/Client/Media/ClientMediaModal';
import { IClientNextOfKindValues } from './components/Clients/Client/NextofKind/ClientNextOfKindModal';
import { IClientProcedureSignModalValues } from './components/Clients/Client/Procedures/ClientProcedureVerifySignModal';
import { IClientProcedureCreateValues } from './components/Clients/Client/Procedures/create/ClientProcedureCreate';
import { DynamicQuestionaryValues } from './components/Clients/Client/Questionaries/DynamicQuestionary/ClientDynamicQuestionariesModal';
import { IClientValues } from './components/Clients/ClientModal';
import { ICompanyValues } from './components/CompanySettings/CompanyEditModal';
import { ICompanyUserMasterAdminValues } from './components/CompanySettings/Users/CompanyUserModal';
import { IInviteAFriendValues } from './components/InviteAFriend';
import { ILetterOfConsentValues } from './components/LetterOfConsents/LetterOfConsentModal';
import { IChangePasswordValues } from './components/MyProfile/MyProfileChangePassword';
import { ICompantUserValues } from './components/MyProfile/MyProfileEditModal';
import { IQuestionaryValues } from './components/Questionnaires/QuestionnaireModal';
import { IQuestionaryQuestionValues } from './components/Questionnaires/Questions/QuestionnaireQuestionModal';
import { RegistrationPortal2Values } from './components/RegistrationPortal/pages/RegistrationPortal2';
import { ISupportValues } from './components/Support';
import { ITemplateValues } from './components/Templates/TemplateModal';
import { ITreatmentValues } from './components/Treatments/TreatmentModal';
import { IClientMergeValues } from '@components/Clients/Client/Merge/ClientMergeAccount';
import { IClientMergeConfirmValue } from '@components/Clients/Client/Merge/ClientMergeConfirm';
import config from './config';
import api from './configs/api';
import { isValidDate } from './helper';
import { CompanyClientExtraField } from './interfaces/model/companyClientExtraField';
import { QuestionaryQuestion } from './interfaces/model/questionary';
import { Setting } from './interfaces/model/setting';
import { AestheticInterestValues, Covid19QuestionaryValues, HealthQuestionaryValues, INITIAL_COVID19_STATE, INITIAL_HEALTH_STATE } from './interfaces/questionary';
import strings from './lang/Lang';
import { UserSubscriptionField } from './provider/SubscriptionProvider';


export function validateUserPasswordUpdate(values: IChangePasswordValues): void | object | Promise<FormikErrors<IChangePasswordValues>> {
    const errors: FormikErrors<IChangePasswordValues> = {};


    if (!values.old_password) {
        errors.old_password = strings.old_password_is_required;
    }

    if (!values.password) {
        errors.password = strings.password_is_required;
    } else if (values.password.length <= 8) {
        errors.password = strings.password_length_must_be_greater_then_8;
    } else if (Array.from(values.password.match(/[a-z]/g) || []).length === 0) {
        errors.password = strings.password_must_contain_a_lower_case_letter;
    } else if (Array.from(values.password.match(/[A-Z]/g) || []).length === 0) {
        errors.password = strings.password_must_contain_a_upper_case_letter;
    } else if (Array.from(values.password.match(/[0-9]/g) || []).length === 0) {
        errors.password = strings.password_must_contain_a_number;
    }

    if (!values.password_confirmation) {
        errors.password_confirmation = strings.re_password_is_required;
    } else if (values.password && values.password !== values.password_confirmation) {
        errors.password_confirmation = strings.password_not_matched;
    } else if (!values.password_confirmation && (values.old_password || values.password)) {
        errors.password_confirmation = strings.re_password_is_required;
    }



    return errors;
}

export function validateAddUser(values: ICompantUserValues): void | object | Promise<FormikErrors<ICompantUserValues>> {
    const errors: FormikErrors<ICompantUserValues> = {};

    if (!values.user_role) {
        errors.user_role = strings.user_role_is_required;
    }

    if (!values.title) {
        errors.title = strings.title_is_required;
    }

    if (!values.first_name) {
        errors.first_name = strings.first_name_is_required;
    }

    if (!values.last_name) {
        errors.last_name = strings.last_name_is_required;
    }

    if (!values.email) {
        errors.email = strings.email_is_required;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = strings.please_provide_valid_email;
    }

    if (!values.mobile_number) {
        errors.mobile_number = strings.mobile_number_is_required;
    } else if (Number.isNaN(Number(values.mobile_number))) {
        errors.mobile_number = strings.mobile_number_must_be_numeric;
    }

    if (!values.password) {
        errors.password = strings.password_is_required;
    } else if (values.password.length <= 8) {
        errors.password = strings.password_length_must_be_greater_then_8;
    } else if (Array.from(values.password.match(/[a-z]/g) || []).length === 0) {
        errors.password = strings.password_must_contain_a_lower_case_letter;
    } else if (Array.from(values.password.match(/[A-Z]/g) || []).length === 0) {
        errors.password = strings.password_must_contain_a_upper_case_letter;
    } else if (Array.from(values.password.match(/[0-9]/g) || []).length === 0) {
        errors.password = strings.password_must_contain_a_number;
    }

    if (!values.password_confirmation) {
        errors.password_confirmation = strings.re_password_is_required;
    } else if (values.password !== values.password_confirmation) {
        errors.password_confirmation = strings.password_not_matched;
    }

    return errors;
}

export function validateEditUser(values: ICompantUserValues): void | object | Promise<FormikErrors<ICompantUserValues>> {
    const errors: FormikErrors<ICompantUserValues> = {};

    if (!values.user_role) {
        errors.user_role = strings.user_role_is_required;
    }

    if (!values.title) {
        errors.title = strings.title_is_required;
    }

    if (!values.first_name) {
        errors.first_name = strings.first_name_is_required;
    }

    if (!values.last_name) {
        errors.last_name = strings.last_name_is_required;
    }

    if (!values?.mobile_number) {
        errors.mobile_number = strings.phone_number_is_required;
    } else if (values?.mobile_number && Number.isNaN(Number(values.mobile_number))) {
        errors.mobile_number = strings.phone_number_must_be_numeric;
    } else if (!/^[0-9]*$/.test(values.mobile_number)) {
        errors.mobile_number = strings.phone_number_must_be_numeric;
    }

    if (values?.mobile_number && !values?.country_code) {
        errors.country_code = strings.country_code_is_required;
    }

    if (!values.email) {
        errors.email = strings.email_is_required;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = strings.please_provide_valid_email;
    }

    if (!values.mobile_number) {
        // errors.mobile_number = strings.mobile_number_is_required;
    } else if (Number.isNaN(Number(values.mobile_number))) {
        errors.mobile_number = strings.mobile_number_must_be_numeric;
    } else if (!/^[0-9]*$/.test(values.mobile_number)) {
        errors.mobile_number = strings.phone_number_must_be_numeric;
    }

    if (!values.password && values.old_password) {
        errors.password = strings.password_is_required;
    }

    if (values.password) {
        if (values.password.length <= 8) {
            errors.password = strings.password_length_must_be_greater_then_8;
        } else if (Array.from(values.password.match(/[a-z]/g) || []).length === 0) {
            errors.password = strings.password_must_contain_a_lower_case_letter;
        } else if (Array.from(values.password.match(/[A-Z]/g) || []).length === 0) {
            errors.password = strings.password_must_contain_a_upper_case_letter;
        } else if (Array.from(values.password.match(/[0-9]/g) || []).length === 0) {
            errors.password = strings.password_must_contain_a_number;
        }
    }

    if (!values.password_confirmation && values.password) {
        errors.password_confirmation = strings.re_password_is_required;
    } else if (values.password && values.password !== values.password_confirmation) {
        errors.password_confirmation = strings.password_not_matched;
    } else if (!values.password_confirmation && (values.old_password || values.password)) {
        errors.password_confirmation = strings.re_password_is_required;
    }

    if (!values.old_password && values.password) {
        errors.old_password = strings.old_password_is_required;
    }

    return errors;
}

export function validateEditCompany(values: ICompanyValues): void | object | Promise<FormikErrors<ICompanyValues>> {
    const errors: FormikErrors<ICompanyValues> = {};

    if (!values.company_name) {
        errors.company_name = strings.company_name_is_required;
    }

    if (!values?.mobile_number) {
        errors.mobile_number = strings.phone_number_is_required;
    } else if (values?.mobile_number && Number.isNaN(Number(values.mobile_number))) {
        errors.mobile_number = strings.phone_number_must_be_numeric;
    } else if (!/^[0-9]*$/.test(values.mobile_number)) {
        errors.mobile_number = strings.phone_number_must_be_numeric;
    }

    if (values?.mobile_number && !values?.country_code) {
        errors.country_code = strings.country_code_is_required;
    }

    if (!values.country) {
        errors.country = strings.country_is_required;
    }

    // if (values.mobile_number) {
    //     errors.mobile_number = strings.mobile_number_is_required;
    // } else 
    if (values.mobile_number?.length && Number.isNaN(Number(values.mobile_number))) {
        errors.mobile_number = strings.mobile_number_must_be_numeric;
    } else if (values.mobile_number && !/^[0-9]*$/.test(values.mobile_number)) {
        errors.mobile_number = strings.mobile_number_must_be_numeric;
    }

    return errors;
}

export function validateSubscription(values: UserSubscriptionField): void | object | Promise<FormikErrors<UserSubscriptionField>> {
    if (!values.shouldValidate) {
        return {};
    }
    const errors: FormikErrors<UserSubscriptionField> = {};
    if (!values.name) {
        errors.name = 'name is required';
    }

    if (!values.phone) {
        errors.phone = 'phone is required';
    }

    if (!values.company_name) {
        errors.company_name = strings.company_name_is_required;
    }

    if (!values.line1) {
        errors.line1 = 'address is required';
    }

    if (!values.city) {
        errors.city = 'city is required';
    }

    // if (!values?.country) {
    //     errors.country = 'country is required';
    // }

    if (!values.postal_code) {
        errors.postal_code = 'zip code is required';
    }

    // if (!values.paymentMethod) {
    //     errors.paymentMethod = 'card detail is required';
    // }

    return errors;
};

export function validatePaymentDetailUpdate(values: UserSubscriptionField): void | object | Promise<FormikErrors<UserSubscriptionField>> {
    const errors: FormikErrors<UserSubscriptionField> = {};
    if (!values.name) {
        errors.name = 'name is required';
    }

    if (!values.phone) {
        errors.phone = 'phone is required';
    }

    if (!values.line1) {
        errors.line1 = 'address is required';
    }

    if (!values.city) {
        errors.city = 'city is required';
    }

    // if (!values?.country) {
    //     errors.country = 'country is required';
    // }

    if (!values.postal_code) {
        errors.postal_code = 'zip code is required';
    }

    // if (!values.paymentMethod) {
    //     errors.paymentMethod = 'card detail is required';
    // }

    return errors;
};

export function validateTreatmentStore(values: ITreatmentValues): void | object | Promise<FormikErrors<ITreatmentValues>> {
    const errors: FormikErrors<ITreatmentValues> = {};

    if (!values.name) {
        errors.name = strings.treatment_is_required;
    }

    // if (!values.description) {
    //     errors.description = strings.description_is_required;
    // }

    if (values.type === 'treatment') {
        if (!values.cost) {
            errors.cost = strings.cost_is_required;
        } else if (Number.isNaN(Number(values.cost))) {
            errors.cost = strings.cost_must_be_numeric;
        } else if (parseFloat(values.cost) < 0) {
            errors.cost = strings.cost_must_be_greater_than_zero;
        }
    }

    return errors;
}

export function validateQuestionaryStore(values: IQuestionaryValues): void | object | Promise<FormikErrors<IQuestionaryValues>> {
    const errors: FormikErrors<IQuestionaryValues> = {};

    if (!values.title) {
        errors.title = strings.title_is_required;
    }

    return errors;
}

export function validateQuestionaryQuestionStore(values: IQuestionaryQuestionValues): void | object | Promise<FormikErrors<IQuestionaryQuestionValues>> {
    const errors: FormikErrors<IQuestionaryQuestionValues> = {};

    if (!values.question) {
        errors.question = strings.question_is_required;
    }

    if (!values.order) {
        errors.order = strings.order_is_required;
    } else if (Number.isNaN(Number(values.order))) {
        errors.order = strings.order_number_must_be_numeric;
    }

    if (!values.type) {
        errors.type = strings.type_is_required;
    }

    if (!values.required.toString().length && values.required == null) {
        errors.required = strings.required_is_required;
    }

    return errors;
}

export function validateTemplateStore(values: ITemplateValues): void | object | Promise<FormikErrors<ITemplateValues>> {
    const errors: FormikErrors<ITemplateValues> = {};

    if (!values.name) {
        errors.name = strings.template_name_is_required;
    }

    if (!values.image) {
        errors.image = strings.image_is_required;
    }

    return errors;
}

export function validateLetterConsentStore(values: ILetterOfConsentValues): void | object | Promise<FormikErrors<ILetterOfConsentValues>> {
    const errors: FormikErrors<ILetterOfConsentValues> = {};

    // if (!values.is_publish_before_after_pictures) {
    //     errors.is_publish_before_after_pictures = 'is_publish_before_after_pictures is required';
    // }

    if (!values.consent_title) {
        errors.consent_title = strings.consent_title_is_required;
    }

    return errors;
}


export function validateAddMasterUser(values: ICompanyUserMasterAdminValues): void | object | Promise<FormikErrors<ICompanyUserMasterAdminValues>> {
    const errors: FormikErrors<ICompanyUserMasterAdminValues> = {};

    if (!values.user_role) {
        errors.user_role = strings.user_role_is_required;
    }

    if (!values.title) {
        errors.title = strings.title_is_required;
    }

    if (!values.first_name) {
        errors.first_name = strings.first_name_is_required;
    }

    if (!values.last_name) {
        errors.last_name = strings.last_name_is_required;
    }

    if (!values?.mobile_number) {
        errors.mobile_number = strings.phone_number_is_required;
    } else if (values?.mobile_number && Number.isNaN(Number(values.mobile_number))) {
        errors.mobile_number = strings.phone_number_must_be_numeric;
    } else if (!/^[0-9]*$/.test(values.mobile_number)) {
        errors.mobile_number = strings.phone_number_must_be_numeric;
    }

    if (values?.mobile_number && !values?.country_code) {
        errors.country_code = strings.country_code_is_required;
    }

    if (values?.mobile_number.length && Number.isNaN(Number(values.mobile_number))) {
        errors.mobile_number = strings.mobile_number_must_be_numeric;
    }

    if (!values.email) {
        errors.email = strings.email_is_required;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = strings.please_provide_valid_email;
    }

    if (!values.password) {
        errors.password = strings.password_is_required;
    } else if (values.password.length <= 8) {
        errors.password = strings.password_length_must_be_greater_then_8;
    } else if (Array.from(values.password.match(/[a-z]/g) || []).length === 0) {
        errors.password = strings.password_must_contain_a_lower_case_letter;
    } else if (Array.from(values.password.match(/[A-Z]/g) || []).length === 0) {
        errors.password = strings.password_must_contain_a_upper_case_letter;
    } else if (Array.from(values.password.match(/[0-9]/g) || []).length === 0) {
        errors.password = strings.password_must_contain_a_number;
    }

    if (!values.password_confirmation) {
        errors.password_confirmation = strings.re_password_is_required;
    } else if (values.password !== values.password_confirmation) {
        errors.password_confirmation = strings.password_not_matched;
    }

    return errors;
}

export function validateEditMasterUser(values: ICompanyUserMasterAdminValues): void | object | Promise<FormikErrors<ICompanyUserMasterAdminValues>> {
    const errors: FormikErrors<ICompanyUserMasterAdminValues> = {};

    if (!values.user_role) {
        errors.user_role = strings.user_role_is_required;
    }

    if (!values.title) {
        errors.title = strings.title_is_required;
    }

    if (!values.first_name) {
        errors.first_name = strings.first_name_is_required;
    }

    if (!values.last_name) {
        errors.last_name = strings.last_name_is_required;
    }

    if (!values?.mobile_number) {
        errors.mobile_number = strings.phone_number_is_required;
    } else if (values?.mobile_number && Number.isNaN(Number(values.mobile_number))) {
        errors.mobile_number = strings.phone_number_must_be_numeric;
    } else if (!/^[0-9]*$/.test(values.mobile_number)) {
        errors.mobile_number = strings.phone_number_must_be_numeric;
    }

    if (values?.mobile_number && !values?.country_code) {
        errors.country_code = strings.country_code_is_required;
    }

    if (values.mobile_number?.length && Number.isNaN(Number(values.mobile_number))) {
        errors.mobile_number = strings.mobile_number_must_be_numeric;
    }

    if (!values.email) {
        errors.email = strings.email_is_required;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = strings.please_provide_valid_email;
    }

    if (!values.old_password) {
        return errors;
    }

    if (!values.password) {
        errors.password = strings.password_is_required;
    } else if (values.password.length <= 8) {
        errors.password = strings.password_length_must_be_greater_then_8;
    } else if (Array.from(values.password.match(/[a-z]/g) || []).length === 0) {
        errors.password = strings.password_must_contain_a_lower_case_letter;
    } else if (Array.from(values.password.match(/[A-Z]/g) || []).length === 0) {
        errors.password = strings.password_must_contain_a_upper_case_letter;
    } else if (Array.from(values.password.match(/[0-9]/g) || []).length === 0) {
        errors.password = strings.password_must_contain_a_number;
    }

    if (!values.password_confirmation) {
        errors.password_confirmation = strings.re_password_is_required;
    } else if (values.password !== values.password_confirmation) {
        errors.password_confirmation = strings.password_not_matched;
    }

    return errors;
}

export function validateSupportStore(values: ISupportValues): void | object | Promise<FormikErrors<ISupportValues>> {
    const errors: FormikErrors<ISupportValues> = {};

    if (!values.subject) {
        errors.subject = strings.subject_is_required;
    }

    if (!values.message) {
        errors.message = strings.message_is_required;
    }

    return errors;
}

export function validateInviteAFriendStore(values: IInviteAFriendValues): void | object | Promise<FormikErrors<IInviteAFriendValues>> {
    const errors: FormikErrors<IInviteAFriendValues> = {};

    if (!values.email) {
        errors.email = strings.email_is_required;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = strings.please_provide_valid_email;
    }

    return errors;
}

export function validateClientStore(values: IClientValues, settings: Setting[], fields: CompanyClientExtraField[]): void | object | Promise<FormikErrors<IClientValues>> {
    let errors: FormikErrors<IClientValues> = {};


    if (!values.first_name) {
        errors.first_name = strings.first_name_is_required;
    }

    if (!values.last_name) {
        errors.last_name = strings.last_name_is_required;
    }

    function findValue(key: string) {
        return !!settings.find((setting) => setting.key === key && setting.value === '1');
    }

    let viewProfile = findValue(api.registrationPortal.viewProfile);
    let requiredProfile = findValue(api.registrationPortal.requiredProfile);

    let viewPhone = findValue(api.registrationPortal.viewPhone);
    let requiredPhone = findValue(api.registrationPortal.requiredPhone);

    let viewDateOfBirth = findValue(api.registrationPortal.viewDateOfBirth);
    let requiredDateOfBirth = findValue(api.registrationPortal.requiredDateOfBirth);

    let viewOccupation = findValue(api.registrationPortal.viewOccupation);
    let requiredOccupation = findValue(api.registrationPortal.requiredOccupation);

    let viewStreetAddress = findValue(api.registrationPortal.viewStreetAddress);
    let requiredStreetAddress = findValue(api.registrationPortal.requiredStreetAddress);

    let viewCity = findValue(api.registrationPortal.viewCity);
    let requiredCity = findValue(api.registrationPortal.requiredCity);

    let viewState = findValue(api.registrationPortal.viewState);
    let requiredState = findValue(api.registrationPortal.requiredState);

    let viewCountry = findValue(api.registrationPortal.viewCountry);
    let requiredCountry = findValue(api.registrationPortal.requiredCountry);

    let viewZipcode = findValue(api.registrationPortal.viewZipcode);
    let requiredZipcode = findValue(api.registrationPortal.requiredZipcode);

    let viewPersonalID = findValue(api.registrationPortal.viewPersonalID);
    let requiredPersonalID = findValue(api.registrationPortal.requiredPersonalID);

    if (viewDateOfBirth && requiredDateOfBirth && !values?.social_security_number) {
        errors.social_security_number = strings.date_of_birth_is_required;
    }

    if (!values.email) {
        errors.email = strings.email_is_required;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = strings.please_provide_valid_email;
    }

    if (viewPersonalID && requiredPersonalID && !values?.personal_id) {
        errors.personal_id = strings.personal_id_is_required;
    } else if (viewPersonalID && !!values?.personal_id && !/^(((20[012]\d|19\d\d))((0[1-9])|(1[012]))((0[1-9])|([12][0-9])|(3[01]))-([0-9]{4}$))/i.test(values.personal_id)) {
        errors.personal_id = strings.PersonalID_with_format_not_valid;
    }

    if (viewPhone && requiredPhone && !values?.phone_number) {
        errors.phone_number = strings.phone_number_is_required;
    } else if (viewPhone && requiredPhone && values?.phone_number && Number.isNaN(Number(values.phone_number))) {
        errors.phone_number = strings.phone_number_must_be_numeric;
    } else if (!/^[0-9]*$/.test(values.phone_number)) {
        errors.phone_number = strings.phone_number_must_be_numeric;
    }

    if (viewPhone && requiredPhone && !values?.country_code) {
        errors.country_code = strings.country_code_is_required;
    } else if (viewPhone && values?.phone_number && !values?.country_code) {
        errors.country_code = strings.country_code_is_required;
    }

    if (viewOccupation && requiredOccupation && !values?.occupation) {
        errors.occupation = strings.occupation_is_required;
    }

    if (viewStreetAddress && requiredStreetAddress && !values?.street_address) {
        errors.street_address = strings.street_address_is_required;
    }

    if (viewCity && requiredCity && !values?.city) {
        errors.city = strings.city_is_required;
    }

    if (viewZipcode && requiredZipcode && !values?.zip_code) {
        errors.zip_code = strings.zip_code_is_required;
    }

    if (viewState && requiredState && !values?.state) {
        errors.state = strings.state_is_required;
    }

    if (viewCountry && requiredCountry && !values?.country) {
        errors.country = strings.country_is_required;
    }

    for (let i = 0; i < fields.length; i += 1) {
        let error: {
            id?: string;
            value?: string;
            name?: string;
            required?: string;
        } = {};

        if (fields[i].required && !values.extra[i].value) {
            error.value = strings.Required;
        }

        errors = { ...errors, extra: [...((errors?.extra ?? []) as {}[]), error] };
    }


    if (viewProfile && requiredProfile && !values?.profile_picture && !values.old_profile_picture) {
        errors.profile_picture = strings.image_is_required;
    }

    let isExtraErrorsEmpty =
        ((errors.extra ?? []) as string[]).every((field) => Object.keys(field).length === 0);

    if (isExtraErrorsEmpty) delete errors.extra;


    return errors;
}


export function validateClientAftercare(values: IClientAftercareValues): void | object | Promise<FormikErrors<IClientAftercareValues>> {
    const errors: FormikErrors<IClientAftercareValues> = {};

    if (!values.file) {
        errors.file = strings.please_provide_file;
    }

    return errors;
}

export function validateClientGeneralNotes(values: IClientGeneralNotesValues): void | object | Promise<FormikErrors<IClientGeneralNotesValues>> {
    const errors: FormikErrors<IClientGeneralNotesValues> = {};

    if (!values.title) {
        errors.title = strings.title_is_required;
    }

    if (!values.filename) {
        if (!values?.file && !values.notes_html) {
            errors.notes = strings.note_is_required_without_file;
        }

        if (!values.notes_html && !values.file) {
            errors.file = strings.file_is_required_without_note;
        }
    }

    return errors;
}

export function validateClientMedia(values: IClientMediaValues): void | object | Promise<FormikErrors<IClientMediaValues>> {
    const errors: FormikErrors<IClientMediaValues> = {};

    if (!values.images || !values.images.length) {
        errors.images = strings.image_is_required;
    }

    return errors;
}

export function validateHealthQuestionary(values: HealthQuestionaryValues): void | object | Promise<FormikErrors<HealthQuestionaryValues>> {
    const errors: FormikErrors<HealthQuestionaryValues> = {};
    if (!errors?.data) {
        errors.data = [];
    }
    values.data.forEach((healthQuestion, index) => {
        const localError: {
            answer?: string,
            more_info?: string,
        } = {};

        if ('more_info' in healthQuestion && !('answer' in healthQuestion)) {
            //
        } else if (!healthQuestion.answer && healthQuestion.answer !== 0) {
            localError.answer = strings.answer_is_required;
        } else if (healthQuestion.answer !== 1 && healthQuestion.answer !== 0) {
            localError.answer = strings.please_provide_valid_answer;
        } else if (healthQuestion.answer === 1 && !healthQuestion.more_info && 'more_info' in INITIAL_HEALTH_STATE[index]) {
            localError.more_info = strings.more_info_required;
        }

        (errors.data as FormikErrors<{ answer: "" | 0 | 1 | null; more_info: string; } | { answer: "" | 0 | 1 | null; more_info?: undefined; } | { answer?: undefined; more_info: string; }>[]).push(localError);
    });

    let isHealthQuestionEmpty = true;
    (errors.data as FormikErrors<{ answer: "" | 0 | 1 | null; more_info: string; } | { answer: "" | 0 | 1 | null; more_info?: undefined; } | { answer?: undefined; more_info: string; }>[]).forEach((healthQuestion) => {
        if (Object.keys(healthQuestion).length !== 0) {
            isHealthQuestionEmpty = false;
        }
    });

    if (isHealthQuestionEmpty) {
        return {};
    }

    return errors;
}

export function validateCovid19Questionary(values: Covid19QuestionaryValues): void | object | Promise<FormikErrors<Covid19QuestionaryValues>> {
    const errors: FormikErrors<Covid19QuestionaryValues> = {};
    if (!errors?.data) {
        errors.data = [];
    }
    values.data.forEach((covid19Question, index) => {
        const localError: {
            answer?: string,
            more_info?: string,
        } = {};

        if ('more_info' in covid19Question && !('answer' in covid19Question)) {
            //
        } else if (!covid19Question.answer && covid19Question.answer !== 0) {
            localError.answer = strings.answer_is_required;
        } else if (covid19Question.answer !== 1 && covid19Question.answer !== 0) {
            localError.answer = strings.please_provide_valid_answer;
        } else if (covid19Question.answer === 1 && !covid19Question.more_info && 'more_info' in INITIAL_COVID19_STATE[index]) {
            localError.more_info = strings.more_info_required;
        }

        (errors.data as FormikErrors<{ answer: "" | 0 | 1 | null; more_info: string; } | { answer: "" | 0 | 1 | null; more_info?: undefined; } | { answer?: undefined; more_info: string; }>[]).push(localError);
    });

    let isCovid19QuestionEmpty = true;
    (errors.data as FormikErrors<{ answer: "" | 0 | 1 | null; more_info: string; } | { answer: "" | 0 | 1 | null; more_info?: undefined; } | { answer?: undefined; more_info: string; }>[]).forEach((covid19Question) => {
        if (Object.keys(covid19Question).length !== 0) {
            isCovid19QuestionEmpty = false;
        }
    });

    if (isCovid19QuestionEmpty) {
        return {};
    }

    return errors;
}

export function validateAestheticInterest(values: AestheticInterestValues): void | object | Promise<FormikErrors<AestheticInterestValues>> {
    const errors: FormikErrors<AestheticInterestValues> = {};
    if (!errors?.data) {
        errors.data = [];
    }
    const aestheticErrors = [];

    // if (!values.aestethic_interest[0].notes) {
    //     aestheticErrors.push({ notes: 'General notes are required.' });
    // } else {
    aestheticErrors.push({});
    // }

    if (values?.data?.length && values?.data[1].answer_checkbox?.length !== 5) {
        aestheticErrors.push({ answer_checkbox: 'please refresh the page.' });
    } else {
        aestheticErrors.push({});
    }

    if (values?.data?.length && values?.data[2].answer_checkbox?.length !== 8) {
        aestheticErrors.push({ answer_checkbox: 'please refresh the page.' });
    } else {
        aestheticErrors.push({});
    }

    if (values?.data?.length && values?.data[3].answer_checkbox?.length !== 4) {
        aestheticErrors.push({ answer_checkbox: 'please refresh the page.' });
    } else {
        aestheticErrors.push({});
    }

    if (values?.data?.length && values?.data[4].answer_checkbox?.length !== 4) {
        aestheticErrors.push({ answer_checkbox: 'please refresh the page.' });
    } else {
        aestheticErrors.push({});
    }

    aestheticErrors.push({});

    if (values?.data?.length && values?.data[6].answer_checkbox?.length !== 4) {
        aestheticErrors.push({ answer_checkbox: 'please refresh the page.' });
    } else {
        aestheticErrors.push({});
    }

    if (values?.data?.length && values?.data[7].answer_checkbox?.length !== 10) {
        aestheticErrors.push({ answer_checkbox: 'please refresh the page.' });
    } else {
        aestheticErrors.push({});
    }

    if (values?.data?.length && values?.data[8].answer_checkbox?.length !== 7) {
        aestheticErrors.push({ answer_checkbox: 'please refresh the page.' });
    } else {
        aestheticErrors.push({});
    }

    if (values?.data?.length && values?.data[9].answer_checkbox?.length !== 3) {
        aestheticErrors.push({ answer_checkbox: 'please refresh the page.' });
    } else {
        aestheticErrors.push({});
    }

    // if (!values?.data?.length && values?.data[9]?.notes) {
    //     aestheticErrors.push({ notes: 'notes is are required.' });
    // } else {
    aestheticErrors.push({});
    // }

    let isAestethicInterestEmpty = true;
    aestheticErrors.forEach((aestethicInterest) => {
        if (Object.keys(aestethicInterest).length !== 0) {
            isAestethicInterestEmpty = false;
        }
    });

    if (isAestethicInterestEmpty) {
        return {};
    }

    errors.data = aestheticErrors;

    return errors;
}

export function validateClientGeneralNoteSign(values: IClientGeneralNoteSignValues): void | object | Promise<FormikErrors<IClientGeneralNoteSignValues>> {
    const errors: FormikErrors<IClientGeneralNoteSignValues> = {};

    if (!values.sign) {
        errors.sign = strings.sign_is_required
    }

    return errors;
}

export function validateClientLetterOfConsent(values: IClientLetterOfConsentValues): void | object | Promise<FormikErrors<IClientLetterOfConsentValues>> {
    const errors: FormikErrors<IClientLetterOfConsentValues> = {};

    if (!values.consent_id) {
        errors.consent_id = strings.consent_is_required;
    }

    if (![0, null, 1].includes(values.is_publish_before_after_pictures)) {
        errors.is_publish_before_after_pictures = strings.is_publish_before_after_pictures_is_required;
    }

    if (values.showSignature && !values.signature) {
        errors.signature = strings.signature_is_required;
    }

    if (!values.showSignature && !values.consent_agreed) {
        errors.consent_agreed = strings.please_accept_the_consent;
    }

    return errors;
}

export function validateClientLetterOfConsentEdit(values: IClientLetterOfConsentEditValues): void | object | Promise<FormikErrors<IClientLetterOfConsentEditValues>> {
    const errors: FormikErrors<IClientLetterOfConsentEditValues> = {};

    if (!values.verified_sign) {
        errors.verified_sign = strings.signature_is_required;
    }

    return errors;
}

export function validateClientProcedureEdit(values: IClientProcedureSignModalValues): void | object | Promise<FormikErrors<IClientProcedureSignModalValues>> {
    const errors: FormikErrors<IClientProcedureSignModalValues> = {};

    if (!values.sign) {
        errors.sign = strings.signature_is_required;
    }

    return errors;
}

export function validateClientTreatmentStore(values: IClientProcedureCreateValues): void | object | Promise<FormikErrors<IClientProcedureCreateValues>> {
    const errors: FormikErrors<IClientProcedureCreateValues> = {};

    if (values.date && !isValidDate(values.date)) {
        errors.date = strings.please_provide_valid_date_format;
    }

    const treatments: { id?: string, actual_cost?: string }[] = [];
    values.treatments.forEach((treatment) => {
        const localErrors: { id?: string, actual_cost?: string } = {};
        if (!treatment?.id) {
            localErrors.id = strings.treatment_is_required;
        }
        if (treatment?.actual_cost && (Number.isNaN(Number(treatment?.actual_cost)))) {
            localErrors.actual_cost = strings.treatment_cost_must_be_number;
        } else if (treatment?.actual_cost && (parseFloat(treatment?.actual_cost.toString()) < 0)) {
            localErrors.actual_cost = strings.treatment_cost_must_be_greater_than_zero;
        }

        treatments.push(localErrors);
    });

    let isTreatmentsEmpty = true;
    treatments.forEach((treatment) => {
        if (Object.keys(treatment).length !== 0) {
            isTreatmentsEmpty = false;
        }
    });

    if (!isTreatmentsEmpty) {
        errors.treatments = treatments;
    }

    return errors;
}



export function validateClientDynamicQuestionnaire(values: DynamicQuestionaryValues, questions: QuestionaryQuestion[]): void | object | Promise<FormikErrors<DynamicQuestionaryValues>> {
    let errors: FormikErrors<DynamicQuestionaryValues> = {};

    if (!errors?.data) {
        errors.data = [];
    }

    let hasError = false;
    for (let i = 0; i < questions.length; i += 1) {
        const question = questions[i];
        if (question.type === config.questionTypes1.yes_no_textbox.value) {
            let error: { value?: string, text?: string } = {};
            if (question.required && !values?.data[i]?.value && values?.data[i]?.value !== 0) {
                error.value = strings.please_provide_valid_answer;
                hasError = true;
            }

            if (question.required && values?.data[i]?.value === 1 && !values?.data[i]?.text) {
                error.text = strings.more_info_required;
                hasError = true;
            }

            errors = { data: [...(errors.data as {}[]), error] };
        } else if (question.type === config.questionTypes1.yes_no.value) {
            let error: { value?: string, text?: string } = {};
            if (question.required && !values?.data[i]?.value && values?.data[i]?.value !== 0) {
                error.value = strings.please_provide_valid_answer;
                hasError = true;
            }

            errors = { data: [...(errors.data as {}[]), error] };
        } else if (question.type === config.questionTypes1.textbox.value) {
            let error: { value?: string, text?: string } = {};
            if (question.required && !values?.data[i]?.text) {
                error.text = strings.please_provide_some_explanation;
                hasError = true;
            }
            errors = { data: [...(errors.data as {}[]), error] };
        } else {
            errors = { data: [...(errors.data as {}[]), {}] };
        }
    }

    if (!hasError) {
        return {};
    }

    return errors;
}

export async function validateRegistrationPortalClient(values: RegistrationPortal2Values, settings: Setting[], fields: CompanyClientExtraField[]): Promise<FormikErrors<RegistrationPortal2Values>> {
    let errors: FormikErrors<RegistrationPortal2Values> = {};

    if (!values.first_name) {
        errors.first_name = strings.first_name_is_required;
    }

    if (!values.last_name) {
        errors.last_name = strings.last_name_is_required;
    }

    function findValue(key: string) {
        return !!settings.find((setting) => setting.key === key && setting.value === '1');
    }

    let viewProfile = findValue(api.registrationPortal.viewProfile);
    let requiredProfile = findValue(api.registrationPortal.requiredProfile);

    let viewPhone = findValue(api.registrationPortal.viewPhone);
    let requiredPhone = findValue(api.registrationPortal.requiredPhone);

    let viewDateOfBirth = findValue(api.registrationPortal.viewDateOfBirth);
    let requiredDateOfBirth = findValue(api.registrationPortal.requiredDateOfBirth);

    let viewOccupation = findValue(api.registrationPortal.viewOccupation);
    let requiredOccupation = findValue(api.registrationPortal.requiredOccupation);

    let viewStreetAddress = findValue(api.registrationPortal.viewStreetAddress);
    let requiredStreetAddress = findValue(api.registrationPortal.requiredStreetAddress);

    let viewCity = findValue(api.registrationPortal.viewCity);
    let requiredCity = findValue(api.registrationPortal.requiredCity);

    let viewState = findValue(api.registrationPortal.viewState);
    let requiredState = findValue(api.registrationPortal.requiredState);

    let viewCountry = findValue(api.registrationPortal.viewCountry);
    let requiredCountry = findValue(api.registrationPortal.requiredCountry);

    let viewZipcode = findValue(api.registrationPortal.viewZipcode);
    let requiredZipcode = findValue(api.registrationPortal.requiredZipcode);

    let viewPersonalID = findValue(api.registrationPortal.viewPersonalID);
    let requiredPersonalID = findValue(api.registrationPortal.requiredPersonalID);

    if (viewDateOfBirth && requiredDateOfBirth && !values?.social_security_number) {
        errors.social_security_number = strings.date_of_birth_is_required;
    }

    if (!values.email) {
        errors.email = strings.email_is_required;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = strings.please_provide_valid_email;
    }

    if (viewPersonalID && requiredPersonalID && !values?.personal_id) {
        errors.personal_id = strings.personal_id_is_required;
    } else if (viewPersonalID && !!values?.personal_id && !/^(((20[012]\d|19\d\d))((0[1-9])|(1[012]))((0[1-9])|([12][0-9])|(3[01]))-([0-9]{4}$))/i.test(values.personal_id)) {
        errors.personal_id = strings.PersonalID_with_format_not_valid;
    }

    if (viewPhone && requiredPhone && !values?.phone_number) {
        errors.phone_number = strings.phone_number_is_required;
    } else if (viewPhone && requiredPhone && values?.phone_number && Number.isNaN(Number(values.phone_number))) {
        errors.phone_number = strings.phone_number_must_be_numeric;
    } else if (!/^[0-9]*$/.test(values.phone_number)) {
        errors.phone_number = strings.phone_number_must_be_numeric;
    }

    if (viewPhone && requiredPhone && !values?.country_code) {
        errors.country_code = strings.country_code_is_required;
    } else if (viewPhone && values?.phone_number && !values?.country_code) {
        errors.country_code = strings.country_code_is_required;
    }

    if (viewOccupation && requiredOccupation && !values?.occupation) {
        errors.occupation = strings.occupation_is_required;
    }

    if (viewStreetAddress && requiredStreetAddress && !values?.street_address) {
        errors.street_address = strings.street_address_is_required;
    }

    if (viewCity && requiredCity && !values?.city) {
        errors.city = strings.city_is_required;
    }

    if (viewZipcode && requiredZipcode && !values?.zip_code) {
        errors.zip_code = strings.zip_code_is_required;
    }

    if (viewState && requiredState && !values?.state) {
        errors.state = strings.state_is_required;
    }

    if (viewCountry && requiredCountry && !values?.country) {
        errors.country = strings.country_is_required;
    }

    for (let i = 0; i < fields.length; i += 1) {
        let error: {
            id?: string;
            value?: string;
            name?: string;
            required?: string;
        } = {};

        if (fields[i].required && !values.extra[i].value) {
            error.value = strings.Required;
        }

        errors = { ...errors, extra: [...((errors?.extra ?? []) as {}[]), error] };
    }


    if (viewProfile && requiredProfile && !values?.profile_picture) {
        errors.profile_picture = strings.image_is_required;
    }

    let isExtraErrorsEmpty =
        ((errors.extra ?? []) as string[]).every((field) => Object.keys(field).length === 0);

    if (isExtraErrorsEmpty) delete errors.extra;

    return errors;
}

export async function validateClientNextKind(values: IClientNextOfKindValues): Promise<FormikErrors<IClientNextOfKindValues>> {
    let errors: FormikErrors<IClientNextOfKindValues> = {};

    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = strings.please_provide_valid_email;
    }

    if (!values.name) {
        errors.name = strings.first_name_is_required;
    }

    // if (!values?.phone.length) {
    //     errors.phone = strings.phone_number_is_required;
    // } else 
    if (values?.phone && Number.isNaN(Number(values.phone))) {
        errors.phone = strings.phone_number_must_be_numeric;
    }

    // if (!values.relation) {
    //     errors.relation = strings.first_name_is_required;
    // }

    return errors;
}

export async function validateClientVerification(values: IClientVerificationValues): Promise<FormikErrors<IClientVerificationValues>> {
    let errors: FormikErrors<IClientVerificationValues> = {};

    if (values.other && !values.note?.trim().length) {
        errors.note = strings.note_is_required;
    }

    return errors;
}
export function validateCategoryStore(values: ICategoryValues): void | object | Promise<FormikErrors<ICategoryValues>> {
    let errors: FormikErrors<ICategoryValues> = {};


    if (!values.name) {
        errors.name = strings.category_name_is_required;
    }
    return errors;
}

export function validateClientMerge(values: IClientMergeValues, settings: Setting[], fields: CompanyClientExtraField[]): void | object | Promise<FormikErrors<IClientMergeValues>> {
    let errors: FormikErrors<IClientMergeValues> = {};


    if (!values.client_name) {
        errors.client_name = strings.client_name_required;
    }

    function findValue(key: string) {
        return !!settings.find((setting) => setting.key === key && setting.value === '1');
    }

    let viewPhone = findValue(api.registrationPortal.viewPhone);
    let requiredPhone = findValue(api.registrationPortal.requiredPhone);

    let viewDateOfBirth = findValue(api.registrationPortal.viewDateOfBirth);
    let requiredDateOfBirth = findValue(api.registrationPortal.requiredDateOfBirth);

    let viewOccupation = findValue(api.registrationPortal.viewOccupation);
    let requiredOccupation = findValue(api.registrationPortal.requiredOccupation);

    let viewStreetAddress = findValue(api.registrationPortal.viewStreetAddress);
    let requiredStreetAddress = findValue(api.registrationPortal.requiredStreetAddress);

    let viewCity = findValue(api.registrationPortal.viewCity);
    let requiredCity = findValue(api.registrationPortal.requiredCity);

    let viewState = findValue(api.registrationPortal.viewState);
    let requiredState = findValue(api.registrationPortal.requiredState);

    let viewCountry = findValue(api.registrationPortal.viewCountry);
    let requiredCountry = findValue(api.registrationPortal.requiredCountry);

    let viewZipcode = findValue(api.registrationPortal.viewZipcode);
    let requiredZipcode = findValue(api.registrationPortal.requiredZipcode);

    let viewPersonalID = findValue(api.registrationPortal.viewPersonalID);
    let requiredPersonalID = findValue(api.registrationPortal.requiredPersonalID);

    if (viewDateOfBirth && requiredDateOfBirth && !values?.social_security_number) {
        errors.social_security_number = strings.date_of_birth_is_required;
    }

    if (!values.email) {
        errors.email = strings.email_is_required;
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = strings.please_provide_valid_email;
    }

    if (viewPersonalID && requiredPersonalID && !values?.personal_id) {
        errors.personal_id = strings.personal_id_is_required;
    } else if (viewPersonalID && !!values?.personal_id && !/^(((20[012]\d|19\d\d))((0[1-9])|(1[012]))((0[1-9])|([12][0-9])|(3[01]))-([0-9]{4}$))/i.test(values.personal_id)) {
        errors.personal_id = strings.PersonalID_with_format_not_valid;
    }

    if (viewPhone && requiredPhone && !values?.phone_number) {
        errors.phone_number = strings.phone_number_is_required;
    } else if (viewPhone && requiredPhone && values?.phone_number && Number.isNaN(Number(values.phone_number))) {
        errors.phone_number = strings.phone_number_must_be_numeric;
    } else if (!/^[0-9]*$/.test(values.phone_number)) {
        errors.phone_number = strings.phone_number_must_be_numeric;
    }

    if (viewPhone && requiredPhone && !values?.country_code) {
        errors.country_code = strings.country_code_is_required;
    } else if (viewPhone && values?.phone_number && !values?.country_code) {
        errors.country_code = strings.country_code_is_required;
    }

    if (viewOccupation && requiredOccupation && !values?.occupation) {
        errors.occupation = strings.occupation_is_required;
    }

    if (viewStreetAddress && requiredStreetAddress && !values?.street_address) {
        errors.street_address = strings.street_address_is_required;
    }

    if (viewCity && requiredCity && !values?.city) {
        errors.city = strings.city_is_required;
    }

    if (viewZipcode && requiredZipcode && !values?.zip_code) {
        errors.zip_code = strings.zip_code_is_required;
    }

    if (viewState && requiredState && !values?.state) {
        errors.state = strings.state_is_required;
    }

    if (viewCountry && requiredCountry && !values?.country) {
        errors.country = strings.country_is_required;
    }
    for (let i = 0; i < fields.length; i += 1) {
        let error: {
            id?: string;
            value?: string;
            name?: string;
            required?: string;
        } = {};

        if (fields[i].required && !values.extra[i].value) {
            error.value = strings.Required;
        }

        errors = { ...errors, extra: [...((errors?.extra ?? []) as {}[]), error] };
    }

    let isExtraErrorsEmpty =
        ((errors.extra ?? []) as string[]).every((field) => Object.keys(field).length === 0);

    if (isExtraErrorsEmpty) delete errors.extra;
    return errors;
}
export function validateClientMergeConfirm(values: IClientMergeConfirmValue): void | object | Promise<FormikErrors<IClientMergeConfirmValue>> {
    let errors: FormikErrors<IClientMergeConfirmValue> = {};

    if (!values.is_check) {
        errors.is_check = strings.please_provide_consent;
    }
    return errors;

}