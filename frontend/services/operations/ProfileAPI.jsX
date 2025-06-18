import { setProgress } from "../../src/slices/LoadingBarSlice.jsx";
import { apiConnector } from "../apiConnector.jsx";
import { profileEndpoints } from "../apis.jsx";
import { toast } from "react-hot-toast";
import {settingsEndpoints} from "../apis.jsx"
import { logout } from "./AuthAPI.jsx";
import { setUser,setProfileLoading,setProfileStats,setCurrentStreak } from '../../src/slices/ProfileSlice.jsx'

import { createAsyncThunk } from '@reduxjs/toolkit';



// export const fetchProfileData = createAsyncThunk(
//   'profile/fetchProfileData',

//   async ({ userId, token }, { rejectWithValue,dispatch}) => {
//       try {
//       // console.log("APIURL::",`${profileEndpoints.GET_USER_DETAILS_API}/data/${userId}`)
//       const response = await apiConnector(
//         "GET",
//         `${profileEndpoints.GET_USER_DETAILS_API}/data/${userId}`,
//         null,
//         { 
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       );

//       if (!response.data) {
//         throw new Error("No profile data received");
//       }

//       console.log("Profile Response::",response.data)

//       // dispatch(setUser(response.data.user));
//       dispatch(setProfileStats(response.data.stats));
//       dispatch(setCurrentStreak(response.data.stats.streak))

//       // Transform data if needed
//       return {
//         user: response.data.user,
//         stats: {
//           ...response.data.stats,
//           problemsByDifficulty: response.data.stats.problemsByDifficulty || { easy: 0, medium: 0, hard: 0 },
//           languages: response.data.stats.languages || {},
//           solvedData: response.data.stats.solvedData || { labels: [], values: [] },
//           submissionData: response.data.stats.submissionData || [],
//           recentActivities: response.data.stats.recentActivities || [],
//           streak: response.data.stats.streak || 0
//         }
//       };
//     } catch (error) {
//       console.error("PROFILE DATA LOADING ERROR:", error);
//       const errorMessage = error.response?.data?.message || 
//                          error.message || 
//                          "Failed to load profile data";
//       toast.error(errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

