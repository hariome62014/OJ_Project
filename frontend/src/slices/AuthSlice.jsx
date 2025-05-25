import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
    signupData: null,
    loading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setSignupData(state, value) {
            state.signupData = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
        setToken(state, value) {
            state.token = value.payload;
            // Store token in localStorage when set
            if (value.payload) {
                localStorage.setItem("token", JSON.stringify(value.payload));
            }
        },
        // Add logout reducer
        logout(state) {
            state.token = null;
            state.signupData = null;
            // Remove token from localStorage
            localStorage.removeItem("token");
            // You might want to clear other auth-related data here
        }
    }
});

export const { setToken, setLoading, setSignupData, logout } = authSlice.actions;
export default authSlice.reducer;