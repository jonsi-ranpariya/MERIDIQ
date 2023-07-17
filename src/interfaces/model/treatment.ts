export type TreatmentType = "treatment" | "text"

export interface Treatment {
    id: number;
    company_id: number;
    name: string;
    description: string;
    cost: string;
    color: string;
    type: TreatmentType
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    unit: string;
    notes: string;
}