import { User } from "./user";

export interface ClientLetterOfConsent {
    id: number;
    client_id: number;
    consent_id: string;
    signature: string;
    is_bad_allergic_shock: string;
    created_at: string;
    updated_at: string;
    consent_title: string;
    letter: string;
    is_publish_before_after_pictures: string;
    version: string;
    signed_file: string;
    verified_signed_at: string;
    verified_sign: string;
    verified_sign_by_id?: number;
    verified_signed_by: User;
}