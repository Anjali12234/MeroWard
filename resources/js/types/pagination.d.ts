export interface PaginationLink {
    url: string | null
    label: string
    active: boolean
}

export interface PaginationMeta {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export interface PaginatedResponse<T> {
    data: T[]
    links: PaginationLink[]
    meta: PaginationMeta
}
