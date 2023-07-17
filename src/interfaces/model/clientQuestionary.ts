import { Questionary } from "./questionary";

export interface ClientQuestionary {
    id: number;
    client_id: number;
    pdf: string;
    response: string;
    modelable?: Questionary;
    modelable_type: QuestionerModelableType;
    modelable_id: number;
    created_at: string;
    updated_at: string;
    formatted_response: any[];
}

export type QuestionerModelableType = "App\\HealthQuestionary" | "App\\AestheticInterest" | "App\\Covid19" | "App\\Questionary";
