import { Category } from "./category";
export interface Service {
    id: number;
    name: string;
    category_id: string;
    category: Category;
    color: string;
    price: number;
    duration: number;
    description: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: any;
}