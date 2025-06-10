// apis/problemsAPI.js
import { toast } from 'react-hot-toast'
import { apiConnector } from '../apiConnector'
import { setLoading, setProblems,setPagination, setError } from '../../src/slices/ProblemSlice'

import  {problemEndpoints} from '../apis' // Your API endpoint


const {
  FETCH_PROBLEM_LIST_API,
  CREATE_PROBLEM_API,
  DELETE_PROBLEM_BASE_URL,
  UPDATE_PROBLEM_API
,FETCH_PROBLEM_BY_ID_API}  = problemEndpoints

export function fetchProblems(page = 1, limit = 10, filters = {}) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading problems...");
    dispatch(setLoading(true));
    
    try {
      const params = {
        page,
        limit,
        ...filters
      };


      // console.log("FETCH_PROBLEM_LIST_API",FETCH_PROBLEM_LIST_API)

      const response = await apiConnector("POST", FETCH_PROBLEM_LIST_API, null, null, { params });
      
      // console.log("FETCH PROBLEMS API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Transform the data
      const problems = response.data.data;

      // console.log("Problems",problems[0]);

      dispatch(setProblems(problems));
      dispatch(setPagination(response.data.pagination));
      // toast.success(`Loaded ${problems.length} problems`);
    } catch (error) {
      // console.log("FETCH PROBLEMS API ERROR............", error);
      dispatch(setError(error.response?.data?.message || error.message || "Failed to fetch problems"));
      toast.error(error.response?.data?.message || "Failed to load problems");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function fetchProblemById(problemId,token) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading problem details...");
    dispatch(setLoading(true));

    try {

      // console.log("Token found::",token)
      
      const response = await apiConnector(
        "GET",
        `${FETCH_PROBLEM_BY_ID_API}/${problemId}`,
        null,
        { Authorization: `Bearer ${token}`}, 
        null 
      );

      // console.log("FETCH PROBLEM BY ID API RESPONSE............", response);

      // if (!response.data.success) {
      //   throw new Error(response.data.message);
      // }

      const problem = response.data.data;
      dispatch(setProblems(problem)); // Assuming you have a setProblem action
      // toast.success("Problem loaded successfully");
    } catch (error) {
      // console.log("FETCH PROBLEM BY ID API ERROR............", error);
      dispatch(
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch problem details"
        )
      );
      toast.error(
        error.response?.data?.message || "Failed to load problem details"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function createProblem(problemData, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating problem...");
    dispatch(setLoading(true));
    
    try {
      // console.log("Problem Data:", problemData);

    

      const response = await apiConnector(
        "POST", 
        CREATE_PROBLEM_API, 
        problemData,  // This should be FormData when files are included
        { Authorization: `Bearer ${token}`},      // Authorization header
        null          // No URL params needed
      );

      // console.log("CREATE PROBLEM API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const createdProblem = response.data.data;

      toast.success("Problem created successfully!");
      // console.log("createdProblem", createdProblem.id);
      
      // Return the full response so caller can access status, headers, etc. if needed
      return createdProblem;
    } catch (error) {
      // console.log("CREATE PROBLEM API ERROR............", error);
      
      // Extract error message from different possible locations
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         "Failed to create problem";
      
      // dispatch(setError(errorMessage));
      toast.error(errorMessage);
      
      // Return error object with consistent structure
      return { 
        error: true,
        message: errorMessage,
        status: error.response?.status 
      };
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function updateProblem( problemId,problemData, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating problem...");
    dispatch(setLoading(true));
    
    try {
      // console.log("Problem Data:", problemData);

      

      const response = await apiConnector(
        "PUT", // or "PUT" depending on your API design
        UPDATE_PROBLEM_API.replace(":problemId", problemId), 
        problemData,
        { Authorization: `Bearer ${token}` },
        null
      );

      // console.log("UPDATE PROBLEM API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const updatedProblem = response.data.data;

      // toast.success("Problem updated successfully!");
      
      return updatedProblem;
    } catch (error) {
      // console.log("UPDATE PROBLEM API ERROR............", error);
      
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         "Failed to update problem";
      
      toast.error(errorMessage);
      
      return { 
        error: true,
        message: errorMessage,
        status: error.response?.status 
      };
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function deleteProblem(problemId,token) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting problem...");
    dispatch(setLoading(true));
    
    try {
            const endpoint = `${DELETE_PROBLEM_BASE_URL}/${problemId}/delete`;

            // console.log("Delete Endpoint",endpoint)

      const response = await apiConnector(
        "GET", 
        endpoint, 
        null, 
         { Authorization: `Bearer ${token}` }, 
       null
      );
      
      // console.log("DELETE PROBLEM API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      // Dispatch action to remove problem from state
      // dispatch(removeProblem(problemId));
      // toast.success("Problem deleted successfully");
      
      // Optionally refresh the problem list
      dispatch(fetchProblems());
      
      return response.data; // Return response for potential chaining
    } catch (error) {
      // console.log("DELETE PROBLEM API ERROR............", error);
      dispatch(setError(error.response?.data?.message || error.message || "Failed to delete problem"));
      toast.error(error.response?.data?.message || "Failed to delete problem");
      throw error; // Re-throw for component-level handling
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}