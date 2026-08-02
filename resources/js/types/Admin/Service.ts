export type Employee = {
    id: number;
    name: string;
    is_employee?: number | boolean;
};

export type Service = {
    id: number;
    service_name: string;
    required_documents: string;
    time: string;
    ward_no: string;
    price: string;
    employees?: Employee[];
    employee_ids?: number[];
};