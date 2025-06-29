import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import { sendOtp } from '../../services/operations/AuthAPI';
import { setSignupData } from '../slices/AuthSlice';
import { setUsername } from '../slices/UserNameSlice';
import { checkUsernameUnique } from '../../services/operations/AuthAPI';

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isUnique, setIsUnique] = useState(null);
  
  const { username, email, password, confirmPassword, agreedToTerms } = formData;
  const debounceRef = useRef();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    
    if (name === "username") {
      dispatch(setUsername(value));
      
      if (value.length < 3) {
        setErrors(prev => ({ ...prev, username: 'Username must be at least 3 characters' }));
        setIsUnique(null);
        return;
      }
      
      if (debounceRef.current) clearTimeout(debounceRef.current);
      
      debounceRef.current = setTimeout(async () => {
        setChecking(true);
        try {
          const response = await dispatch(checkUsernameUnique(value, setIsUnique));
          if (!response.unique) {
            setErrors(prev => ({ ...prev, username: 'Username is already taken' }));
          }
        } catch (error) {
          toast.error('Error checking username availability');
        } finally {
          setChecking(false);
        }
      }, 500);
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!username.trim()) newErrors.username = 'Username is required';
    else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (isUnique === false) {
      newErrors.username = 'Username is already taken';
    }
    
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!agreedToTerms) {
      newErrors.agreedToTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    
    try {
      const signupData = {
        ...formData,
      };

      dispatch(setSignupData(signupData));
      await dispatch(sendOtp(email, navigate));

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreedToTerms: false
      });
      
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        error.message || 
        "Signup failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 py-20 sm:px-6 sm:py-20 lg:px-8 lg:py-20
      ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
      <div className={`w-full max-w-md p-4 rounded-xl shadow-2xl 
        ${darkMode ? 'bg-gray-800/90 text-gray-100 backdrop-blur-sm' : 'bg-white/90 text-gray-800 backdrop-blur-sm'}
        border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full 
            ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'} mb-4`}>
            <FaUserPlus className={`text-2xl ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Join Our Community
          </h2>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              className={`font-medium ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-500 hover:text-yellow-400'}`}
              onClick={(e) => isSubmitting ? e.preventDefault() : null}
            >
              Sign in here
            </Link>
          </p>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`block w-full px-4 py-3 text-sm rounded-lg border 
                  ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-yellow-500' : 'bg-white border-gray-300 focus:border-yellow-400'} 
                  ${errors.username || isUnique === false ? 'border-red-500' : isUnique === true ? 'border-green-500' : ''} 
                  ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}
                  focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-yellow-500/50' : 'focus:ring-yellow-400/50'}`}
                placeholder="e.g. creative_coder"
              />
              {checking && (
                <span className="absolute right-3 top-3 text-xs text-gray-400 animate-pulse">Checking...</span>
              )}
              {isUnique === true && !checking && (
                <span className="absolute right-3 top-3 text-green-500 text-xs">Available</span>
              )}
            </div>
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`block w-full px-4 py-3 text-sm rounded-lg border 
                  ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-yellow-500' : 'bg-white border-gray-300 focus:border-yellow-400'} 
                  ${errors.email ? 'border-red-500' : ''} 
                  ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}
                  focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-yellow-500/50' : 'focus:ring-yellow-400/50'}`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`block w-full px-4 py-3 text-sm rounded-lg border 
                  ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-yellow-500' : 'bg-white border-gray-300 focus:border-yellow-400'} 
                  ${errors.password ? 'border-red-500' : ''} 
                  ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}
                  focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-yellow-500/50' : 'focus:ring-yellow-400/50'}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={isSubmitting}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}
                  ${isSubmitting ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`block w-full px-4 py-3 text-sm rounded-lg border 
                  ${darkMode ? 'bg-gray-700/50 border-gray-600 focus:border-yellow-500' : 'bg-white border-gray-300 focus:border-yellow-400'} 
                  ${errors.confirmPassword ? 'border-red-500' : ''} 
                  ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}
                  focus:outline-none focus:ring-2 ${darkMode ? 'focus:ring-yellow-500/50' : 'focus:ring-yellow-400/50'}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                disabled={isSubmitting}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}
                  ${isSubmitting ? 'cursor-not-allowed opacity-70' : ''}`}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="agreedToTerms"
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`h-4 w-4 rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} 
                  focus:ring-2 ${darkMode ? 'focus:ring-yellow-500' : 'focus:ring-yellow-400'} 
                  text-yellow-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              />
            </div>
            <label htmlFor="terms" className="ml-3 text-sm">
              I agree to the{' '}
              <span className={`font-medium ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-500 hover:text-yellow-400'}`}>
                Terms of Service
              </span>{' '}
              and{' '}
              <span className={`font-medium ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-500 hover:text-yellow-400'}`}>
                Privacy Policy
              </span>
            </label>
          </div>
          {errors.agreedToTerms && (
            <p className="mt-1 text-xs text-red-500">{errors.agreedToTerms}</p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-300
                ${darkMode ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-yellow-500 hover:bg-yellow-400'}
                ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}
                flex justify-center items-center`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;