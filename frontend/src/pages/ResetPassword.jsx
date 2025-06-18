import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { resetPassword } from '../../services/operations/AuthAPI'
import { useDispatch } from 'react-redux'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

const ResetPassword = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const token = location.pathname.split("/").at(-1);
    const darkMode = useSelector((state) => state.theme.darkMode)

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (formData.password === formData.confirmPassword) {
            dispatch(resetPassword(formData.password, formData.confirmPassword,token,setresetComplete));
        }
        else {
            alert("Passwords do not match")
        }
    }

    const handleOnChange = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const [formData, setformData] = useState({
        password: "",
        confirmPassword: "",
    })
    const {loading} = useSelector((state)=>state.auth)
    const [resetComplete, setresetComplete] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`w-full max-w-md rounded-lg p-8 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800 shadow-md'}`}>
                <div className='text-center mb-6'>
                    <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {!resetComplete ? "Choose new password" : "Reset complete!"}
                    </h1>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {!resetComplete 
                            ? "Almost done. Enter your new password and you're all set."
                            : "All done! Your password has been reset successfully."}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="custom-loader"></div>
                    </div>
                ) : (
                    <form onSubmit={handleOnSubmit} className='space-y-4'>
                        {!resetComplete && (
                            <>
                                <div className='space-y-2'>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        New Password <span className="text-pink-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            required
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleOnChange}
                                            placeholder="Enter new password"
                                            className={`w-full px-3 py-2 text-sm rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'}`}
                                        />
                                        <span
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-2.5 cursor-pointer"
                                        >
                                            {showPassword ? (
                                                <AiOutlineEyeInvisible fontSize={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                            ) : (
                                                <AiOutlineEye fontSize={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Confirm New Password <span className="text-pink-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            required
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleOnChange}
                                            placeholder="Confirm new password"
                                            className={`w-full px-3 py-2 text-sm rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'}`}
                                        />
                                        <span
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="absolute right-3 top-2.5 cursor-pointer"
                                        >
                                            {showConfirmPassword ? (
                                                <AiOutlineEyeInvisible fontSize={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                            ) : (
                                                <AiOutlineEye fontSize={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                {!resetComplete &&
                        <button
                            type='submit'
                            className={`w-full py-2 px-4 rounded-md text-sm font-medium ${darkMode ? 'bg-yellow-400 text-gray-100' : 'bg-yellow-500 text-gray-100'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer`}
                        >
                           Reset Password
                        </button>
}
                    </form>
                )}

                <div className='mt-4 text-center text-sm'>
                    <Link 
                        to="/login" 
                        className={`flex items-center justify-center gap-x-1 font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`}
                    >
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z"></path>
                        </svg>
                        Back To Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword