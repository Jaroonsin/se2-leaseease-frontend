import { apiClient } from '../axios';

export type userData = {
    id: number;
    role: string;
    name: string;
    status: string;
    address: string;
    image_url: string;
};

export const convertToUserData = (response: any): userData[] => {
    return response.data
        .filter((item: any) => item.status !== 'warned')
        .map((item: any) => ({
            id: item.id,
            role: item.role,
            name: item.name,
            status: item.status,
            address: item.address,
            imageURL: item.imageURL,
        }));
};
export const getUserData = async () => {
    const data: userData[] = [];
    try {
        const response = await apiClient.get(`/admin/get-users`);
        console.log(response.data);
        return convertToUserData(response.data); // Return the fetched data
    } catch (error) {
        console.error('Error fetching users data:', error);
        return data; // Return default data in case of error
    }
};
export const updateUserStatus = async (id: number, status: string) => {
    try {
        const response = await apiClient.patch(`/admin/update-users-status/${id}`, {
            status: status,
        });
        console.log(response.data);
    } catch (error) {
        console.error('Error updating user status:', error);
    }
};
