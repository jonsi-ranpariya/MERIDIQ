
import { CommonModelResponse } from "../common";
import { Company } from './company';


export type UserRole = "admin" | "user" | "master_admin";

export interface User {
    city: null | string,
    company_id: number,
    country: null | string,
    created_at: string,
    deleted_at: null | string
    email: string
    company?: Company,
    email_verified_at: null | string
    first_name: string
    id: number
    is_active: boolean
    last_login_at: null | string
    last_name: string
    mobile_number: null | string,
    profile_photo: null | string,
    state: null | string
    street_address: null | string
    title: string | null
    updated_at: null | string
    user_role: UserRole
    zip_code: null | string
    country_code: null | string
}

export interface AuthUserResponse extends CommonModelResponse<User> { }; 