export const fetchProfileData = async ({ userId, token }) => {
  try {
    const response = await apiConnector(
      "GET",
      `${profileEndpoints.GET_USER_DETAILS_API}/data/${userId}`,
      null,
      { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    );

    if (!response.data) {
      throw new Error("No profile data received");
    }

    // console.log("Profile Response::", response.data);

    // Transform data and return it directly
    return {
      user: response.data.user,
      stats: {
        ...response.data.stats,
        problemsByDifficulty: response.data.stats.problemsByDifficulty || { easy: 0, medium: 0, hard: 0 },
        languages: response.data.stats.languages || {},
        solvedData: response.data.stats.solvedData || { labels: [], values: [] },
        submissionData: response.data.stats.submissionData || [],
        recentActivities: response.data.stats.recentActivities || [],
        streak: response.data.stats.streak || 0,
        // Add any other default values needed for your stats
        totalProblemsSolved: response.data.stats.totalProblemsSolved || 0,
        accuracy: response.data.stats.accuracy || 0,
        rank: response.data.stats.rank || 0,
        activeDaysInWeek: response.data.stats.activeDaysInWeek || 0,
        totalProblemsInDB: response.data.stats.totalProblemsInDB || 0
      },
      currentStreak: response.data.stats.streak || 0
    };
  } catch (error) {
    // console.error("PROFILE DATA LOADING ERROR:", error);
    const errorMessage = error.response?.data?.message || 
                       error.message || 
                       "Failed to load profile data";
    toast.error(errorMessage);
    throw error; // Throw the error to be handled by the calling component
  }
};

export const fetchStats = createAsyncThunk(
  'profile/stats',

  async (dispatch) => {
      try {
      // console.log("APIURL::",`${profileEndpoints.GET_USER_DETAILS_API}/data/${userId}`)
      const response = await apiConnector(
        "GET",
        `${profileEndpoints.PROFILE_BASE_API}/stats`,
        null,
       null
      );

      // if (!response.data) {
      //   throw new Error("No profile data received");
      // }

      // console.log("Profile Response::",response.data)

      // dispatch(setTotalUsers(response.data.))

    

      // Transform data if needed

      return response.data;
     
    } catch (error) {
      // console.error(" DATA LOADING ERROR:", error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Failed to load  data";
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);



//updateProfilePicture


// export const fetchStats = async ({ token }) => {
//   try {
//     const response = await apiConnector(
//       "GET",
//       `${profileEndpoints.PROFILE_BASE_API}/stats`,
//       null,
//      null
//     );

//     if (!response.data) {
//       throw new Error("No stats data received");
//     }

//     // console.log("Stats Response::", response.data);

//     // Transform data and return with defaults
//     return response.data;
    
//   } catch (error) {
//     // console.error("STATS DATA LOADING ERROR:", error);
//     const errorMessage = error.response?.data?.message || 
//                        error.message || 
//                        "Failed to load stats data";
//     toast.error(errorMessage);
//     throw error; // Throw to be handled by the caller
//   }
// };



export const updateProfilePicture = async ({token, file}) => {
  const toastId = toast.loading("Uploading...");
  
  try {
    // console.log("PFP",token)
    const formData = new FormData();
    formData.append('displayPicture', file);

    const response = await apiConnector(
      "PUT", 
      settingsEndpoints.UPDATE_DISPLAY_PICTURE_API, 
      formData, 
      {
        Authorization: `Bearer ${token}`,
      }
    );

   


    const imageUrl = response.data.image;
    
    // Update localStorage with new image URL
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      userData.image = imageUrl;
      localStorage.setItem("user", JSON.stringify(userData));
    }

    return { success: true, imageUrl };

  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                       "An error occurred while updating the profile picture";
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    toast.dismiss(toastId);
  }
};

// //updateAdditionalDetails
// export async function updateAdditionalDetails(token,additionalDetails){
//   // console.log("additionalDetails",additionalDetails);
//   const {firstName,lastName,dateOfBirth,gender,contactNumber,about}=additionalDetails;
//   // console.log("additionalDetails",additionalDetails);
//   const toastId = toast.loading("Updating...");
//   try {
//     const response = await apiConnector("PUT", settingsEndpoints.UPDATE_PROFILE_API,{firstName,lastName,dateOfBirth,gender,contactNumber,about},{
//       Authorisation: `Bearer ${token}`,
//     });
//     // console.log("UPDATE_ADDITIONAL_DETAILS_API API RESPONSE............", response)
//     if (!response.data.success) {
//       throw new Error(response.data.message)
//     }
//     toast.success("Additional Details Updated Successfully");
//     const user = JSON.parse(localStorage.getItem("user"));
//     user.firstName = firstName || user.firstName;
//     user.lastName = lastName || user.lastName;
//     user.additionalDetails.dateOfBirth = dateOfBirth  || user.additionalDetails.dateOfBirth;
//     user.additionalDetails.contactNumber = contactNumber || user.additionalDetails.contactNumber;
//     user.additionalDetails.about = about || user.additionalDetails.about;
//     user.additionalDetails.gender=gender
//     localStorage.setItem("user",JSON.stringify(user));

//   } catch (error) {
//     // console.log("UPDATE_ADDITIONAL_DETAILS_API API ERROR............", error)
//     toast.error(error.response.data.message)
//   }
//   toast.dismiss(toastId);
// }

// //updatePassword
// export async function updatePassword(token,password){
//   const { oldPassword, newPassword, confirmPassword:confirmNewPassword }=password;
//   // console.log("password",password);
//   const toastId = toast.loading("Updating...");
//   try {
//    const response = await apiConnector("POST", settingsEndpoints.CHANGE_PASSWORD_API,{oldPassword, newPassword, confirmNewPassword},{
//       Authorisation: `Bearer ${token}`,
//     });
//     // console.log("UPDATE_PASSWORD_API API RESPONSE............", response)
//     if (!response.data.success) {
//       throw new Error(response.data.message)
//     }
//     toast.success("Password Updated Successfully");
//   }
//   catch (error) {
//     // console.log("UPDATE_PASSWORD_API API ERROR............", error)
//     toast.error(error.response.data.message)
//   }
//   toast.dismiss(toastId);
// }

// //deleteAccount
// export async function deleteAccount(token,dispatch,navigate){
//   const toastId = toast.loading("Deleting...");
//   try {
//     const response = await apiConnector("DELETE", settingsEndpoints.DELETE_PROFILE_API,null,{
//       Authorisation: `Bearer ${token}`,
//     });
//     // console.log("DELETE_ACCOUNT_API API RESPONSE............", response)
//     if (!response.data.success) {
//       throw new Error(response.data.message)
//     }
//     toast.success("Account Deleted Successfully");
//     dispatch(logout(navigate))
//   }
//   catch (error) {
//     // console.log("DELETE_ACCOUNT_API API ERROR............", error)
//     toast.error(error.response.data.message)
//   }
//   toast.dismiss(toastId);
// }

