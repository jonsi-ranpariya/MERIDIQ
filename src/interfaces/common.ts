import { RouteMatch } from "react-router-dom";
import { Client, ClientKind } from "./model/client";
import { ClientLetterOfConsent } from "./model/clientLetterOfConsent";
import { ClientQuestionary } from "./model/clientQuestionary";
import { ClientTreatment } from "./model/clientTreatment";
import { Company } from "./model/company";
import { CompanyClientExtraField } from "./model/companyClientExtraField";
import { File } from "./model/File";
import { GeneralNote } from "./model/generalNote";
import GraphData from "./model/graph";
import { Invoice } from "./model/invoice";
import { LetterOfConsent } from "./model/letterOfConsent";
import { Log } from "./model/log";
import { MediaData } from "./model/media_data";
import { NewPlan } from "./model/plan";
import { Questionary, QuestionaryQuestion } from './model/questionary';
import { Setting } from './model/setting';
import { Template } from "./model/template";
import { Category } from "./model/category";
import { Service } from "./model/service";
import { Treatment } from "./model/treatment";
import { User } from "./model/user";

export interface CommonModelResponse<T> {
    data: T,
    message?: string,
    status?: "1" | "0" | "5",
}

export interface CommonModelPaginatedResponse<T> {
    message: string;
    status: string;
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url?: any;
    path: string;
    per_page: number;
    prev_page_url?: any;
    to: number;
    total: number;
}

export declare class Error {
    public status?: number;
    public message: string;
    constructor(message?: string);
}

export interface BreadcrumbsField {
    name: React.ReactNode | string,
    path: string,
    icon: string,
    match: RouteMatch<any>,
}

export interface SubscriptionCreate {
    intent: string,
    // plans: {
    //     free: Plan,
    //     licensed: Plan,
    // },
    plans: NewPlan[],
    client_count: number,
    user_count: number,
    storage_count: number,
}

export interface SubscriptionEdit {
    phone?: string,
    name?: string,
    vat_number?: string,
    vat_code?: string,
    card?: {
        brand: string,
        exp_month: number,
        exp_year: number,
        last4: string
    },
    address?: {
        city?: string,
        country?: string,
        line1?: string,
        postal_code?: string,
    }
}

export interface BoxData {
    total_clients: number
    total_company: number
    total_treatment: number
    total_users: number
}

export type SettingTypes = 'CLIENT_ACCESS_FULL_ACCESS' | 'SHOW_HEALTH_QUESTIONNAIRE' |
    'SHOW_AESTHETIC_INTEREST' | 'SHOW_LETTER_OF_CONSENT' | 'SHOW_COVID_19'
    | 'SEND_CLIENT_WELCOME_EMAIL' | 'SHOW_2FA' | 'SEND_CLIENT_EMAILS' | 'SUPER_USER_MAIL_WHEN_CLIENT_REGISTER' | 'LOC_SIGNATURE';

export interface QuestionaryResponse extends CommonModelResponse<Questionary[]> { };

export interface SettingResponse extends CommonModelResponse<Setting[]> { };

export interface CompanyClientExtraFieldResponse extends CommonModelResponse<CompanyClientExtraField[]> { };

export interface CompanyUserResponse extends CommonModelResponse<User[]> { };

export interface UserResponse extends CommonModelResponse<User> { };

export interface UsersResponse extends CommonModelResponse<User[]> { };

export interface BoxDataResponse extends CommonModelResponse<BoxData> { };

export interface GraphDataResponse extends CommonModelResponse<GraphData[]> { };

export interface ClientQuestionariesResponse extends CommonModelPaginatedResponse<Questionary> { };

export interface TreatmentsResponse extends CommonModelResponse<Treatment[]> { };

export interface TemplatesResponse extends CommonModelResponse<Template[]> { };

export interface ClientResponse extends CommonModelResponse<Client> { };
export interface ClientsResponse extends CommonModelResponse<Client[]> { };

export interface CompanyResponse extends CommonModelResponse<Company> { };

export interface ClientKindResponse extends CommonModelResponse<ClientKind> { };

export interface ClientTreatmentResponse extends CommonModelResponse<ClientTreatment> { };

export interface LetterOfConsentResponse extends CommonModelResponse<LetterOfConsent[]> { };

export interface ClientAccessesResponse extends CommonModelResponse<number[]> { };

export interface InvoiceResponse extends CommonModelResponse<Invoice[]> { };

export interface QuestionaryQuestionResponse extends CommonModelResponse<QuestionaryQuestion[]> { };

export interface SubscriptionCreateResponse extends CommonModelResponse<SubscriptionCreate> { };
export interface SubscriptionEditResponse extends CommonModelResponse<SubscriptionEdit> { };

export interface TreatmentPaginatedResponse extends CommonModelPaginatedResponse<Treatment> { };

export interface TemplatesPaginatedResponse extends CommonModelPaginatedResponse<Template> { };

export interface LetterOfConsentPaginatedResponse extends CommonModelPaginatedResponse<LetterOfConsent> { };

export interface QuestionnairePaginatedResponse extends CommonModelPaginatedResponse<Questionary> { };

export interface QuestionnaireQuestionPaginatedResponse extends CommonModelPaginatedResponse<QuestionaryQuestion> { };

export interface ClientsPaginatedResponse extends CommonModelPaginatedResponse<Client> { };
export interface ClientsCountResponse extends CommonModelResponse<{
    clients: number
    users: number
}> { };

export interface CompaniesPaginatedResponse extends CommonModelPaginatedResponse<Company> { };

export interface ClientLogsPaginatedResponse extends CommonModelPaginatedResponse<Log> { };

export interface ClientGeneralNotesPaginatedResponse extends CommonModelPaginatedResponse<GeneralNote> { };

export interface ClientLetterOfConsentPaginatedResponse extends CommonModelPaginatedResponse<ClientLetterOfConsent> { };

export interface ClientQuestionaryPaginatedResponse extends CommonModelPaginatedResponse<ClientQuestionary> { };
export interface ClientQuestionaryResponse extends CommonModelResponse<Questionary[]> { };

export interface ClientProcedurePaginatedResponse extends CommonModelPaginatedResponse<ClientTreatment> { };

export interface ClientMediaPaginatedResponse extends CommonModelPaginatedResponse<MediaData> { };

export interface ClientMediasNoGroupByPaginatedResponse extends CommonModelPaginatedResponse<File> { };

export interface CategoryPaginatedResponse extends CommonModelPaginatedResponse<Category> { };

export interface ServicePaginatedResponse extends CommonModelPaginatedResponse<Service> { };

export interface CategoryResponse extends CommonModelResponse<Category> { };