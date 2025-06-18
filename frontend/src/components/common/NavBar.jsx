import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useParams,useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../services/operations/AuthAPI';
import { toggleTheme } from '../../slices/ThemeSlice';
import { ConfirmationModal } from '../modals/ConfirmationModal';
import { 
  FaCode, 
  FaSun, 
  FaMoon, 
  FaUser, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaUserPlus, 
  FaBars, 
  FaTimes,
  FaChevronDown
} from 'react-icons/fa';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const [showConfirmModal,setShowConfirmModal] = useState(false);
  
  // Refs for dropdowns to handle outside clicks
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Redux selectors
  const darkMode = useSelector((state) => state.theme.darkMode);
  // const user = useSelector((state) => state.auth.user);
  const user = useSelector((state) => state.profile.user);


  // Handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

const handleLogout = () => {
  setUserDropdownOpen(false)
  setShowConfirmModal(true);
};

const confirmLogout = () => {
  dispatch(logout());
  navigate('/');
  setShowConfirmModal(false);
  setMobileMenuOpen(false);
  setUserDropdownOpen(false);
};

const cancelLogout = () => {
  setShowConfirmModal(false);
};

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Close other dropdowns when mobile menu opens
    if (!mobileMenuOpen) {
      setUserDropdownOpen(false);
      setAuthDropdownOpen(false);
    }
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
    // Close other dropdowns when this one opens
    if (!userDropdownOpen) {
      setAuthDropdownOpen(false);
    }
  };

const problem = useSelector((state)=>state.problem);
const problemId = problem.problem._id;
const location = useLocation();

const hiddenPaths = [
  `/problems/${problemId}`, // Exact match for this problem
   // If you want to hide for all problem pages
];

// Check if current path is in hiddenPaths
const shouldHideFooter = hiddenPaths.some(path => 
  location.pathname === path || 
  location.pathname.startsWith(path + '/')
);

