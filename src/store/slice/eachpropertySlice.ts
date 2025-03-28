import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { apiClient } from '@/src/api/axios';
import { AsyncThunkConfig, RootState } from '../store';

interface Data {
    properties: Property[];
    total_records: number;
    total_pages: number;
    current_page: number;
    page_size: number;
}

interface ApiResponse<T> {
    status_code: number;
    message: string;
    data?: T;
}

export type Property = {
    id: number;
    lessor_id: number;
    name: string;
    rating: number;
    location: string;
    size: number;
    price: number;
    date: string;
    image_url: string;
    reviews: number;
    review_count: number;
    status: string;
    details: string;
};

interface EachPropertyState {
    properties: Property[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    user: User | null;
    selectedProperty: Property | null;
    loading: boolean;
    error: string | null;
}

const initialState: EachPropertyState = {
    user: null,
    properties: [],
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
    selectedProperty: null,
    loading: false,
    error: null,
};

interface LeaseReservationRequest {
    interestedProperty: number | null;
    proposedMessage: string | null;
    purpose: string | null;
    question: string | null;
}

interface LeaseReservationResponse {
    id: number | null;
    status: string;
}

export const fetchPropertyById = createAsyncThunk<Property, number, AsyncThunkConfig>(
    'eachproperty/getById',
    async (id, { rejectWithValue }) => {
        try {
            const res: AxiosResponse<ApiResponse<Property>> = await apiClient.get(`properties/get/${id}`);
            res.data.data!.rating = parseFloat(res.data.data!.rating.toFixed(1));
            return res.data.data!;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUserById = createAsyncThunk<any, void, AsyncThunkConfig>(
    'eachproperty/getUserById',
    async (_, { getState, rejectWithValue }) => {
        try {
            const id = getState().eachproperty.selectedProperty?.lessor_id;
            const res: AxiosResponse<ApiResponse<User>> = await apiClient.get(`user/get/${id}`);
            return {
                ...res.data.data!,
                id: id,
            };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createLeaseReservation = createAsyncThunk<
    LeaseReservationResponse,
    LeaseReservationRequest,
    AsyncThunkConfig
>('eachproperty/create', async (reservationData, { rejectWithValue }) => {
    try {
        const res: AxiosResponse<LeaseReservationResponse> = await apiClient.post('lessee/create', reservationData, {
            headers: {
                'Content-Type': 'application/json',
                // Add other headers if necessary
            },
        });
        return res.data;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

const eachpropertySlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
        setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
            state.selectedProperty = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder

            // fetch property by id
            .addCase(fetchPropertyById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPropertyById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProperty = action.payload;
            })
            .addCase(fetchPropertyById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(createLeaseReservation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createLeaseReservation.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createLeaseReservation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            });
    },
});

export const { setSelectedProperty } = eachpropertySlice.actions;

export default eachpropertySlice.reducer;
