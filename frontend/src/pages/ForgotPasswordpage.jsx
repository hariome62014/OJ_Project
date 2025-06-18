import React from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../../services/operations/AuthAPI'
import { useDispatch } from 'react-redux'

const ForgotPassword = () => {
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.auth)
    const darkMode = useSelector((state) => state.theme.darkMode)
    
    const [emailSent, setEmailSent] = useState(false)
    const [email, setEmail] = useState("")

    const handleOnSubmit = (e) => {
        e.preventDefault()
        dispatch(forgotPassword(email, setEmailSent))
    }

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`w-full max-w-md rounded-lg p-8 ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800 shadow-md'}`}>
                <div className='text-center mb-6'>
                    <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {emailSent ? "Check your email" : "Forgot your password?"}
                    </h1>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {emailSent 
                            ? `We've sent reset instructions to ${email}`
                            : "Enter your email to receive password reset instructions"}
                    </p>
                </div>

                {!emailSent && (
                    <form onSubmit={handleOnSubmit} className='space-y-4'>
                        <div className='space-y-2'>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email address
                            </label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-3 py-2 text-sm rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-300 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'}`}
                                placeholder='Enter your email'
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className={`w-full py-2 px-4 rounded-md text-sm font-medium ${darkMode ? 'bg-yellow-400 text-gray-100' : 'bg-yellow-500 text-gray-100'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer`}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>
                )}

                <div className='mt-4 text-center text-sm'>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        Remember your password?{' '}
                        <Link 
                            to="/login" 
                            className={`font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`}
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword