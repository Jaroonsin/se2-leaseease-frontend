export interface ApiResponse<T> {
    status_code: number;
    message: string;
    data?: T;
}

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
