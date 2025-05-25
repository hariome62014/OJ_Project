// import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import ProfileStats from '../components/ProfileComponents/ProfileStats';
// import ActivityTimeline from '../components/ProfileComponents/ActivityTimeline';
// import ProblemSolvedChart from '../components/ProfileComponents/ProblemSolvedChart';
// import HeatmapCalendar from '../components/ProfileComponents/HeatMapCalender';
// import ProfileInfo from '../components/ProfileComponents/ProfileInfo';

// const ProfilePage = () => {
//   const { user } = useSelector((state) => state.auth);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Simulate API call to fetch user stats
//     const fetchUserStats = async () => {
//       setLoading(true);
//       try {
//         // Replace with actual API call
//         const mockStats = {
//           totalProblems: 142,
//           totalSubmissions: 328,
//           accuracy: 87,
//           contestsParticipated: 8,
//           problemsByDifficulty: {
//             easy: 72,
//             medium: 58,
//             hard: 12
//           },
//           languages: {
//             'Python': 45,
//             'JavaScript': 38,
//             'C++': 32,
//             'Java': 27
//           },
//           solvedData: {
//             labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//             values: [12, 19, 15, 25, 22, 30]
//           },
//           submissionData: [
//             // This would be populated with actual dates from your data
//             { date: '2023-01-01', count: 1 },
//             { date: '2023-01-02', count: 3 },
//             // ... more data
//           ],
//           recentActivities: [
//             {
//               type: 'submission',
//               date: '2023-06-15T14:32:00Z',
//               problemTitle: 'Two Sum',
//               difficulty: 'easy',
//               language: 'Python',
//               runtime: 45
//             },
//             {
//               type: 'contest',
//               date: '2023-06-14T10:15:00Z',
//               contestName: 'Weekly Contest 350'
//             },
//             {
//               type: 'submission',
//               date: '2023-06-13T18:45:00Z',
//               problemTitle: 'Longest Palindromic Substring',
//               difficulty: 'medium',
//               language: 'JavaScript',
//               runtime: 120
//             },
//             {
//               type: 'achievement',
//               date: '2023-06-10T09:20:00Z',
//               achievementName: '100 Problems Solved'
//             }
//           ]
//         };
//         setStats(mockStats);
//       } catch (error) {
//         console.error('Failed to fetch stats:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserStats();
//   }, [user]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Profile Info */}
//           <div className="lg:col-span-1">
//             <ProfileInfo user={user} />
//           </div>

//           {/* Right Column - Stats and Activity */}
//           <div className="lg:col-span-2 space-y-6">
//             <ProfileStats userStats={stats} />
            
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <ProblemSolvedChart solvedData={stats?.solvedData} />
//               <HeatmapCalendar submissionData={stats?.submissionData} />
//             </div>

//             <ActivityTimeline recentActivities={stats?.recentActivities} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;



// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { updatePfp } from '../../services/operations/ProfileAPI';
// import { FaUser, FaEdit, FaSave, FaTimes, FaUpload, FaLinkedin, FaGithub, FaTwitter, FaGlobe } from 'react-icons/fa';
// // import defaultAvatar from '../../assets/default-avatar.jpg';

// const ProfilePage = () => {
//   const dispatch = useDispatch();
//   const darkMode = useSelector((state) => state.theme.darkMode);
//   const user = useSelector((state) => state.profile.user);
  
//   const [isEditing, setIsEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     bio: '',
//     website: '',
//     linkedin: '',
//     github: '',
//     twitter: ''
//   });
//   const [avatarPreview, setAvatarPreview] = useState('');
//   const [errors, setErrors] = useState({});

