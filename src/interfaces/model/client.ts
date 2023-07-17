import { Address } from "./address";
import { ClientAestheticInsterest } from "./clientAesthethicInterest";
import { ClientCovid19 } from "./clientCovid19";
import { ClientHealthQuestionary } from "./clientHealthQuestionary";
import { ClientLetterOfConsent } from "./clientLetterOfConsent";
import { ClientTreatment } from "./clientTreatment";
import { File } from "./File";
import { GeneralNote } from "./generalNote";


export interface Client {
    id: number;
    profile_picture: string;
    first_name: string;
    last_name: string;
    social_security_number: string;
    email: string;
    phone_number: string;
    user_id?: number;
    company_id: number;
    personal_id?: string;
    created_at: string;
    updated_at: string;
    occupation: string;
    full_name: string;
    media?: ClientMedia,
    general_notes_count?: number;
    general_notes_unsigned_exists?: boolean;
    treatments_unsigned_exists?: boolean;
    letter_of_consents_unsigned_exists?: boolean;
    letter_of_consents_count?: number;
    questionaries_count?: number;
    treatments_count?: number;
    addresses?: Address[];
    consent?: Consent;
    verification?: Verification;
    general_notes?: GeneralNote[];
    letter_of_consents?: ClientLetterOfConsent[];
    treatments?: ClientTreatment[];
    health_questionaries?: ClientHealthQuestionary[];
    aesthetic_insterests?: ClientAestheticInsterest[];
    covid19s?: ClientCovid19[];
    extra_fields?: ClientExtraField[];
    deleted_at?: string,
    country_code?: string,
}

export interface Verification {
    id: number,
    client_id: number,
    has_id: number
    has_driving_license: number
    has_passport: number
    other?: number
    note?: string
}

export interface ClientExtraField {
    id: number,
    client_id: number,
    value: string,
    company_client_extra_field_id: number,
}

export interface Consent {
    id: number,
    client_id: number,
    fields: string,
    message: string,
    verified_at: string,
}

export interface ClientKind {
    id: number,
    client_id: number,
    name: string,
    email: string,
    phone: string,
    relation: string,
}

export interface ClientMedia {
    id: number,
    client_id: number,
    files_count?: number,
    files?: File[],
}