

export interface Data {
    answer: string;
    more_info?: string;
}

export interface ClientCovid19 {
    id: number;
    data: Data[];
    client_id: number;
    created_at: string;
    updated_at: string;
    datas_count?: number;
}
