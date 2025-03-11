import { useAppSelector } from '@/store/hooks';
import { apiClient } from '../axios';

export type requestData = {
    name: string;
    requestedAt: string;
    purpose: string;
    propertyName: string;
    imageURL: string;
};

export const convertToRequestData = (response: any): requestData[] => {
    return response.data
        .filter((item: any) => item.status === 'pending') // Only keep pending items
        .map((item: any) => ({
            name: item.lesseeName, // Assuming propertyName is the name
            requestedAt: item.lastModified, // Use lastModified for requestedAt
            purpose: item.purpose,
            propertyName: item.propertyName,
            imageURL: item.imageURL,
        }));
};
export const getRequestData = async (propID: number) => {
    let data: requestData[] = [];

    if (propID === -1) return data;

    try {
        const response = await apiClient.get(`lessor/reservations/${propID}`);
        console.log(response.data);
        return convertToRequestData(response.data); // Return the fetched data
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return data; // Return default data in case of error
    }
    return data;
};
