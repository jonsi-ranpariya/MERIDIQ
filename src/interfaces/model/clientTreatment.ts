import { File } from "./File";
import { TreatmentType } from "./treatment";
import { User } from "./user";

export interface ClientTreatment {
    id: number;
    client_id: number;
    name: string;
    description: string;
    cost: string;
    color: string;
    date: string;
    notes: string;
    notes_html?: string;
    images: string[];
    created_at: string;
    updated_at: string;
    unit: string;
    treatment_cost: string;
    user_id: number;
    treatment_id: string;
    sign: string;
    signed_at: string;
    signed_by_id?: number;
    files: File[];
    user: User;
    details: ClientTreatmentDetail[];
    signed_by: User;
}

export interface ClientTreatmentDetail {
    id: number;
    name: string;
    description: string;
    cost: string;
    unit: string;
    color: string;
    type: TreatmentType;
    notes: string;
    actual_cost: string;
    actual_unit: string;
    client_treatment_id: number;
    treatment_id: number;
    created_at: string;
    updated_at: string;
}