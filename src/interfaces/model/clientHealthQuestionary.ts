

export interface DataNew {
    answer: string;
    more_info: string;
}

export interface ClientHealthQuestionary {
    id: number;
    data?: string;
    client_id: number;
    created_at: string;
    updated_at: string;
    pdf?: string;
    data_new?: DataNew[];
    datas_count?: number;
}