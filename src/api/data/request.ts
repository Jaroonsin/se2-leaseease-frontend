import { apiClient } from '../axios';

export type requestData = {
    name: string;
    requestedAt: string;
    purpose: string;
    propertyName: string;
    imageURL: string;
    id: number;
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
            id: item.id,
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
};
export const acceptRequest = async (id: number) => {
    try {
        const response = await apiClient.post(`/lessor/accept/${id}`);
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }
};
export const rejectRequest = async (id: number) => {
    try {
        const response = await apiClient.post(`/lessor/decline/${id}`);
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching reservations:', error);
    }
};
