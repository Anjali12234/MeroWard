
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

export type Notice = {
    id: number;
    title_en: string,
    title_ne: string,
    slug: string,
    published_date: string,
    ward_id: string,
    document: string,
    
}
export type Event = {
     id: number;
    title: string,
    description: string,
    location: string,
    event_date: string,
    status: string,
    ward_no: string,
    minutes_pdf: string,
    
}


