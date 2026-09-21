import { Employee } from "./Employee";

export type Project = {
    id: number;
    title: string;
    slug: string;
    start_date?: string;
    finish_date?: string;
    employee_id: string | number;
    employee?: Employee; // Eager-loaded relationship from Laravel
    ward_id: string;
    image?: string;
    notice: boolean;
    status: string;
    description: string;
};