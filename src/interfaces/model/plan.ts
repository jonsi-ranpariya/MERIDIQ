
export interface Plan {
    client: string
    cost: string
    cost_value: string
    currency: string
    created_at: string
    description: string
    id: number
    name: string
    plan_id: string
    is_free: boolean
    storage: string
    subscription_id: string
    updated_at?: string | null
    users: string
    focused?: boolean
}

export interface NewPlan {
    id: number;
    name: string;
    subscription_id: string;
    plan_id: string;
    cost: string;
    description: string;
    users: number;
    client: number;
    storage: string;
    created_at: string;
    updated_at?: string;
    cost_value: number;
    is_free: boolean;
    currency: string;
    is_selected: boolean;
    is_disabled: boolean;
    show_popup: boolean;
    quantity: number;
    focused?: boolean;
}