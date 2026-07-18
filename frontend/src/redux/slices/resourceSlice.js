import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from "../../utils/api"; // Aapka axios configuration

// 🚀 Async Thunk 1: Backend se saare resources lane ke liye
export const fetchAllResources = createAsyncThunk(
  'resources/fetchAll',
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token || state.auth.user?.token; 

      const response = await API.get('/resources', {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Kuch gadbad hui fetch karne mein");
    }
  }
);

// 🚀 Async Thunk 2: Resource delete karne ke liye
export const deleteResource = createAsyncThunk(
  'resources/delete',
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token || state.auth.user?.token;

      await API.delete(`/resources/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return id; // Delete hone ke baad wahi ID wapas return kar rahe hain
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Delete fail ho gaya");
    }
  }
);

// 🌟 Redux Slice Setup
const resourceSlice = createSlice({
  name: 'resources',
  initialState: {
    resources: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ⬇️ FETCH RESOURCES CASES ⬇️
      .addCase(fetchAllResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload; 
      })
      .addCase(fetchAllResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // ⬇️ DELETE RESOURCE CASES (Naya Code Yahan Hai) ⬇️
      .addCase(deleteResource.fulfilled, (state, action) => {
        // action.payload mein ID aayegi, usko frontend ke array se hata do
        state.resources = state.resources.filter((res) => res._id !== action.payload);
      })
      .addCase(deleteResource.rejected, (state, action) => {
        console.error("Delete failed:", action.payload);
        state.error = action.payload;
      });
  },
});

export default resourceSlice.reducer;