// submission.js (in your actions folder)
import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { setSubmissionLoading, setSubmissionError, addSubmission } from '../../src/slices/SubmissionSlice';

import  {submissionEndpoint} from '../apis'

const {SUBMIT_SOLUTION_BASE_URL,COMPILER_BASE_URL} = submissionEndpoint;



export function submitSolution({ problemId, code, language,token,Sub_type }) {
  return async (dispatch) => {
    // const toastId = toast.loading("Submitting your solution...");
    dispatch(setSubmissionLoading(true));

    try {
      console.log("SUBMIT_SOLUTION_API",token)
      const response = await apiConnector(
        "POST",
        `${COMPILER_BASE_URL}/${problemId}/submission/submit`,
        { problemId, code, language,Sub_type },
        { Authorization: `Bearer ${token}`}, 
        null
      );

      console.log("SUBMIT SOLUTION API RESPONSE:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(addSubmission(response.data));
      // toast.success("Solution submitted successfully!");
      return response.data; // Optional: Return for immediate use
    } catch (error) {
      // console.error("SUBMIT SOLUTION ERROR:", error);
      const errorMessage = error.response?.data?.message || error.message || "Submission failed";
      dispatch(setSubmissionError(errorMessage));
      toast.error(errorMessage);
      throw error; // Re-throw for component-level handling
    } 
    // finally {
      dispatch(setSubmissionLoading(false));
    // }
  };
}



export function fetchUserSubmissions({ problemId,userId,token }) {
  return async (dispatch) => {
    // const toastId = toast.loading("Submitting your solution...");
    

    try {
      console.log("User Submission history :",`${SUBMIT_SOLUTION_BASE_URL}/${problemId}/submission/user/${userId}`)
      const response = await apiConnector(
        "POST",
        `${SUBMIT_SOLUTION_BASE_URL}/${problemId}/submission/user/${userId}`,
         {problemId} ,
        // null,
        { Authorization: `Bearer ${token}`}, 
        null
      );

      // console.log("SUBMISSION HISTORY RESPONSE:", response.data);

      if (!response.data) {
        throw new Error(response.data.message);
      }

      return response.data; 
    } catch (error) {
      // console.error("SUBMISSION HISTORY LOADING FAILED ERROR :", error);
      const errorMessage = error.response?.data?.message || error.message || "Submission history loading failed";
      dispatch(setSubmissionError(errorMessage));
      toast.error(errorMessage);
      throw error; // Re-throw for component-level handling
    } 
   
  };
}

export function ReviewCode(code, problemDescription,language) {
  return async (dispatch) => {
    const toastId = toast.loading("Analyzing your code...");
    // dispatch(setAnalysisLoading(true));
    // dispatch(clearAnalysisError());

    try {
      // console.log("ProblemDescription:::",language)
      const response = await apiConnector(
        "POST",
         SUBMIT_SOLUTION_BASE_URL+'/analyze/code',
        { code, problemDescription, language },
        null,
        null
      );

    
      toast.success("Code analysis complete!", { id: toastId });
      return response.data.review; // Return for immediate use if needed
    } catch (error) {
      console.error("CODE ANALYSIS ERROR:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          "Code analysis failed";
      
      // dispatch(setAnalysisError(errorMessage));
      toast.error(errorMessage, { id: toastId });
      throw error; // Re-throw for component-level handling
    } finally {
      // dispatch(setAnalysisLoading(false));
    }
  };
}