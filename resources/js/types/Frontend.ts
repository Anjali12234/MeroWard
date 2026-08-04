
export type Employees = {
    id: number;
    name: string,
    image: string,
    designation: string,
    section: string,
    position: string,
    email: string,
    phone: string,
    ward_no: string,
    is_employee: boolean,
}

export type Services = {
    id: number;
    employee_id: string,
    service_name: string,
    required_documents: string,
    time: string,
    ward_no: string,
    price: string,
    
}


