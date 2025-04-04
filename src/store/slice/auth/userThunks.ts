import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/src/api/axios';
import { AsyncThunkConfig } from '../../store';
import { getSupabaseClient } from '@/src/utils/supabase';
import { ApiResponse, User } from '@/src/types/type';

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
            const response = await apiClient.put<ApiResponse<User>>('user/image', {
                image_url,
            });
            return null;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error connecting to API');
        }
    }
);
export const updateUserPassword = () => {};

export const uploadImage = createAsyncThunk<string, FormData, AsyncThunkConfig>(
    'auth/uploadImage',
    async (formData, { getState, rejectWithValue }) => {
        try {
            const file = formData.get('file') as File;
            const userId = getState().auth.user?.id;
            if (!file) throw new Error('No file provided');
            const filePath = `${userId}/profile.jpg`;
            const supabase = getSupabaseClient();
            const { data, error } = await supabase.storage.from('user').update(filePath, file, {
                cacheControl: 'no-cache',
                upsert: true,
            });

            console.log('data', data?.fullPath);
            if (error) {
                console.error('Upload failed:', error.message);
                throw error;
            }

            return supabase.storage.from('user').getPublicUrl(filePath).data.publicUrl + '?version=1';
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
