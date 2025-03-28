import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { apiClient } from '@/src/api/axios'; // Import your Axios client
import { AsyncThunkConfig, RootState } from '../store';

// Define the type for the reservation data
interface Reservation {
    id: number;
    purpose: string;
    proposedMessage: string;
    question: string;
    status: string;
    interestedProperty: number;
    lesseeID: number;
    propertyName: string;
    lastModified: string;
}

// Define the type for the API response
interface ApiResponse<T> {
    status_code: number;
    message: string;
    data?: T;
}

// Define the state shape for reservations
interface ReservationsState {
    reservations: Reservation[];
    loading: boolean;
    error: string | null;
    successMessage: string | null;
    paymentStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ReservationsState = {
    reservations: [],
    loading: false,
    error: null,
    successMessage: null,
    paymentStatus: 'idle',
};

interface PaymentPayload {
    amount: number;
    reservationId: number;
    tokenData: string;
}

interface ReviewPayload {
    property_id: number;
    rating: number | null;
    review_message: string;
}

export const createPayment = createAsyncThunk<
    string, // Success type: payment success message
    PaymentPayload, // Payload type
    AsyncThunkConfig // Custom configuration
>('reservations/createPayment', async ({ amount, reservationId, tokenData }, { rejectWithValue }) => {
    try {
        // Step 2: Send token and payment data to backend
        const paymentResponse = await apiClient.post(`payments/process`, {
            amount: Math.round(amount * 100), // Convert THB to satang
            currency: 'THB',
            token: tokenData,
            reservation_id: reservationId,
        });

        if (paymentResponse.data.status_code === 200) {
            console.log('Payment successful:', paymentResponse.data);
            return paymentResponse.data.message; // Return success message
        } else {
            console.error('Payment failed:', paymentResponse.data.message);
            return rejectWithValue(paymentResponse.data.message ?? 'Payment failed');
        }
    } catch (error: any) {
        console.error('Payment error:', error.message);
        return rejectWithValue(error.message);
    }
});

export const updateReservationStatus = createAsyncThunk<
    string, // Success type
    { reservationId: number; status: string }, // Payload type
    AsyncThunkConfig // Config type
>('reservations/updateStatus', async ({ reservationId, status }, { rejectWithValue }) => {
    try {
        const response = await apiClient.patch(`reservations/${reservationId}`, { status });

        if (response.data.status_code === 200) {
            console.log('Status updated:', response.data.message);
            return response.data.message;
        } else {
            return rejectWithValue(response.data.message ?? 'Failed to update status');
        }
    } catch (error: any) {
        console.error('Status update error:', error.message);
        return rejectWithValue(error.message);
    }
});

export const createReview = createAsyncThunk<
    string, // Success type
    ReviewPayload, // Payload type
    AsyncThunkConfig // Config type
>('propertyReview/create/', async ({ property_id, rating, review_message }, { rejectWithValue }) => {
    try {
        const response = await apiClient.post(`propertyReview/create/`, {
            property_id,
            rating,
            review_message,
        });

        if (response.data.status_code === 200) {
            console.log('Status updated:', response.data.message);
            return response.data.message;
        } else {
            return rejectWithValue(response.data.message ?? 'Failed to update status');
        }
    } catch (error: any) {
        console.error('Status update error:', error.message);
        return rejectWithValue(error.message);
    }
});

// Fetch Reservations
export const fetchReservations = createAsyncThunk<
    ApiResponse<Reservation[]>, // Success type
    void, // Payload type
    AsyncThunkConfig // Custom configuration
>('reservations/fetch', async (_, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<ApiResponse<Reservation[]>> = await apiClient.get(`lessee/reservations`);
        return response.data; // Return the data if successful
    } catch (error: any) {
        return rejectWithValue(error.message); // Return error message if failed
    }
});

export const deleteReservation = createAsyncThunk<
    number, // Success type: return the id on success
    number, // Payload type: reservation id
    AsyncThunkConfig // Custom configuration
>('reservations/delete', async (id, { rejectWithValue }) => {
    try {
        const response = await apiClient.delete(`lessee/delete/${id}`);
        if (response.data.status_code === 200) {
            return id; // Return the id directly
        }
        return rejectWithValue('Failed to delete reservation');
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

const reservationsSlice = createSlice({
    name: 'reservations',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Reservations
            .addCase(fetchReservations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReservations.fulfilled, (state, action) => {
                state.loading = false;
                state.reservations = action.payload.data || []; // Store the fetched reservations
            })
            .addCase(fetchReservations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Delete Reservation
            .addCase(deleteReservation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReservation.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted reservation using the id from action.payload
                state.reservations = state.reservations.filter((reservation) => reservation.id !== action.payload);
                // Optional: Show success message
                state.successMessage = 'Reservation deleted successfully';
            })
            .addCase(deleteReservation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createPayment.pending, (state) => {
                state.paymentStatus = 'loading';
                state.error = null;
            })
            .addCase(createPayment.fulfilled, (state, action) => {
                state.paymentStatus = 'succeeded';
                state.successMessage = action.payload;
            })
            .addCase(createPayment.rejected, (state, action) => {
                state.paymentStatus = 'failed';
                state.error = action.payload as string;
            })
            .addCase(updateReservationStatus.fulfilled, (state, action) => {
                state.successMessage = action.payload;
                state.reservations = state.reservations.map((reservation) =>
                    reservation.id === action.meta.arg.reservationId
                        ? { ...reservation, status: action.meta.arg.status }
                        : reservation
                );
            })
            .addCase(updateReservationStatus.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default reservationsSlice.reducer;
