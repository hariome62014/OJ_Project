// submissionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  submissions: [],
};

const submissionSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    setSubmissionLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSubmissionError: (state, action) => {
      state.error = action.payload;
    },
    addSubmission: (state, action) => {
      state.submissions.unshift(action.payload);
    },
  },
});

export const { setSubmissionLoading, setSubmissionError, addSubmission } = submissionSlice.actions;
export default submissionSlice.reducer;