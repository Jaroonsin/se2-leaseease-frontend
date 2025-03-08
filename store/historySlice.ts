import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'
import { apiClient } from '@/src/api/axios' // Import your Axios client
import { AsyncThunkConfig, RootState } from './store'

// Define the type for the reservation data
interface Reservation {
	id: number
	purpose: string
	proposedMessage: string
	question: string
	status: string
	interestedProperty: number
	lesseeID: number
	propertyName: string
	lastModified: string
}

// Define the type for the API response
interface ApiResponse<T> {
	status_code: number
	message: string
	data?: T
}

// Define the state shape for reservations
interface ReservationsState {
	reservations: Reservation[]
	loading: boolean
	error: string | null
}

const initialState: ReservationsState = {
	reservations: [],
	loading: false,
	error: null,
}

// Fetch Reservations
export const fetchReservations = createAsyncThunk<
	ApiResponse<Reservation[]>, // Success type
	void, // Payload type
	AsyncThunkConfig // Custom configuration
>('reservations/fetch', async (_, { rejectWithValue }) => {
	try {
		const response: AxiosResponse<ApiResponse<Reservation[]>> = await apiClient.get(
			'http://localhost:5000/api/v2/lessee/reservations'
		)
		return response.data // Return the data if successful
	} catch (error: any) {
		return rejectWithValue(error.message) // Return error message if failed
	}
})

// Create a slice to handle the reservation state
const reservationsSlice = createSlice({
	name: 'reservations',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Fetch Reservations
			.addCase(fetchReservations.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchReservations.fulfilled, (state, action) => {
				state.loading = false
				state.reservations = action.payload.data || [] // Store the fetched reservations
			})
			.addCase(fetchReservations.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload as string // Set error message if the request fails
			})
	},
})

export default reservationsSlice.reducer

