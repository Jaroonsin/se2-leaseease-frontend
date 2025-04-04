
export interface ApiResponse<T> {
    status_code: number;
    message: string;
    data?: T;
}

export type Property = {
    id: number;
    name: string;
    rating: number;
    location: string;
    size: number;
    price: number;
    date: string;
    image_url: string;
    review_count: number;
    status: string;
    detail: string;
};

export interface User {
    id: string;
    role: string;
    email: string;
    name: string;
    address: string;
    image_url: string;
}

export type errorType = {
    message: string;
};
