import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaCode, FaHeart } from 'react-icons/fa';

const Footer = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const location = useLocation();

  // Array of paths where footer should be hidden
  const hiddenPaths = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-otp'
  ];

  // Check if current path should hide footer
  const shouldHideFooter = hiddenPaths.some(path => location.pathname.startsWith(path));

  if (shouldHideFooter) return null;

  return (
    <footer className={`
      ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'}
      border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}
      transition-colors duration-300
    `}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FaCode className={`
                text-2xl ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}
              `} />
              <span className="text-xl font-bold">CodeJudge</span>
            </div>
            <p className="text-sm">
              A modern online judge platform for coding enthusiasts and competitive programmers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className={`
                ${darkMode ? 'hover:text-yellow-400' : 'hover:text-yellow-500'}
                transition-colors
              `}>
                <FaGithub className="w-5 h-5" />
              </a>
              <a href="#" className={`
                ${darkMode ? 'hover:text-yellow-400' : 'hover:text-yellow-500'}
                transition-colors
              `}>
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className={`
                ${darkMode ? 'hover:text-yellow-400' : 'hover:text-yellow-500'}
                transition-colors
              `}>
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className={`
              text-lg font-semibold 
              ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}
            `}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className={`
                  hover:underline ${darkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-500'}
                  transition-colors
                `}>
                  Problems
                </a>
              </li>
              <li>
                <a href="#" className={`
                  hover:underline ${darkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-500'}
                  transition-colors
                `}>
                  Contests
                </a>
              </li>
              <li>
                <a href="#" className={`
                  hover:underline ${darkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-500'}
                  transition-colors
                `}>
                  Leaderboard
                </a>
              </li>
              <li>
                <a href="#" className={`
                  hover:underline ${darkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-500'}
                  transition-colors
                `}>
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className={`
              text-lg font-semibold 
              ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}
            `}>
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className={`
                  hover:underline ${darkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-500'}
                  transition-colors
                `}>
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className={`
                  hover:underline ${darkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-500'}
                  transition-colors
                `}>
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="#" className={`
                  hover:underline ${darkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-500'}
                  transition-colors
                `}>
                  Community Forum
                </a>
              </li>
              <li>
                <a href="#" className={`
                  hover:underline ${darkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-500'}
                  transition-colors
                `}>
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className={`
              text-lg font-semibold 
              ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}
            `}>
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <span>Email:</span>
                <a href="mailto:support@codejudge.com" className={`
                  hover:underline ${darkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-500'}
                  transition-colors
                `}>
                  support@codejudge.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <span>Twitter:</span>
                <a href="https://twitter.com/codejudge" className={`
                  hover:underline ${darkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-500'}
                  transition-colors
                `}>
                  @codejudge
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className={`
          mt-12 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}
          text-center text-sm
        `}>
          <p className="flex items-center justify-center">
            Made with <FaHeart className={`mx-1 ${darkMode ? 'text-red-400' : 'text-red-500'}`} /> by Hari
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} CodeJudge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;