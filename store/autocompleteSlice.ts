import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/src/api/axios';
import { AsyncThunkConfig } from './store';
import { Property } from './propertySlice';

interface ApiResponse<T> {
    status_code: number;
    message: string;
    data?: T;
}

interface AutocompleteState {
	suggestions: string[];
	searchResults: Property[];
	loading: boolean;
	searchLoading: boolean;
	error: string | null;
  }
  
  // Initial state
  const initialState: AutocompleteState = {
	suggestions: [],
	searchResults: [],
	loading: false,
	searchLoading: false,
	error: null,
  };

interface SearchParams {
	name?: string;
	minprice?: number;
	maxprice?: number;
	minsize?: number;
	maxsize?: number;
	sortby?: string;
	order?: "asc" | "desc";
	page?: number;
	pagesize?: number;
  }

export const fetchAutocomplete = createAsyncThunk<ApiResponse<string[]>, string, AsyncThunkConfig>(
	'autocomplete/fetchAutocomplete',
	async (query, { rejectWithValue }) => {
		try {
			const response = await apiClient.get<ApiResponse<string[]>>(`properties/autocomplete?query=${query}`);
			return response.data;
		} catch (error: any) {
			return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ API');
		}
	}
);

// Fetch search properties
export const fetchSearchProperties = createAsyncThunk<
  ApiResponse<Property[]>, 
  SearchParams, 
  AsyncThunkConfig
>(
  'properties/fetchSearchProperties',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<ApiResponse<Property[]>>('properties/search', { params });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ API');
    }
  }
);

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
		.addCase(fetchAutocomplete.fulfilled, (state, action: PayloadAction<ApiResponse<string[]>>) => {
		  state.loading = false;
		  state.suggestions = action.payload.data || [];
		})
		.addCase(fetchAutocomplete.rejected, (state, action) => {
		  state.loading = false;
		  state.error = action.payload as string || 'An error occurred';
		})
  
		// Handle fetchSearchProperties
		.addCase(fetchSearchProperties.pending, (state) => {
		  state.searchLoading = true;
		  state.error = null;
		})
		.addCase(fetchSearchProperties.fulfilled, (state, action: PayloadAction<ApiResponse<Property[]>>) => {
		  state.searchLoading = false;
		  state.searchResults = action.payload.data || [];
		})
		.addCase(fetchSearchProperties.rejected, (state, action) => {
		  state.searchLoading = false;
		  state.error = action.payload as string || 'An error occurred';
		});
	},
  });

  export const { clearSuggestions, clearSearchResults } = autocompleteSlice.actions;
  export default autocompleteSlice.reducer;
