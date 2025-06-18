import { createSlice } from "@reduxjs/toolkit";
import { fetchProfileData, fetchStats } from "../../services/operations/ProfileAPI";

const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    stats: null,
    loading: false,
    error: null,
    currentStreak: 0,
    totalSubmissions: 0,
    totalProblems: 0,
    totalUsers: 0
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        setProfileLoading: (state, action) => {
            state.loading = action.payload;
        },
        setProfileError: (state, action) => {
            state.error = action.payload;
        },
        setProfileStats: (state, action) => {
            state.stats = action.payload;
            // Update individual stats if they exist in the payload
            if (action.payload.totalSubmissions !== undefined) {
                state.totalSubmissions = action.payload.totalSubmissions;
            }
            if (action.payload.totalProblems !== undefined) {
                state.totalProblems = action.payload.totalProblems;
            }
            if (action.payload.totalUsers !== undefined) {
                state.totalUsers = action.payload.totalUsers;
            }
        },
        setCurrentStreak: (state, action) => {
            state.currentStreak = action.payload;
        },
        setTotalSubmissions: (state, action) => {
            state.totalSubmissions = action.payload;
        },
        setTotalProblems: (state, action) => {
            state.totalProblems = action.payload;
        },
        setTotalUsers: (state, action) => {
            state.totalUsers = action.payload;
        },
        resetProfile: (state) => {
            state.user = null;
            state.stats = null;
            state.loading = false;
            state.error = null;
            state.currentStreak = 0;
            state.totalSubmissions = 0;
            state.totalProblems = 0;
            state.totalUsers = 0;
            localStorage.removeItem("user");
        },
        updateUserProfile: (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                localStorage.setItem("user", JSON.stringify(state.user));
            }
        }
    },
    // extraReducers: (builder) => {
    //     builder
    //         // Handle fetchProfileData
    //         .addCase(fetchProfileData.pending, (state) => {
    //             state.loading = true;
    //             state.error = null;
    //         })
    //         .addCase(fetchProfileData.fulfilled, (state, action) => {
    //             state.loading = false;
    //             state.user = action.payload.user;
    //             state.stats = action.payload.stats;
    //             state.currentStreak = action.payload.stats?.streak || 0;
    //             // Update the stats counts if they exist
    //             if (action.payload.stats) {
    //                 state.totalSubmissions = action.payload.stats.totalSubmissions || 0;
    //                 state.totalProblems = action.payload.stats.totalProblems || 0;
    //                 state.totalUsers = action.payload.stats.totalUsers || 0;
    //             }
    //             localStorage.setItem("user", JSON.stringify(action.payload.user));
    //         })
    //         .addCase(fetchProfileData.rejected, (state, action) => {
    //             state.loading = false;
    //             state.error = action.payload;
    //         })
            
    //         // Handle fetchStats
    //         .addCase(fetchStats.pending, (state) => {
    //             state.loading = true;
    //             state.error = null;
    //         })
    //         .addCase(fetchStats.fulfilled, (state, action) => {
    //             state.loading = false;
    //             state.totalSubmissions = action.payload.totalSubmissions || 0;
    //             state.totalProblems = action.payload.totalProblems || 0;
    //             state.totalUsers = action.payload.totalUsers || 0;
    //             // Also update the stats object if it exists
    //             if (state.stats) {
    //                 state.stats.totalSubmissions = action.payload.totalSubmissions || 0;
    //                 state.stats.totalProblems = action.payload.totalProblems || 0;
    //                 state.stats.totalUsers = action.payload.totalUsers || 0;
    //             }
    //         })
    //         .addCase(fetchStats.rejected, (state, action) => {
    //             state.loading = false;
    //             state.error = action.payload;
    //         });
    // }
});

export const {
    setUser,
    setProfileLoading,
    setProfileError,
    setProfileStats,
    setCurrentStreak,
    setTotalSubmissions,
    setTotalProblems,
    setTotalUsers,
    resetProfile,
    updateUserProfile
} = profileSlice.actions;

export default profileSlice.reducer;