export interface LetterOfConsent {
    id: number;
    company_id: number;
    consent_title: string;
    letter: string;
    is_publish_before_after_pictures: "0" | "1";
    created_at: string;
    updated_at: string;
    version: string;
    deleted_at: string;
    letter_json: LetterJson;
    letter_html: string;
}

export interface LetterJson {
    time: any;
    blocks: Block[];
    version: string;
}

export interface Block {
    data: Data;
    type: string;
}

export interface Data {
    text: string;
    level?: number;
    items: string[];
    style: string;
}
