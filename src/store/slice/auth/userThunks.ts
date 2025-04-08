import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/src/api/axios';
import { AsyncThunkConfig } from '../../store';
import { ApiResponse, User } from '@/src/types/type';
import uploadImage from '@/src/api/image';

export const fetchUserInfo = createAsyncThunk<ApiResponse<User>, void, AsyncThunkConfig>(
    'auth/fetchUserInfo',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ApiResponse<User>>('user/check');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error connecting to API');
        }
    }
);
export const updateUserInfo = createAsyncThunk<null, { name: string; address: string }, AsyncThunkConfig>(
    'auth/updateUserInfo',
    async (data, { rejectWithValue }) => {
        try {
            const response = await apiClient.put<ApiResponse<User>>('user/user', {
                name: data.name,
                address: data.address,
            });
            return null;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error connecting to API');
        }
    }
);

export const updateUserImage = createAsyncThunk<null, void, AsyncThunkConfig>(
    'auth/updateUserImage',
    async (_, { getState, rejectWithValue }) => {
        const image_url = getState().auth.user?.image_url;
        try {
            await apiClient.put<ApiResponse<User>>('user/image', {
                image_url: image_url,
            });
            return null;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error connecting to API');
        }
    }
);

export const uploadUserImage = createAsyncThunk<string, FormData, AsyncThunkConfig>(
    'auth/uploadImage',
    async (formData, { getState, rejectWithValue }) => {
        try {
            const id = getState().auth.user?.id || '';

            if (!formData) {
                throw new Error('No file provided');
            }
            const response = await uploadImage(id, 'profiles', formData);
            if (!response) {
                throw new Error('Error uploading image');
            }

            return response;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateUserPassword = createAsyncThunk<
    null,
    { currentPassword: string; newPassword: string },
    AsyncThunkConfig
>('auth/updateUserPassword', async (data, { rejectWithValue }) => {
    try {
        await apiClient.post<ApiResponse<User>>('user/change-password', {
            old_password: data.currentPassword,
            new_password: data.newPassword,
        });
        return null;
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Error changing password');
    }
});
