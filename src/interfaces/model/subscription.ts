import { Plan } from "./plan";


export interface Subscription {
    company_id: number
    created_at: string
    ends_at: string
    id: number
    name: string
    plan: Plan
    quantity: number
    stripe_id: string
    stripe_plan: string
    stripe_status: "active" | "past_due" | "incomplete" | "cancelled"
    trial_ends_at: string | null
    updated_at: string
}