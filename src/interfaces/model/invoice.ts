import { NewPlan } from "./plan";

export type InvoiceStatus = "paid" | "draft" | "open" | "uncollectible" | "void";

export interface Invoice {
  "id": string,
  "number": string,
  "subtotal": number,
  "tax": number,
  "total": number,
  "currency": string,
  "amount_paid": number,
  "paid_at": string,
  "created": string,
  "status": InvoiceStatus,
  "paid": boolean,
  "pdf": string,
  "items": {
    "amount": number,
    "quantity": number,
    "plan": NewPlan
  }[]
}