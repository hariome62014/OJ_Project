// submission.js (in your actions folder)
import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { setSubmissionLoading, setSubmissionError, addSubmission } from '../../src/slices/SubmissionSlice';

import  {submissionEndpoint} from '../apis'

const {SUBMIT_SOLUTION_BASE_URL} = submissionEndpoint;



export function submitSolution({ problemId, code, language,token,Sub_type }) {
  return async (dispatch) => {
    // const toastId = toast.loading("Submitting your solution...");
    dispatch(setSubmissionLoading(true));

    try {
      console.log("SUBMIT_SOLUTION_API",`${SUBMIT_SOLUTION_BASE_URL}/${problemId}/submission/submit`)
      const response = await apiConnector(
        "POST",
        `${SUBMIT_SOLUTION_BASE_URL}/${problemId}/submission/submit`,
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
      console.error("SUBMIT SOLUTION ERROR:", error);
      const errorMessage = error.response?.data?.message || error.message || "Submission failed";
      dispatch(setSubmissionError(errorMessage));
      toast.error(errorMessage, { id: toastId });
      throw error; // Re-throw for component-level handling
    } 
    // finally {
      dispatch(setSubmissionLoading(false));
    // }
  };
}