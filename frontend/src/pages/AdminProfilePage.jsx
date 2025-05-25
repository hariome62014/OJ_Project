import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaCalendarAlt,
  FaChartBar,
  FaEdit,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const AdminProfilePage = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [editMode, setEditMode] = useState(false);
  const [adminData, setAdminData] = useState({
    name: 'Admin User',
    email: 'admin@codejudge.com',
    joinDate: 'January 15, 2022',
    lastLogin: 'Today at 10:30 AM'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setEditMode(false);
    // Here you would typically send the updated data to your backend
  };

  // Chart data
  const activityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Problems Added',
        data: [12, 19, 8, 15, 12, 17],
        backgroundColor: 'rgba(234, 179, 8, 0.7)',
        borderColor: 'rgba(234, 179, 8, 1)',
        borderWidth: 1
      },
      {
        label: 'Users Registered',
        data: [8, 15, 12, 17, 14, 20],
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1
      }
    ]
  };

  const problemStatsData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [45, 30, 25],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(239, 68, 68, 0.7)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-24`}>
      {/* Profile Header */}
      <header className={`relative py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-purple-900 to-indigo-800' : 'bg-gradient-to-br from-purple-100 to-indigo-100'}`}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 md:mb-0 md:mr-8"
            >
              <div className={`w-32 h-32 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center shadow-lg`}>
                <FaUser className="w-16 h-16 text-gray-400" />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={adminData.name}
                        onChange={handleInputChange}
                        className={`bg-transparent border-b ${darkMode ? 'border-gray-600 focus:border-yellow-400' : 'border-gray-300 focus:border-yellow-500'}`}
                      />
                    ) : (
                      adminData.name
                    )}
                  </h1>
                  <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Platform Administrator
                  </p>
                </div>
                <button
                  onClick={() => editMode ? handleSave() : setEditMode(true)}
                  className={`flex items-center px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                >
                  {editMode ? (
                    <>
                      <FaSave className="mr-2" /> Save
                    </>
                  ) : (
                    <>
                      <FaEdit className="mr-2" /> Edit
                    </>
                  )}
                </button>
              </div>
              
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <div className="flex items-center">
                  <FaEnvelope className="mr-3 text-yellow-500" />
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={adminData.email}
                      onChange={handleInputChange}
                      className={`bg-transparent border-b ${darkMode ? 'border-gray-600 focus:border-yellow-400' : 'border-gray-300 focus:border-yellow-500'} w-full`}
                    />
                  ) : (
                    <span>{adminData.email}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <FaLock className="mr-3 text-yellow-500" />
                  <Link 
                    to="/admin/change-password" 
                    className={`${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-500'}`}
                  >
                    Change Password
                  </Link>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-3 text-yellow-500" />
                  <span>Joined: {adminData.joinDate}</span>
                </div>
                <div className="flex items-center">
                  <FaChartBar className="mr-3 text-yellow-500" />
                  <span>Last login: {adminData.lastLogin}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Admin Stats */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Admin Statistics */}
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <h2 className="text-xl font-bold mb-4">Admin Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Problems Added:</span>
                  <span className="font-bold">124</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Test Cases Created:</span>
                  <span className="font-bold">892</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Contests Managed:</span>
                  <span className="font-bold">36</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Users Banned:</span>
                  <span className="font-bold">8</span>
                </div>
              </div>
            </div>

            {/* Recent Actions */}
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <h2 className="text-xl font-bold mb-4">Recent Actions</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}>
                    <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} mr-3`}>
                      <FaEdit className="text-sm" />
                    </div>
                    <div>
                      <p className="font-medium">Updated problem settings</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                to="/admin/activity" 
                className={`inline-block mt-4 text-sm ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-500'}`}
              >
                View all activity →
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Charts */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Activity Chart */}
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <h2 className="text-xl font-bold mb-4">Monthly Activity</h2>
              <div className="h-64">
                <Bar 
                  data={activityData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          color: darkMode ? '#e5e7eb' : '#374151'
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: darkMode ? '#9ca3af' : '#6b7280'
                        },
                        grid: {
                          color: darkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)'
                        }
                      },
                      x: {
                        ticks: {
                          color: darkMode ? '#9ca3af' : '#6b7280'
                        },
                        grid: {
                          color: darkMode ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)'
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Problem Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <h2 className="text-xl font-bold mb-4">Problem Difficulty</h2>
                <div className="h-48">
                  <Pie 
                    data={problemStatsData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: darkMode ? '#e5e7eb' : '#374151'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link 
                    to="/admin/create-problem" 
                    className={`block p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    Add New Problem
                  </Link>
                  <Link 
                    to="/admin/contests/new" 
                    className={`block p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    Create Contest
                  </Link>
                  <Link 
                    to="/admin/users" 
                    className={`block p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    Manage Users
                  </Link>
                  <Link 
                    to="/admin/settings" 
                    className={`block p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    Platform Settings
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;