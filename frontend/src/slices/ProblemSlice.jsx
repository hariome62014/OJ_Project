import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  problem: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  },
  filters: {
    difficulty: '',
    search: ''
  }
};

const problemSlice = createSlice({
  name: 'problem',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProblems: (state, action) => {
      state.problem = action.payload;
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const { 
  setLoading, 
  setProblems, 
  setPagination, 
  setError,
  setPage,
  setFilters,
  resetFilters
} = problemSlice.actions;

export default problemSlice.reducer;