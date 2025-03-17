import { apiClient } from '../axios';

export type lesseeData = {
    name: string;
    lastResponse: string;
    purpose: string;
    propertyName: string;
    imageURL: string;
};

export const convertToLesseeData = (response: any): lesseeData[] => {
    return response.data
        .filter((item: any) => item.status === 'accept')
        .map((item: any) => ({
            name: item.lesseeName, // Assuming propertyName is the name
            lastResponse: item.lastModified,
            purpose: item.purpose,
            propertyName: item.propertyName,
            imageURL: item.imageURL,
        }));
};
export const getLesseeData = async (propID: number) => {
    let data: lesseeData[] = [];

    if (propID === -1) return data;

    try {
        const response = await apiClient.get(`lessor/reservations/${propID}`);
        console.log(response.data);
        return convertToLesseeData(response.data); // Return the fetched data
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return data; // Return default data in case of error
    }
};
