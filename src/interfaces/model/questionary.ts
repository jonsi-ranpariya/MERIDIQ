import { ClientQuestionary } from "./clientQuestionary";

export interface StandardQuestionary {
    id: number;
    key: string;
    value: string;
    company_id: number;
}

export interface Questionary {
    id: number;
    company_id: number;
    title: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: any;
    datas_count: number;
    questions?: QuestionaryQuestion[];
    data?: ClientQuestionary;
}

export interface QuestionaryQuestion {
    id: number;
    questionary_id: number;
    question: string;
    options?: any;
    required: boolean;
    type: 'yes_no_textbox' | 'textbox' | 'yes_no';
    order: number;
    created_at: string;
    updated_at: string;
}

export interface QuestionaryPaginateResponse {
    message: string;
    status: string;
    current_page: number;
    data: Questionary[];
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

export interface QuestionaryQuestionTypes {
    // yes_no: 'Yes/No',
    yes_no_textbox: 'Yes/No with Textbox',
    textbox: 'Textbox',
    // select: 'Selection',
    // multi_select: 'Multi Selection',
    // image: 'Image Drawing',
}