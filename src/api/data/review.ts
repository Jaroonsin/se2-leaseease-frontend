import { apiClient } from '../axios';

export type reviewData = {
    name: string;
    reviewedAt: string;
    rating: number;
    message: string;
    imageURL: string;
};

export const convertToReviewData = (response: any): reviewData[] => {
    return response.data.reviews.map((item: any) => ({
        name: item.lessee_name, // Assuming propertyName is the name
        reviewedAt: item.time_stamp,
        message: item.review_message,
        imageURL: item.imageURL,
        rating: item.rating,
    }));
};
export const getReviewData = async (propID: number) => {
    let data: reviewData[] = [];

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
