import { apiClient } from '../axios';

export type reviewData = {
    name: string;
    reviewedAt: string;
    rating: number;
    message: string;
    imageURL: string;
    id: number;
    lesseeID: number;
};
export type reviewDataForAdmin = {
    name: string;
    reviewedAt: string;
    message: string;
    imageURL: string;
    id: number;
    lesseeID: number;
    pname: string;
};
export const convertToReviewData = (response: any): reviewData[] => {
    return response.data.reviews.map((item: any) => ({
        name: item.lessee_name, // Assuming propertyName is the name
        reviewedAt: item.time_stamp,
        message: item.review_message,
        imageURL: item.imageURL,
        rating: item.rating,
        id: item.id,
        lesseeID: item.lesseeID,
    }));
};
export const getReviewData = async (propID: number) => {
    const data: reviewData[] = [];

    if (propID === -1) return data;

    try {
        const response = await apiClient.get(`propertyReview/get/${propID}`);
        console.log(response.data);
        return convertToReviewData(response.data); // Return the fetched data
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return data; // Return default data in case of error
    }
};
export const getReviewDataForAdmin = async (
    page: number,
    pageSize: number,
    name: string,
    sort: string,
    dir: string
) => {
    const data: reviewDataForAdmin[] = [];
    try {
        const response = await apiClient.get(
            `admin/get-reviews/?page=${page}&pageSize=${pageSize}&name=${name}&sort=${sort}&dir=${dir}`
        );
        return [convertToReviewDataForAdmin(response.data), response.data.data.total_pages]; // Return the fetched data
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return [data, 1]; // Return default data in case of error
    }
};
export const convertToReviewDataForAdmin = (response: any): reviewDataForAdmin[] => {
    return response.data.reviews.map((item: any) => ({
        name: item.lessee_name, // Assuming propertyName is the name
        reviewedAt: item.time_stamp,
        message: item.review_message,
        imageURL: item.imageURL,
        id: item.review_id,
        lesseeID: item.lesseeID,
        pname: item.property_id,
    }));
};
export const deleteReview = async (id: number) => {
    try {
        const response = await apiClient.delete(`propertyReview/delete/${id}`);
    } catch (error) {}
    return;
};
