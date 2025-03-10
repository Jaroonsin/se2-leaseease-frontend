import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/src/api/axios';
import { AsyncThunkConfig } from '../store';

export const login = createAsyncThunk<ApiResponse<User>, { email: string; password: string }, AsyncThunkConfig>(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ApiResponse<User>>('auth/login', {
                email: credentials.email,
                password: credentials.password,
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
// prettier-ignore
export const logout = createAsyncThunk<null, void, AsyncThunkConfig>(
	'auth/logout',
	async (_, { rejectWithValue }) => {
    try {
        await apiClient.post<ApiResponse<null>>('auth/logout');
        await new Promise((resolve) => setTimeout(resolve, 500));
        return null;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const register = createAsyncThunk<string, { user: User; password: string }, AsyncThunkConfig>(
    'auth/register',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ApiResponse<User>>('auth/register', {
                email: credentials.user.email,
                password: credentials.password,
                name: credentials.user.name,
                address: credentials.user.address,
                role: credentials.user.role,
            });
            return credentials.user.email;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const requestOTP = createAsyncThunk<null, void, AsyncThunkConfig>(
    'auth/requestOTP',
    async (_, { getState, rejectWithValue }) => {
        try {
            const email = getState().auth.email;
            const response = await apiClient.post<ApiResponse<null>>('auth/request-otp', {
                email,
            });
            return null;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const verifyOTP = createAsyncThunk<null, string, AsyncThunkConfig>(
    'auth/verifyOTP',
    async (otp, { getState, rejectWithValue }) => {
        try {
            const email = getState().auth.email;
            const response = await apiClient.post<ApiResponse<null>>('auth/verify-otp', {
                email,
                otp,
            });
            if (response.data.status_code !== 200) {
                return rejectWithValue(response.data.message);
            }
            return null;
        } catch (error: any) {
            return rejectWithValue('error from here');
        }
    }
);

export const forgotPassword = createAsyncThunk<null, { email: string }, AsyncThunkConfig>(
    'auth/forgotPassword',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ApiResponse<null>>('auth/forgot-password', {
                email: credentials.email,
            });
            return null;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
// prettier-ignore
export const resetPassword = createAsyncThunk<null, { email: string; password: string; token: string }, AsyncThunkConfig>(
    'auth/resetPassword',
    async (credentials , { rejectWithValue }) => {
        try {
            const response = await apiClient.post<ApiResponse<null>>('auth/reset-password', {
                email: credentials.email,
                password: credentials.password,
                token: credentials.token,
            });
            return null;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
