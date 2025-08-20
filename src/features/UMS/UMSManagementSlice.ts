// features/umsManagement/umsManagementSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UMS } from '../../interfaces/types';
import api from '../../config/axios';
import { ApiResponse } from '../../types/department.types';

interface UMSManagementState {
  umsList: UMS[];
  loading: boolean;
  error: string | null;
  currentUMS: UMS | null;
}

const initialState: UMSManagementState = {
  umsList: [],
  loading: false,
  error: null,
  currentUMS: null,
};

// Async Thunks
export const fetchAllUMS = createAsyncThunk('ums/fetchAll', async () => {
  const response = await api.get<ApiResponse<UMS[]>>('/ums');
  return response.data.data;
});


export const createUMS = createAsyncThunk('ums/create', async (newUMS: Omit<UMS, 'id'>) => {
  const response = await api.post<ApiResponse<UMS>>('/ums', newUMS);
  return response.data.data;
});

export const updateUMS = createAsyncThunk('ums/update', async ({ id, data }: { id: string; data: Partial<UMS> }) => {
  const response = await api.patch<ApiResponse<UMS>>(`/ums/${id}`, data);
  return response.data.data;
});

export const deleteUMS = createAsyncThunk('ums/delete', async (id: string) => {
  await api.delete(`/ums/${id}`);
  return id;
});

export const fetchUMSById = createAsyncThunk(
  'ums/fetchById',
  async (id: string) => {
    const response = await api.get<ApiResponse<UMS>>(`/ums/${id}`);
    return response.data.data;
  }
);


const umsManagementSlice = createSlice({
  name: 'umsManagement',
  initialState,
  reducers: {
    setCurrentUMS: (state, action: PayloadAction<UMS | null>) => {
      state.currentUMS = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchAllUMS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUMS.fulfilled, (state, action) => {
        state.loading = false;
        state.umsList = action.payload;
      })
      .addCase(fetchAllUMS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch UMS instances';
      })

      // Create
      .addCase(createUMS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUMS.fulfilled, (state, action) => {
        state.loading = false;
        state.umsList.push(action.payload);
      })
      .addCase(createUMS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create UMS';
      })

      // Update
      .addCase(updateUMS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUMS.fulfilled, (state, action) => {
        state.loading = false;
        state.umsList = state.umsList.map(ums =>
          ums.id === action.payload.id ? action.payload : ums
        );
        if (state.currentUMS?.id === action.payload.id) {
          state.currentUMS = action.payload;
        }
      })
      .addCase(updateUMS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update UMS';
      })

      // Delete
      .addCase(deleteUMS.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUMS.fulfilled, (state, action) => {
        state.loading = false;
        state.umsList = state.umsList.filter(ums => ums.id !== action.payload);
        if (state.currentUMS?.id === action.payload) {
          state.currentUMS = null;
        }
      })
      .addCase(deleteUMS.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete UMS';
      })

      // Fetch by ID
    .addCase(fetchUMSById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
    .addCase(fetchUMSById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUMS = action.payload;
    })
    .addCase(fetchUMSById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch UMS by ID';
    })

},
});

export const { setCurrentUMS, clearError } = umsManagementSlice.actions;
export default umsManagementSlice.reducer;