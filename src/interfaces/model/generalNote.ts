import { File } from "./File";
import { User } from "./user";

export interface GeneralNote {
    id: number;
    title: string;
    important: boolean;
    notes: string;
    notes_html?: string;
    sign?: string;
    filename?: string,
    filenames?: string[],
    signed_at?: string;
    client_id: number;
    sign_by_id?: number;
    created_at: string;
    updated_at?: string;
    signed_by?: User;
    file?: File,
    files?: File[],
}