//   // Initialize form data with user data
//   useEffect(() => {
//     if (user) {
//       setFormData({
//         username: user.username || '',
//         email: user.email || '',
//         bio: user.bio || '',
//         website: user.website || '',
//         linkedin: user.linkedin || '',
//         github: user.github || '',
//         twitter: user.twitter || ''
//       });
//       setAvatarPreview(user.image);
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setAvatarPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.username.trim()) newErrors.username = 'Username is required';
//     if (!formData.email.trim()) newErrors.email = 'Email is required';
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       const updatedData = {
//         ...formData,
//         profileImage: avatarPreview 
//       };
//        dispatch(updatePfp(updatedData));
//       setIsEditing(false);
//     } catch (error) {
//       setErrors({
//         api: error.message || 'Failed to update profile'
//       });
//     }
//   };

//   const socialLinks = [
//     { name: 'website', icon: <FaGlobe />, placeholder: 'https://yourwebsite.com' },
//     { name: 'linkedin', icon: <FaLinkedin />, placeholder: 'https://linkedin.com/in/username' },
//     { name: 'github', icon: <FaGithub />, placeholder: 'https://github.com/username' },
//     { name: 'twitter', icon: <FaTwitter />, placeholder: 'https://twitter.com/username' }
//   ];

//   return (
//     <div className={`min-h-screen py-24 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
//       <div className={`max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
//         {/* Profile Header */}
//         <div className={`relative ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} h-48`}>
//           <div className="absolute -bottom-16 left-6">
//             <div className="relative group">
//               <div className={`w-32 h-32 rounded-full border-4 ${darkMode ? 'border-gray-800' : 'border-white'} overflow-hidden`}>
//                 <img 
//                   src={avatarPreview} 
//                   alt="Profile" 
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               {isEditing && (
//                 <label className="absolute bottom-0 right-0 bg-yellow-500 text-white p-2 rounded-full cursor-pointer hover:bg-yellow-600 transition-colors">
//                   <FaUpload />
//                   <input 
//                     type="file" 
//                     className="hidden" 
//                     accept="image/*"
//                     onChange={handleAvatarChange}
//                   />
//                 </label>
//               )}
//             </div>
//           </div>
//           <div className="absolute top-4 right-4">
//             {isEditing ? (
//               <div className="flex space-x-2">
//                 <button 
//                   onClick={handleSubmit}
//                   className={`p-2 rounded-full ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
//                   title="Save"
//                 >
//                   <FaSave />
//                 </button>
//                 <button 
//                   onClick={() => setIsEditing(false)}
//                   className={`p-2 rounded-full ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
//                   title="Cancel"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>
//             ) : (
//               <button 
//                 onClick={() => setIsEditing(true)}
//                 className={`p-2 rounded-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
//                 title="Edit Profile"
//               >
//                 <FaEdit />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Profile Content */}
//         <div className="pt-20 pb-8 px-6">
//           {errors.api && (
//             <div className={`mb-4 p-3 rounded-md ${darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'}`}>
//               {errors.api}
//             </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Main Profile Info */}
//             <div className="md:col-span-2">
//               <div className="space-y-4">
//                 <div>
//                   <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
//                   {isEditing ? (
//                     <>
//                       <input
//                         name="username"
//                         value={formData.username}
//                         onChange={handleChange}
//                         className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${errors.username ? 'border-red-500' : ''}`}
//                       />
//                       {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
//                     </>
//                   ) : (
//                     <p className={`px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>{user?.username}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
//                   {isEditing ? (
//                     <>
//                       <input
//                         name="email"
//                         type="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${errors.email ? 'border-red-500' : ''}`}
//                       />
//                       {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
//                     </>
//                   ) : (
//                     <p className={`px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>{user?.email}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bio</label>
//                   {isEditing ? (
//                     <textarea
//                       name="bio"
//                       value={formData.bio}
//                       onChange={handleChange}
//                       rows="3"
//                       className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
//                     />
//                   ) : (
//                     <p className={`px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} whitespace-pre-line`}>
//                       {user?.bio || 'No bio yet'}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Social Links */}
//             <div>
//               <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Social Links</h3>
//               <div className="space-y-3">
//                 {socialLinks.map((link) => (
//                   <div key={link.name}>
//                     <label className={`flex items-center text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                       <span className="mr-2">{link.icon}</span>
//                       {link.name.charAt(0).toUpperCase() + link.name.slice(1)}
//                     </label>
//                     {isEditing ? (
//                       <input
//                         name={link.name}
//                         value={formData[link.name]}
//                         onChange={handleChange}
//                         placeholder={link.placeholder}
//                         className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
//                       />
//                     ) : (
//                       <div className={`px-3 py-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} truncate`}>
//                         {user?.[link.name] ? (
//                           <a 
//                             href={user[link.name]} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             className={`${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-blue-600 hover:text-blue-500'}`}
//                           >
//                             {user[link.name]}
//                           </a>
//                         ) : (
//                           'Not provided'
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Stats Section */}
//           <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
//             <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Stats</h3>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//               <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
//                 <p className="text-sm text-gray-500">Problems Solved</p>
//                 <p className="text-2xl font-bold">42</p>
//               </div>
//               <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
//                 <p className="text-sm text-gray-500">Contests Joined</p>
//                 <p className="text-2xl font-bold">8</p>
//               </div>
//               <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
//                 <p className="text-sm text-gray-500">Current Rank</p>
//                 <p className="text-2xl font-bold">#156</p>
//               </div>
//               <div className={`p-3 rounded-lg text-center ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
//                 <p className="text-sm text-gray-500">Accuracy</p>
//                 <p className="text-2xl font-bold">87%</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;



import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaCalendarAlt,
  FaTrophy,
  FaCode,
  FaEdit,
  FaSave
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const LearnerProfilePage = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const user = useSelector((state) => state.profile.user);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.username || 'Learner',
    email: user?.email || '',
    joinDate: 'Joined 3 months ago',
    bio: 'Passionate coder learning new technologies'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Chart data
  const progressData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        label: 'Problems Solved',
        data: [45, 30, 15],
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

  const activityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Problems Solved',
        data: [5, 8, 12, 10, 15, 18],
        backgroundColor: 'rgba(139, 92, 246, 0.7)',
        borderColor: 'rgba(139, 92, 246, 1)',
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
                        value={profileData.name}
                        onChange={handleInputChange}
                        className={`bg-transparent border-b ${darkMode ? 'border-gray-600 focus:border-yellow-400' : 'border-gray-300 focus:border-yellow-500'}`}
                      />
                    ) : (
                      profileData.name
                    )}
                  </h1>
                  <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Coding Enthusiast
                  </p>
                </div>
                <button
                  onClick={() => editMode ? setEditMode(false) : setEditMode(true)}
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
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center">
                  <FaLock className="mr-3 text-yellow-500" />
                  <Link 
                    to="/change-password" 
                    className={`${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-500'}`}
                  >
                    Change Password
                  </Link>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-3 text-yellow-500" />
                  <span>{profileData.joinDate}</span>
                </div>
                <div className="flex items-center">
                  <FaTrophy className="mr-3 text-yellow-500" />
                  <span>Rank: Top 15%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Learning Statistics */}
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <h2 className="text-xl font-bold mb-4">Your Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Problems Solved:</span>
                  <span className="font-bold">90</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Contests Joined:</span>
                  <span className="font-bold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Current Streak:</span>
                  <span className="font-bold">7 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Accuracy:</span>
                  <span className="font-bold">78%</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-start`}>
                    <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} mr-3`}>
                      <FaCode className="text-sm" />
                    </div>
                    <div>
                      <p className="font-medium">Solved "Two Sum" problem</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link 
                to="/activity" 
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
            {/* Progress Chart */}
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
              <h2 className="text-xl font-bold mb-4">Your Progress</h2>
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
                    data={progressData}
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
                    to="/problems" 
                    className={`block p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    Practice Problems
                  </Link>
                  <Link 
                    to="/contests" 
                    className={`block p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    Join a Contest
                  </Link>
                  <Link 
                    to="/progress" 
                    className={`block p-3 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                  >
                    View Progress
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

export default LearnerProfilePage;