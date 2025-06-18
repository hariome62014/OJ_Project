const BASE_URL = import.meta.env.VITE_API_URL;
const COMPILER_BASE_API_URL = import.meta.env.VITE_COMPILER_API_URL;

  // console.log("COMPILER_BASE_API_URL",COMPILER_BASE_API_URL);


// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  USERNAME_API:BASE_URL  + "/auth/check-username"
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  PROFILE_BASE_API:BASE_URL + "/profile"
};

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
};

export const problemEndpoints = {
  
  CREATE_PROBLEM_API : BASE_URL+ "/problems/create-problem",
  FETCH_PROBLEM_LIST_API: BASE_URL + "/problems/problem-list",
  UPDATE_PROBLEM_API:BASE_URL + "/problems/:problemId/update",
  DELETE_PROBLEM_BASE_URL : BASE_URL+'/problems',
  FETCH_PROBLEM_BY_ID_API:BASE_URL+'/problems'
}

export const testCasesEndpoint = {

  ADD_TESTCASES_BASE_URL : BASE_URL +"/problems"
}

export const submissionEndpoint = {
  SUBMIT_SOLUTION_BASE_URL:BASE_URL + '/problems',
  COMPILER_BASE_URL : COMPILER_BASE_API_URL + '/problems'
}