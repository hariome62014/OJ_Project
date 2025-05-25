import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { sendOtp, signUp } from '../../services/operations/AuthAPI';
import OTPInput from 'react-otp-input';

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, signupData } = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (!signupData) {
      navigate('/register');
    }
  }, [navigate, signupData]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const { email, confirmPassword, password, username } = signupData;

    dispatch(signUp(
     
      username,
      email,
      password,
      confirmPassword,
      otp,
      navigate
    ));
  };

  const handleResendOtp = () => {
    // Implement resend OTP logic here
    setOtp("");
    dispatch(sendOtp(signupData.email,navigate))
  };

  if (loading) {
    return (
      <div className={`h-screen flex justify-center items-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 
      ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`w-full max-w-md p-6 sm:p-8 rounded-lg shadow-lg 
        ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>
        
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center text-sm ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-500 hover:text-yellow-400'} mb-4`}
        >
          <FaArrowLeft className="mr-1" /> Back
        </button>

        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/50">
            <FaEnvelope className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className={`mt-3 text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Verify Your Email
          </h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            A 6-digit verification code has been sent to <span className="font-medium">{signupData?.email}</span>
          </p>
        </div>

        <form className="mt-6 space-y-6" onSubmit={handleOnSubmit}>
          <div className="flex justify-center">
            <OTPInput
  value={otp}
  onChange={setOtp}
  numInputs={6}
  renderSeparator={<span>-</span>}
  renderInput={(inputProps, index) => (
    <input
      {...inputProps}
      style={{
        width: '2.5rem',
        height: '2.5rem',
        fontSize: '1.25rem',
        borderRadius: '0.375rem',
        border: `1px solid ${darkMode ? '#4B5563' : '#D1D5DB'}`,
        backgroundColor: darkMode ? '#374151' : '#F9FAFB',
        color: darkMode ? '#F3F4F6' : '#111827',
      }}
    />
  )}
  shouldAutoFocus
  inputType="number"
/>
          </div>

          <div>
            <button
              type="submit"
              disabled={otp.length !== 6}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${darkMode ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-yellow-500 hover:bg-yellow-400'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 ${darkMode ? 'focus:ring-yellow-500' : 'focus:ring-yellow-400'}
                ${otp.length !== 6 ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              Verify Email
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={handleResendOtp}
              className={`font-medium cursor-pointer ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-500 hover:text-yellow-400 '}`}
            >
              Resend OTP
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;