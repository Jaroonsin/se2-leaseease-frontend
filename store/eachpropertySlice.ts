import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { apiClient } from '@/src/api/axios';
import { AsyncThunkConfig, RootState } from './store';

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
    name: string;
    rating: number;
    location: string;
    size: number;
    price: number;
    date: string;
    image_url: string;
    reviews: number;
	review_count : number;
    status: string;
    detail: string;
};

interface EachPropertyState {
    properties: Property[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    selectedProperty: Property | null;
    loading: boolean;
    error: string | null;
}

const initialState: EachPropertyState = {
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
    'properties/getById',
    async (id, { rejectWithValue }) => {
        try {
            const res: AxiosResponse<ApiResponse<Property>> = await apiClient.get(`properties/get/${id}`);
            return res.data.data!;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const createLeaseReservation = createAsyncThunk<LeaseReservationResponse, LeaseReservationRequest, AsyncThunkConfig>(
    'leaseReservation/create',
    async (reservationData, { rejectWithValue }) => {
        try {
            const res: AxiosResponse<LeaseReservationResponse> = await apiClient.post(
                'lessee/create',
                reservationData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        // Add other headers if necessary
                    },
                }
            );
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const propertiesSlice = createSlice({
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
    },
});

export const { setSelectedProperty } = propertiesSlice.actions;

export default propertiesSlice.reducer;
