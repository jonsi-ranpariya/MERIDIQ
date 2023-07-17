


export interface DataNew {
    notes?: string;
    answer_checkbox?: string[];
    image?: string;
    other?: string;
}

export interface ClientAestheticInsterest {
    id: number;
    data?: any;
    client_id: number;
    created_at: string;
    updated_at: string;
    pdf?: string;
    datas_count?: number;
    data_new?: {
        aesthetic_interest?: DataNew[]
    };
}