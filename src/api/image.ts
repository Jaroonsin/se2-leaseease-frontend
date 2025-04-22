import { apiClient } from './axios';
import { ApiResponse } from '@/src/types/type';

export default async function uploadImage(id: string, category: string, formData: FormData): Promise<string> {
    formData.append('category', category);
    formData.append('id', id);
    const response = await apiClient.post<ApiResponse<{ image_url: string }>>('images/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Important for file uploads
        },
    });

    return response.data.data?.image_url || ''; // Return empty string if data is undefined
}
