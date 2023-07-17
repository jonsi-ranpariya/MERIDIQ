import { Setting } from "./setting";
import { Subscription } from "./subscription";
import { User } from "./user";

export interface Company {
    id: number
    encrypted_id: string
    company_name: string
    first_name: string
    last_name: string
    date_of_birth: string
    profile_photo: string
    language_id: number
    email: string
    mobile_number: string
    street_address: string
    zip_code: string
    city: string
    state: string
    country: string
    email_verified_at?: string | null
    password: string
    created_at: string
    updated_at?: string | null
    deleted_at?: string | null
    is_blocked: boolean
    is_read_only: boolean
    is_cancelled: boolean
    is_subscribed: boolean
    has_pending_payment: boolean
    storage_usage: string
    card_brand?: string | null
    card_last_four?: string | null
    subscriptions: Subscription[]
    unit: Unit,
    users_count: string
    clients_count: string
    procedures_count: string
    last_login_at: string
    lead: CompanyLead,
    users?: User[],
    settings?: Setting[],
    country_code?: string
}

export interface CompanyLead {
    id: number;
    company_id: number;
    notes: string;
    status: CompanyLeadStatus;
    contacted: boolean;
    created_at: string;
    updated_at: string;
}

export type CompanyLeadStatus = 'win' | 'lost' | 'not_decided'

export type Unit = "eur" | "usd" | "sek" | "gbp";