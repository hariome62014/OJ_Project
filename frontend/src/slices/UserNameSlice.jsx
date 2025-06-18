// features/username/usernameSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "",
  isUnique: null,    // true, false, or null
  checking: false,
  error: null,
};

const usernameSlice = createSlice({
  name: "username",
  initialState,
  reducers: {
    setUsername(state, action) {
      state.value = action.payload;
      state.isUnique = null;   // Reset uniqueness when username changes
      state.error = null;
    },
    setUsernameChecking(state, action) {
      state.checking = action.payload;
    },
    setUsernameUnique(state, action) {
      state.isUnique = action.payload;
      state.checking = false;
      state.error = null;
    },
    setUsernameError(state, action) {
      state.error = action.payload;
      state.checking = false;
      state.isUnique = null;
    },
    resetUsernameState(state) {
      state.value = "";
      state.isUnique = null;
      state.checking = false;
      state.error = null;
    }
  }
});

export const {
  setUsername,
  setUsernameChecking,
  setUsernameUnique,
  setUsernameError,
  resetUsernameState
} = usernameSlice.actions;

export default usernameSlice.reducer;
