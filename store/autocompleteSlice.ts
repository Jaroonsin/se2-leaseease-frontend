import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/src/api/axios';
import { AsyncThunkConfig } from './store';
import { Property } from './propertySlice';

interface ApiResponse<T> {
    status_code: number;
    message: string;
    data?: {
        properties: T;
        last_page: number;
    };
}

interface AutocompleteResponse {
    status_code: number;
    message: string;
    data?: string[];
}

interface AutocompleteState {
    suggestions: string[];
    searchResults: Property[];
    loading: boolean;
    searchLoading: boolean;
    error: string | null;
    lastPage: number;
}

// Initial state
const initialState: AutocompleteState = {
    suggestions: [],
    searchResults: [],
    loading: false,
    searchLoading: false,
    error: null,
    lastPage: 1,
};

interface SearchParams {
    name?: string;
    minprice?: number;
    maxprice?: number;
    minsize?: number;
    maxsize?: number;
    sortby?: string;
    rating?: number;
    order?: 'asc' | 'desc';
    page?: number;
    pagesize?: number;
}

export const fetchAutocomplete = createAsyncThunk<string[], string, AsyncThunkConfig>(
    'autocomplete/fetchAutocomplete',
    async (query, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<AutocompleteResponse>(`properties/autocomplete?query=${query}`);
            return response.data?.data || [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ API');
        }
    }
);

// ✅ Fixed fetchSearchProperties
export const fetchSearchProperties = createAsyncThunk<
    { properties: Property[]; last_page: number },
    SearchParams,
    AsyncThunkConfig
>('properties/fetchSearchProperties', async (params, { rejectWithValue }) => {
    try {
        // const response = await apiClient.get<ApiResponse<Property[]>>('properties/search', { params });
        const response = await apiClient.get<ApiResponse<Property[]>>('properties/search?page=1&pagesize=10');
        // const properties = response.data?.data?.properties || [];

        const properties = response.data?.data?.properties || [];
        const mappedProperties = properties.map((property) => ({
            ...property,
            rating: parseFloat(property.rating.toFixed(1)),
            date: new Date(property.date).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
        }));

        return {
            properties: mappedProperties,
            last_page: response.data?.data?.last_page || 1,
        };
    } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ API');
    }
});

const autocompleteSlice = createSlice({
    name: 'autocomplete',
    initialState,
    reducers: {
        clearSuggestions: (state) => {
            state.suggestions = [];
            state.error = null;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchAutocomplete
            .addCase(fetchAutocomplete.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAutocomplete.fulfilled, (state, action: PayloadAction<string[]>) => {
                state.loading = false;
                state.suggestions = action.payload || [];
            })
            .addCase(fetchAutocomplete.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || 'An error occurred';
            })

            // Handle fetchSearchProperties
            .addCase(fetchSearchProperties.pending, (state) => {
                state.searchLoading = true;
                state.error = null;
            })
            .addCase(
                fetchSearchProperties.fulfilled,
                (state, action: PayloadAction<{ properties: Property[]; last_page: number }>) => {
                    state.searchLoading = false;
                    state.searchResults = action.payload.properties.map((property) => ({
                        ...property,
                        image_url: property.image_url || '',
                    }));
                    state.lastPage = action.payload.last_page;
                }
            )
            .addCase(fetchSearchProperties.rejected, (state, action) => {
                state.searchLoading = false;
                state.error = (action.payload as string) || 'An error occurred';
            });
    },
});

export const { clearSuggestions, clearSearchResults } = autocompleteSlice.actions;
export default autocompleteSlice.reducer;
