import { toast } from 'react-hot-toast';
import { apiConnector } from '../apiConnector';
import { setLoading } from '../../src/slices/ProblemSlice';
import { testCasesEndpoint } from '../apis';

const { ADD_TESTCASES_BASE_URL } = testCasesEndpoint;

export function addManualTestCase(problemId, testCaseData, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Adding test case...");
    dispatch(setLoading(true));
    
    try {
      const endpoint = `${ADD_TESTCASES_BASE_URL}/${problemId}/test-cases/create`;
      
      const response = await apiConnector(
        "POST", 
        endpoint,
        testCaseData,
        { 
          Authorization: `Bearer ${token}`
        },
        null
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Test case added successfully!");
      return response.data.data;
    } catch (error) {
      console.error("ADD TEST CASE ERROR:", error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Failed to add test case";
      
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

export function updateManualTestCase(problemId, testCaseId, updatedData, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating test case...");
    dispatch(setLoading(true));
    
    try {
      const endpoint = `${ADD_TESTCASES_BASE_URL}/${problemId}/test-cases/${testCaseId}`;
      
      const response = await apiConnector(
        "PUT", // Using PUT for updates (could also use PATCH)
        endpoint,
        updatedData,
        { 
          Authorization: `Bearer ${token}`
        },
        null
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Test case updated successfully!");
      return response.data.data;
    } catch (error) {
      console.error("UPDATE TEST CASE ERROR:", error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Failed to update test case";
      
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

export function uploadTestCaseZip(problemId, zipFile, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Uploading test cases...");
    dispatch(setLoading(true));
    
    try {
      const formData = new FormData();
      formData.append('file', zipFile);  // Must match the 'file' field expected by multer
      
      const endpoint = `${ADD_TESTCASES_BASE_URL}/${problemId}/test-cases/upload`;
      
      const response = await apiConnector(
        "POST", 
        endpoint,
        formData,  // Send the FormData object
        { 
          Authorization: `Bearer ${token}`,
          // Let the browser set Content-Type with boundary automatically
        },
        null,
        true  // Indicate this is a file upload to handle progress if needed
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Test cases uploaded successfully!");
      return response.data;
    } catch (error) {
      console.error("UPLOAD TEST CASE ERROR:", error);
      let errorMessage = "Failed to upload test cases";
      
      if (error.response) {
        // Handle backend validation errors
        if (error.response.data?.error?.includes('ZIP file is required')) {
          errorMessage = "No file selected";
        } else if (error.response.data?.error?.includes('.zip files are allowed')) {
          errorMessage = "Only .zip files are allowed";
        } else if (error.response.data?.error?.includes('file size')) {
          errorMessage = "File too large (max 10MB)";
        } else if (error.response.data?.error?.includes('No valid test case pairs')) {
          errorMessage = "Invalid ZIP structure. Need input/output files in /in/ and /out/ folders";
        } else {
          errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
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

export function deleteAllTestCases(problemId, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting all test cases...");
    dispatch(setLoading(true));
    
    try {
      const endpoint = `${ADD_TESTCASES_BASE_URL}/${problemId}/test-cases/delete-all-testcases`;
      
      const response = await apiConnector(
        "GET", // Using DELETE method
        endpoint,
        null, // No body needed for delete-all
        { 
          Authorization: `Bearer ${token}`
        },
        null
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("All test cases deleted successfully!");
      return response.data.data;
    } catch (error) {
      console.error("DELETE ALL TEST CASES ERROR:", error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Failed to delete all test cases";
      
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