if (shouldHideFooter) return null;

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50
      ${darkMode ? 
        'bg-gray-900 text-gray-100 border-gray-700' : 
        'bg-white text-gray-800 border-gray-200'
      }
      border-b shadow-sm transition-colors duration-300
    `}>
      {showConfirmModal &&
      <ConfirmationModal
  isOpen={showConfirmModal}
  onConfirm={confirmLogout}
  onCancel={cancelLogout}
  message="Are you sure you want to log out?"
  darkMode={darkMode} // Make sure you have darkMode in your props/state
  actionToBeTaken="Logout"
/>}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo/Brand */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold"
            onClick={() => {
              setMobileMenuOpen(false);
              setUserDropdownOpen(false);
            }}
          >
            <FaCode className={`
              ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}
            `} />
            <span>CodeServ</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink 
              to={(!user || user.role !== 'admin') ? '/problems' : '/admin-problem-list'}
              className={({ isActive }) => `
                px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${isActive ? 
                  (darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-yellow-600') :
                  (darkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-500')
                }
              `}
              onClick={() => setUserDropdownOpen(false)}
            >
              Problems
            </NavLink>
            <NavLink 
              to="/contests" 
              className={({ isActive }) => `
                px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${isActive ? 
                  (darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-yellow-600') :
                  (darkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-500')
                }
              `}
              onClick={() => setUserDropdownOpen(false)}
            >
              Contests
            </NavLink>
            <NavLink 
              to="/leaderboard" 
              className={({ isActive }) => `
                px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
                ${isActive ? 
                  (darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-yellow-600') :
                  (darkMode ? 'hover:text-yellow-300' : 'hover:text-yellow-500')
                }
              `}
              onClick={() => setUserDropdownOpen(false)}
            >
              Leaderboard
            </NavLink>
          </nav>

          {/* Right Side Actions */}
          <div className={`flex items-center ${user ? 'space-x-6 px-0.5' : 'space-x-1'}`}>
            {/* Theme Toggle */}
            <button 
              onClick={handleThemeToggle}
              className={`
                p-2 rounded-full focus:outline-none transition-colors duration-200
                ${darkMode ? 
                  'text-yellow-300 hover:bg-gray-700' : 
                  'text-yellow-500 hover:bg-gray-100'
                }
              `}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </button>

            {/* User Actions */}
            {user ? (
              <div className="relative hidden md:block" ref={userDropdownRef}>
                <button 
  onClick={toggleUserDropdown}
  className={`
    flex items-center justify-center w-10 h-10 rounded-full overflow-hidden transition-colors duration-200
    ${darkMode ? 
      'hover:bg-gray-700' : 
      'hover:bg-gray-100'
    }
    focus:outline-none
    ${userDropdownOpen ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''}
  `}
  aria-expanded={userDropdownOpen}
  aria-haspopup="true"
>
  {/* Profile Image - replace with your actual image source */}
  {user?.image ? (
    <img 
      src={user.image} 
      alt="Profile" 
      className="w-full h-full object-cover"
    />
  ) : (
    <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
      <FaUser className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
    </div>
  )}
</button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className={`
                      absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 transition-all duration-200
                      ${darkMode ? 
                        'bg-gray-800 border border-gray-700' : 
                        'bg-white border border-gray-200'
                      }
                      z-50
                    `}
                  >
                    <Link 
                      to={user && user.role === 'admin'?"/admin-profile":"/profile"}
                      className={`
                        block px-4 py-2 text-sm transition-colors duration-200
                        ${darkMode ? 
                          'hover:bg-gray-700 text-gray-100' : 
                          'hover:bg-gray-100 text-gray-800'
                        }
                      `}
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <FaUser className="inline mr-2" /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`
                        w-full text-left px-4 py-2 text-sm transition-colors duration-200
                        ${darkMode ? 
                          'hover:bg-gray-700 text-gray-100' : 
                          'hover:bg-gray-100 text-gray-800'
                        }
                      `}
                    >
                      <FaSignOutAlt className="inline mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link 
                  to="/login" 
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${darkMode ? 
                      'hover:bg-gray-700' : 
                      'hover:bg-gray-100'
                    }
                  `}
                >
                  <FaSignInAlt className="inline" /> Login
                </Link>
                {/* <Link 
                  to="/register" 
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${darkMode ? 
                      'bg-yellow-600 hover:bg-yellow-500 text-white' : 
                      'bg-yellow-500 hover:bg-yellow-400 text-white'
                    }
                  `}
                >
                  <FaUserPlus className="inline mr-1" /> Register
                </Link> */}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className={`
                md:hidden p-2 rounded-md focus:outline-none transition-colors duration-200
                ${darkMode ? 
                  'hover:bg-gray-700' : 
                  'hover:bg-gray-100'
                }
              `}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden
          ${mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
        `}
        ref={mobileMenuRef}
      >
        <div className={`
          px-2 pt-2 pb-4 space-y-1
          ${darkMode ? 'bg-gray-900' : 'bg-white'}
        `}>
          <NavLink 
            to="/problems" 
            className={({ isActive }) => `
              block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
              ${isActive ? 
                (darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-yellow-600') :
                (darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900')
              }
            `}
            onClick={() => setMobileMenuOpen(false)}
          >
            Problems
          </NavLink>
          <NavLink 
            to="/contests" 
            className={({ isActive }) => `
              block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
              ${isActive ? 
                (darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-yellow-600') :
                (darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900')
              }
            `}
            onClick={() => setMobileMenuOpen(false)}
          >
            Contests
          </NavLink>
          <NavLink 
            to="/leaderboard" 
            className={({ isActive }) => `
              block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
              ${isActive ? 
                (darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-yellow-600') :
                (darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900')
              }
            `}
            onClick={() => setMobileMenuOpen(false)}
          >
            Leaderboard
          </NavLink>

          {user ? (
            <>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => `
                  block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                  ${isActive ? 
                    (darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-yellow-600') :
                    (darkMode ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900')
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUser className="inline mr-2" /> Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className={`
                  w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                  ${darkMode ? 
                    'text-gray-300 hover:bg-gray-800 hover:text-white' : 
                    'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <FaSignOutAlt className="inline mr-2" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`
                  block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                  ${darkMode ? 
                    'text-gray-300 hover:bg-gray-800 hover:text-white' : 
                    'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaSignInAlt className="inline mr-2" /> Login
              </Link>
              <Link 
                to="/register" 
                className={`
                  block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200
                  ${darkMode ? 
                    'bg-yellow-600 hover:bg-yellow-500 text-white' : 
                    'bg-yellow-500 hover:bg-yellow-400 text-white'
                  }
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaUserPlus className="inline mr-2" /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
