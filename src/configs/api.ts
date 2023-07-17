import strings from "../lang/Lang";

const baseUrl = process.env.REACT_APP_APP_URL

type IdType = string | number | undefined

const api = {
    storage: `${process.env.REACT_APP_STORAGE_PATH}/`,
    storageUrl(path: string) { return `${api.storage}${path}` },
    adminRole: 'admin',
    masterAdminRole: 'master_admin',
    userRole: 'user',
    stripeActive: 'active',
    login: `${baseUrl}/v2/login`,
    signup: `${baseUrl}/v2/register`,
    signupSetup: `${baseUrl}/v2/register/set-up`,
    otpResend: `${baseUrl}/v2/resendOtp`,
    register: `${baseUrl}/register`,
    forgot: `${baseUrl}/forgot`,
    user: `${baseUrl}/user`,
    userSingle: `${baseUrl}/user/:id`,
    dashboard_box: `${baseUrl}/dashboard/boxData`,
    dashboard_graph: `${baseUrl}/dashboard/graphData`,

    companyUpdate: `${baseUrl}/company/update`,
    companyMasterUpdate: `${baseUrl}/company/:id/update`,
    companySingle: `${baseUrl}/company/:id`,
    companyUsers: `${baseUrl}/company/:id/users`,
    companyDelete: `${baseUrl}/company/:id/delete`,
    companyClients: `${baseUrl}/company/:id/clients`,
    companyUsage: `${baseUrl}/company/usage`,
    clientsCount: `${baseUrl}/v2/company/clients-count`,
    companyPublicUsers: `${baseUrl}/company/:id/user`,
    companies: `${baseUrl}/company`,
    companiesExport: `${baseUrl}/company?excel`,

    companyClientExtraFields: `${baseUrl}/company/client_fields`,
    companyClientExtraFieldsPublic: `${baseUrl}/company/client_fields/:id/public`,
    companyClientExtraFieldStore: `${baseUrl}/company/client_fields/store`,
    companyClientExtraFieldUpdate: `${baseUrl}/company/client_fields/:id/update`,
    companyClientExtraFieldDelete: `${baseUrl}/company/client_fields/:id/delete`,

    userStore: `${baseUrl}/user/store`,
    userUpdate: `${baseUrl}/user/:id/update`,
    userDelete: `${baseUrl}/user/:id/delete`,
    userRestore: `${baseUrl}/user/:id/restore`,
    userAll: `${baseUrl}/user/all`,
    userAllFilter({ filter }: { filter?: string }) {
        return `${baseUrl}/user/all?filter=${filter}`
    },
    userChangeStatus: `${baseUrl}/user/:id/change-status`,
    treatment: `${baseUrl}/v2/treatment`,
    convertSuperUser(id?: IdType) {
        return `${baseUrl}/v2/user/${id}/make-super-admin`;
    },
    treatmentStore: `${baseUrl}/treatment/store`,
    treatmentUpdate(id?: IdType) {
        return `${baseUrl}/treatment/${id}/update`
    },
    treatmentDelete(id: IdType) {
        return `${baseUrl}/treatment/${id}/delete`
    },
    treatmentRestore(id: IdType) {
        return `${baseUrl}/treatment/restore?treatment_id=${id}`
    },
    clientTreatments(id?: IdType) {
        if (!id) return null;
        return `${baseUrl}/client/${id}/treatments`;
    },
    clientTreatment({ clientId, procedureId }: {
        clientId: IdType
        procedureId: IdType
    }) {
        return `${baseUrl}/client/${clientId}/treatments/${procedureId}`
    },

    template: `${baseUrl}/v2/template`,
    templateStore: `${baseUrl}/v2/template/store`,
    templateUpdate(id: IdType) {
        return `${baseUrl}/v2/template/${id}/update`
    },
    templateDelete(id: IdType) {
        return `${baseUrl}/v2/template/${id}/delete`
    },
    templateRestore(id: IdType) {
        return `${baseUrl}/v2/template/${id}/restore`
    },

    letterOfConsent: `${baseUrl}/v2/letter_of_consent`,
    letterOfConsentPublic: `${baseUrl}/letter_of_consent/:companyId/public`,
    letterOfConsentStore: `${baseUrl}/letter_of_consent/store`,
    letterOfConsentRestore(id: IdType) {
        return `${baseUrl}/letter_of_consent/restore?letter_of_consent_id=${id}`
    },
    letterOfConsentUpdate(id: IdType) {
        return `${baseUrl}/letter_of_consent/${id}/update`
    },
    letterOfConsentDelete(id: IdType) {
        return `${baseUrl}/letter_of_consent/${id}/delete`
    },
    clientLetterOfConsents(id: IdType) {
        if (!id) return;
        return `${baseUrl}/client/${id}/letter_of_consents`;
    },
    clientLetterOfConsentStore: `${baseUrl}/client_letter_of_consent/:id/store`,
    clientLetterOfConsentUpdate: `${baseUrl}/client_letter_of_consent/:id/update`,
    clientLetterOfConsentDelete: `${baseUrl}/client_letter_of_consent/:id/delete`,

    supportStore: `${baseUrl}/support/store`,

    generalNoteStore: `${baseUrl}/general_note/:id/store`,
    generalNoteUpdate: `${baseUrl}/general_note/:generalNoteId/update`,
    generalNoteDelete: `${baseUrl}/general_note/:generalNoteId/delete`,
    generalNoteFileDelete(id: number, file: number, index: number) {
        return `${baseUrl}/general_note/${id}/files/${file}/delete?index=${index}`;
    },
    clientGeneralNotes: `${baseUrl}/client/:id/general_notes`,

    clients: `${baseUrl}/v2/client`,
    clientSingle(id: IdType) {
        return `${baseUrl}/v2/client/${id}`
    },
    clientSingleLogs(id?: string) {
        return `${baseUrl}/client/${id}/logs`
    },
    clientLogDownload: `${baseUrl}/client/:id/logs/download`,
    clientDownload(id: IdType) {
        return `${baseUrl}/client/${id}/download`;
    },
    clientStore: `${baseUrl}/client/store`,
    clientUpdate: `${baseUrl}/client/:id/update`,
    clientDelete: `${baseUrl}/client/:id/delete`,
    clientRestore: `${baseUrl}/client/:id/restore`,
    clientPublicStore: `${baseUrl}/client/store/public`,
    clientPublicCreate: `${baseUrl}/client/create/public`,
    clientAftercares(id?: string) {
        if (!id) return null;
        return `${baseUrl}/client/${id}/logs/aftercare`
    },

    clientConsentStore: `${baseUrl}/v2/client/:id/consent/store`,
    clientConsentSendMail: `${baseUrl}/v2/client/:id/consent/sendMail`,
    clientConsentCancel: `${baseUrl}/v2/client/:id/consent/cancel`,

    clientMedia(id?: string, page?: number) {
        if (!id) return null;
        if (page) return `${baseUrl}/v2/client/${id}/media?per_page=5&page=${page}`
        return `${baseUrl}/v2/client/${id}/media?per_page=5`
    },
    clientMediaNoGroup(id?: string) {
        if (!id) return null;
        return `${baseUrl}/v2/client/${id}/media?per_page=5&noGroupBy=true`
    },
    clientMediaStore: `${baseUrl}/v2/client/:id/media/store`,
    clientMediaDelete: `${baseUrl}/v2/client/:id/media/:fileId/delete`,

    clientProcedureStore: `${baseUrl}/v2/client_treatment/:id/store`,
    clientProcedureUpdateMobile: `${baseUrl}/v2/client_treatment/:id/update/mobile`,
    clientProcedureDeleteMobile: `${baseUrl}/v2/client_treatment/:id/delete/mobile`,
    clientProcedureUpdate: `${baseUrl}/v2/client_treatment/:id/update`,

    clientKind(id: IdType) {
        return `${baseUrl}/client/${id}/kind`;
    },
    clientKindStore(id: IdType) {
        return `${baseUrl}/client/${id}/kind/store`;
    },

    clientAfterCareTreatmentStore: `${baseUrl}/client/:id/after_care_treatment/store`,
    healthStore: `${baseUrl}/health_questionnaire/:id/store/new`,
    aestheticStore: `${baseUrl}/aesthetic_interest/:id/store/new`,
    covid19Store: `${baseUrl}/covid19/:id/store/new`,
    clientAccess: `${baseUrl}/client_access`,
    singleClientAccess: `${baseUrl}/client_access/:id`,
    singleClientsAccesses(id?: IdType) {
        if (!id) return null
        return `${baseUrl}/v1/client/${id}/accesses`
    },
    clientVerificationStore(id: IdType) {
        return `${process.env.REACT_APP_APP_URL}/v1/client/${id}/verification/store`;
    },

    onlyClientAccess: `${baseUrl}/client_access/:id/access`,
    // clientAccessStore: `${baseUrl}/client_access/:id/store`,
    clientAccessStore(id: IdType) { return `${baseUrl}/client_access/${id}/store` },
    setting: `${baseUrl}/setting`,
    settingPublic: `${baseUrl}/setting/:id/public`,
    settingStore: `${baseUrl}/setting/store`,
    subscriptionCreate: `${baseUrl}/subscription/create`,
    subscriptionStore: `${baseUrl}/subscription/store`,
    subscriptionEdit: `${baseUrl}/subscription/edit`,
    subscriptionUpdate: `${baseUrl}/subscription/update`,
    subscriptionDelete: `${baseUrl}/subscription/delete`,
    subscriptionBillingDetail: `${baseUrl}/subscription/billing_details`,
    subscriptionInvoices: `${baseUrl}/subscription/invoices`,
    subscriptionInvoiceDownload: `${baseUrl}/subscription/invoices/:id/download`,
    subscriptionInvoicePay: `${baseUrl}/subscription/invoices/:id/pay`,


    questionnairesPublic: `${baseUrl}/questionary/public?company_id=:company_id`,
    questionnaires: `${baseUrl}/questionary`,
    questionnaire: `${baseUrl}/questionary/:id`,
    questionnaireCreate: `${baseUrl}/questionary/store`,
    questionnaireUpdate: `${baseUrl}/questionary/:id/update`,
    questionnaireDelete: `${baseUrl}/questionary/:id/delete`,
    questionnaireQuestions: `${baseUrl}/questionary/:questionary/question`,
    questionnaireQuestionCreate: `${baseUrl}/questionary/:questionary/question/store`,
    questionnaireQuestionUpdate: `${baseUrl}/questionary/:questionary/question/:id/update`,
    questionnaireQuestionDelete: `${baseUrl}/questionary/:questionary/question/:id/delete`,

    clientQuestionnaire: `${baseUrl}/client/:client/questionary`,
    clientQuestionnaireData(id: IdType) {
        return `${baseUrl}/client/${id}/questionary_data`;
    },
    clientQuestionnaireDataAll(id: IdType) {
        return `${baseUrl}/v2/client/${id}/questionaries`;
    },

    questionnaireAnswerCreate: `${baseUrl}/questionary/:questionary/answer/store`,
    companyLeadUpdate: `${baseUrl}/company/lead/store`,

    invite: `${baseUrl}/invite`,
    logout: `${baseUrl}/v2/logout`,
    getSignedUrl: `${baseUrl}/get-signed-url`,

    CLIENT_ACCESS_FULL_ACCESS: 'CLIENT_ACCESS_FULL_ACCESS',
    SHOW_HEALTH_QUESTIONNAIRE: 'SHOW_HEALTH_QUESTIONNAIRE',
    SHOW_AESTHETIC_INTEREST: 'SHOW_AESTHETIC_INTEREST',
    SHOW_LETTER_OF_CONSENT: 'SHOW_LETTER_OF_CONSENT',
    SHOW_COVID_19: 'SHOW_COVID_19',
    SEND_CLIENT_WELCOME_EMAIL: 'SEND_CLIENT_WELCOME_EMAIL',
    SHOW_2FA: 'SHOW_2FA',
    SEND_CLIENT_EMAILS: 'SEND_CLIENT_EMAILS',
    SUPER_USER_MAIL_WHEN_CLIENT_REGISTER: 'SUPER_USER_MAIL_WHEN_CLIENT_REGISTER',
    REQUIRED_CONSENT: 'REQUIRED_CONSENT',
    LOC_CHECKBOX: 'LOC_CHECKBOX',

    leadTypes: {
        win: 'win',
        lost: 'lost',
        not_decided: 'not_decided',
    },

    questionTypes: {
        yes_no: strings.yes_no,
        yes_no_textbox: strings.yes_no_textbox,
        textbox: strings.textbox,
        // select: 'Selection',
        // multi_select: 'Multi Selection',
        // image: 'Image Drawing',
    },

    questionTypes1: {
        yes_no: {
            text: 'Yes/No',
            value: 'yes_no',
        },
        yes_no_textbox: {
            text: 'Yes/No with Textbox',
            value: 'yes_no_textbox',
        },
        textbox: {
            text: 'Textbox',
            value: 'textbox',
        },
        // select: 'Selection',
        // multi_select: 'Multi Selection',
        // image: 'Image Drawing',
    },

    registrationPortal: {
        viewProfile: 'PORTAL_VIEW_PROFILE',
        requiredProfile: 'PORTAL_REQUIRED_PROFILE',
        viewPersonalID: 'PORTAL_VIEW_PERSONAL_ID',
        requiredPersonalID: 'PORTAL_REQUIRED_PERSONAL_ID',
        viewDateOfBirth: 'PORTAL_VIEW_DATE_OF_BIRTH',
        requiredDateOfBirth: 'PORTAL_REQUIRED_DATE_OF_BIRTH',
        viewPhone: 'PORTAL_VIEW_PHONE',
        requiredPhone: 'PORTAL_REQUIRED_PHONE',
        viewOccupation: 'PORTAL_VIEW_OCCUPATION',
        requiredOccupation: 'PORTAL_REQUIRED_OCCUPATION',
        viewStreetAddress: 'PORTAL_VIEW_STREET_ADDRESS',
        requiredStreetAddress: 'PORTAL_REQUIRED_STREET_ADDRESS',
        viewCity: 'PORTAL_VIEW_CITY',
        requiredCity: 'PORTAL_REQUIRED_CITY',
        viewZipcode: 'PORTAL_VIEW_ZIPCODE',
        requiredZipcode: 'PORTAL_REQUIRED_ZIPCODE',
        viewState: 'PORTAL_VIEW_STATE',
        requiredState: 'PORTAL_REQUIRED_STATE',
        viewCountry: 'PORTAL_VIEW_COUNTRY',
        requiredCountry: 'PORTAL_REQUIRED_COUNTRY',
    },

    category: `${baseUrl}/v2/categories`,
    categoryCreate: `${baseUrl}/v2/categories/store`,
    categoryUpdate(id: IdType) {
        return `${baseUrl}/v2/categories/${id}/update`
    },
    categoryDelete(id: IdType) {
        return `${baseUrl}/v2/categories/${id}/active-toggle`
    },

    service: `${baseUrl}/v2/services`,
    serviceCreate: `${baseUrl}/v2/services/store`,
    serviceUpdate(id: IdType) {
        return `${baseUrl}/v2/services/${id}/update`
    },
    serviceyDelete(id: IdType) {
        return `${baseUrl}/v2/services/${id}/active-toggle`
    },
    serviceyRestore(id: IdType) {
        return `${baseUrl}/v2/services/${id}/destroy`
    },
    clientMerge: `${baseUrl}/v2/client/merge`,
};

export default api;
