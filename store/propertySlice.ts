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
    image: string;
    reviews: number;
    status: string;
    detail: string;
};

interface PropertiesState {
    properties: Property[];
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    selectedProperty: Property | null;
    loading: boolean;
    error: string | null;
}

const initialState: PropertiesState = {
    properties: [],
    totalRecords: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
    selectedProperty: null,
    loading: false,
    error: null,
};

// ** Fetch Properties **
export const fetchProperties = createAsyncThunk<Data, void, AsyncThunkConfig>(
    'properties/get',
    async (_, { rejectWithValue }) => {
        try {
            const res: AxiosResponse<ApiResponse<Data>> = await apiClient.get('properties/get');
            //dummy data
            const data: Data = res.data.data!;
            if (data) {
                const data_random: Property[] = data.properties.map((property, index) => ({
                    ...property,
                    rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
                    reviews: Math.floor(Math.random() * 500) + 1,
                    image: `https://loremflickr.com/2048/1280?random=${index + 1}`,
                    date: new Date(property.date).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                }));

                return { ...data, properties: data_random };
            }
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// ** Create Property **
export const createProperty = createAsyncThunk<Property, Property, AsyncThunkConfig>(
    'properties/create',
    async (property, { rejectWithValue }) => {
        try {
            const res = await apiClient.post('properties/create', property);
            property.id = res.data.data.property_id;
            return property;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// ** Update Property **
export const updateProperty = createAsyncThunk<Property, Property, AsyncThunkConfig>(
    'properties/update',
    async (property, { rejectWithValue }) => {
        try {
            await apiClient.put(`properties/update/${property.id}`, property);
            return property;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// ** Delete Property **
export const deleteProperty = createAsyncThunk<number, void, AsyncThunkConfig>(
    'properties/delete',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const id = state.property.selectedProperty?.id;
            await apiClient.delete(`properties/delete/${id}`);
            return id ? id : 0;
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
            // Fetch Properties
            .addCase(fetchProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                // console.log(action.payload)
                state.loading = false;
                state.properties = action.payload.properties || [];
                state.totalRecords = action.payload.total_records || 0;
                state.totalPages = action.payload.total_pages || 0;
                state.currentPage = action.payload.current_page || 1;
                state.pageSize = action.payload.page_size || 10;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create Property
            .addCase(createProperty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProperty.fulfilled, (state, action) => {
                state.loading = false;
                state.properties.push(action.payload);
                state.totalRecords += 1;
            })
            .addCase(createProperty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update Property
            .addCase(updateProperty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProperty.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProperty = action.payload;
                const index = state.properties.findIndex((prop) => prop.id === action.payload.id);
                if (index !== -1) {
                    state.properties[index] = {
                        ...state.properties[index],
                        ...action.payload,
                    };
                }
            })
            .addCase(updateProperty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete Property
            .addCase(deleteProperty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProperty.fulfilled, (state, action) => {
                state.loading = false;
                state.properties = state.properties.filter((prop) => prop.id !== action.payload);
                state.totalRecords -= 1;
            })
            .addCase(deleteProperty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSelectedProperty } = propertiesSlice.actions;

export default propertiesSlice.reducer;
