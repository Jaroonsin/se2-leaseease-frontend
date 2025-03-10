import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/src/api/axios';
import { AsyncThunkConfig } from './store';
import { supabase } from '@/utils/supabase';

interface ApiResponse<T> {
    status_code: number;
    message: string;
    data?: T;
}

interface User {
    id: string;
    role: string;
    email: string;
    name: string;
    address: string;
    image_url: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    email: string;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    email: '',
};

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

export const uploadImage = createAsyncThunk<string, FormData, AsyncThunkConfig>(
    'auth/uploadImage',
    async (formData, { getState, rejectWithValue }) => {
        try {
            const file = formData.get('file') as File;
            const userId = getState().auth.user?.id;
            if (!file) throw new Error('No file provided');

            const filePath = `${userId}/profile.jpg`;

            const { error } = await supabase.storage
                .from('user')
                .upload(filePath, file, { cacheControl: '3600', upsert: false });

            if (error) {
                console.error('Upload failed:', error.message);
                throw error;
            }

            return supabase.storage.from('user').getPublicUrl(filePath).data.publicUrl;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data || null;
                state.isAuthenticated = true;
            })
            .addCase(fetchUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = typeof action.payload === 'string' ? action.payload : 'Something went wrong';
                state.isAuthenticated = false;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.data!;
                state.isAuthenticated = true;
                state.loading = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.loading = false;
                state.error = null;
            })
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.email = action.payload;
                state.loading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(verifyOTP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOTP.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(verifyOTP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(uploadImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadImage.fulfilled, (state, action) => {
                state.loading = false;
                state.user!.image_url = action.payload;
            })
            .addCase(uploadImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUserInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserInfo.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateUserInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUserImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserImage.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateUserImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default authSlice.reducer;
