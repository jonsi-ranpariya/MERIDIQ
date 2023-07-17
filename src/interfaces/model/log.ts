import { User } from "./user";

export interface Log {
    id: number;
    log_name: string;
    description: string;
    subject_id: number;
    subject_type: string;
    causer_id: number;
    causer_type: string;
    properties?: any[];
    created_at: string;
    updated_at: string;
    user: User
}