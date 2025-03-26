import { createSlice, isRejected, isAnyOf } from '@reduxjs/toolkit';
import { fetchUserInfo, updateUserInfo, updateUserImage, uploadImage } from './userThunks';
import { login, logout, register, verifyOTP } from './authThunks';

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	loading: boolean;
	error: string | null;
	email: string;
	token: string;
}

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	loading: false,
	error: null,
	email: '',
	token: '',
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUserInfo.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload.data || null;
				state.isAuthenticated = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.token = action.payload;
				state.isAuthenticated = true;
				state.loading = false;
			})
			.addCase(logout.fulfilled, (state) => {
				state.user = null;
				state.isAuthenticated = false;
				state.loading = false;
				state.error = null;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.email = action.payload;
				state.loading = false;
			})
			.addCase(verifyOTP.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(uploadImage.fulfilled, (state, action) => {
				state.loading = false;
				state.user!.image_url = action.payload;
			})
			.addCase(updateUserInfo.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(updateUserImage.fulfilled, (state) => {
				state.loading = false;
			})
			.addMatcher(
				isAnyOf(
					fetchUserInfo.pending,
					login.pending,
					logout.pending,
					register.pending,
					verifyOTP.pending,
					uploadImage.pending,
					updateUserInfo.pending,
					updateUserImage.pending
				),
				(state) => {
					state.loading = true;
					state.error = null;
				}
			)
			.addMatcher(
				isAnyOf(
					fetchUserInfo.rejected,
					login.rejected,
					logout.rejected,
					register.rejected,
					verifyOTP.rejected,
					uploadImage.rejected,
					updateUserInfo.rejected,
					updateUserImage.rejected
				),
				(state, action) => {
					state.loading = false;
					// Use action.payload if available (for rejectWithValue), otherwise fallback to action.error.message
					state.error = action.payload
						? typeof action.payload === 'string'
							? action.payload
							: JSON.stringify(action.payload)
						: action.error.message || null;
				}
			);
	},
});

export default authSlice.reducer;
