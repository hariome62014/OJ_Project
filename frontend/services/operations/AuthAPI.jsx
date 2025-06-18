import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../src/slices/AuthSlice"
import { setUser } from "../../src/slices/ProfileSlice"
import { endpoints } from "../apis"
import {apiConnector} from "../apiConnector"
import {setProgress} from "../../src/slices/LoadingBarSlice"
import {
  setUsername,
  setUsernameChecking,
  setUsernameUnique,
  setUsernameError
} from "../../src/slices/UserNameSlice";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
  USERNAME_API
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    // console.log("Reached SendOtp API")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      dispatch(setProgress(100));
      // console.log("SENDOTP API RESPONSE............", response)

      // console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-otp")
    } catch (error) {
      // console.log("SENDOTP API ERROR............", error)
        toast.error(error.response.data.message || "OTO sent Failed")
      dispatch(setProgress(100));
    }
    dispatch(setLoading(false))
    // toast.dismiss(toastId)
  }
}

export function signUp(
  
  username,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        
        username,
        email,
        password,
        confirmPassword,
        otp,
      })

      // console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      dispatch(setProgress(100));
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      dispatch(setProgress(100));
      // console.log("SIGNUP API ERROR............", error)
        toast.error(error.response.data.message || "Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    // console.log("LOGIN_API",LOGIN_API)
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      // console.log("LOGIN API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      dispatch(setProgress(100))
      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.username}`
        // console.log("Image",userImage);
        // console.log("response.data.user",response.data.user);
      dispatch(setUser( response.data.user))
      localStorage.setItem("user", JSON.stringify(response.data.user))
      localStorage.setItem("token", JSON.stringify(response.data.token))
     {response.data.user.role==='admin'?navigate('/admin-profile'):(navigate("/profile"))} 
    } catch (error) {
      dispatch(setProgress(100))
      // console.log("LOGIN API ERROR............", error.response)
       toast.error(error.response.data.message || "Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      })

      // console.log("RESETPASSTOKEN RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Reset Email Sent")
      setEmailSent(true)
    } catch (error) {
      // console.log("RESETPASSTOKEN ERROR............", error)
      toast.error("Failed To Send Reset Email")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export function resetPassword(password, confirmPassword, token,setresetComplete) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      // console.log("RESETPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password Reset Successfully")
      setresetComplete(true)
    } catch (error) {
      // console.log("RESETPASSWORD ERROR............", error)
      toast.error("Failed To Reset Password")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    
  }
}


export function forgotPassword(email,setEmailSent) {
  return async (dispatch) => {
    // const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      })

      // console.log("FORGOTPASSWORD RESPONSE............", response)

      if (!response.data.success) {
        toast.error(response.data.message)
        throw new Error(response.data.message)
      }

      toast.success("Reset Email Sent");
      setEmailSent(true)
    } catch (error) {
      toast.error(error)
      // console.log("FORGOTPASSWORD ERROR............", error)
    }
    // toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}


export function checkUsernameUnique(value, setIsUnique) {
  // console.log("Username:",value)
  const username = value;
  return async (dispatch) => {
    dispatch(setUsernameChecking(true));
    try {
      const { data } =  await apiConnector("POST", USERNAME_API, 
        {username},null,null
      )
      dispatch(setUsernameUnique(data.unique));
              if (setIsUnique) setIsUnique(data.unique); // Optionally update local state

      return data;
    } catch (error) {
      dispatch(setUsernameError(error.message || 'Error checking username'));
      if (setIsUnique) setIsUnique(false);
    }
    dispatch(setUsernameChecking(false));
  };
}

