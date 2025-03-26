// userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { apiClient } from '@/src/api/axios';

// Define User interface
interface User {
	name: string;
	address: string;
	image_url: string;
}

// Define the state shape for the user slice
interface UserState {
	user: User | null;
	loading: boolean;
	error: string | null;
}

// Define initial state
const initialState: UserState = {
	user: null,
	loading: false,
	error: null,
};

// Async thunk to fetch user by ID
export const fetchUserById = createAsyncThunk<User, number>(
	'user/fetchUserById',
	async (id: number, { rejectWithValue }) => {
		try {
			const response = await apiClient.get(`user/get/${id}`);
			console.log('cat response:', response.data.data)
			return response.data.data; // Assuming `data` holds the user details
		} catch (error: any) {
			console.log('cat error:', error.message)
			return rejectWithValue(error.message);
		}
	}
);

// Create user slice
const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<User | null>) {
			state.user = action.payload;
		},
		setError(state, action: PayloadAction<string | null>) {
			state.error = action.payload;
		},
		setLoading(state, action: PayloadAction<boolean>) {
			state.loading = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserById.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUserById.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(fetchUserById.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

// Export actions
export const { setUser, setError, setLoading } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
