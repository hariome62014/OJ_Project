// import React, { useEffect,useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FiActivity, 
//   FiCalendar, 
//   FiBarChart2, 
//   FiAward, 
//   FiCode,
//   FiUser,
//   FiCheckCircle,
//   FiClock,
//   FiTrendingUp,
//   FiStar,
//   FiZap
// } from 'react-icons/fi';
// import ProfileStats from '../components/ProfileComponents/ProfileStats';
// import ActivityTimeline from '../components/ProfileComponents/ActivityTimeline';
// import ProblemSolvedChart from '../components/ProfileComponents/ProblemSolvedChart';
// import HeatmapCalendar from '../components/ProfileComponents/HeatMapCalender';
// import ProfileInfo from '../components/ProfileComponents/ProfileInfo';
// import { fetchProfileData } from '../../services/operations/ProfileAPI';

// const ProfilePage = () => {
//   const dispatch = useDispatch();
//   const { user, stats, loading, error, currentStreak } = useSelector((state) => state.profile);
//   const { token } = useSelector((state) => state.auth);
//   const { darkMode } = useSelector((state) => state.theme);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//   if (user?._id && token) {
//     const promise = dispatch(fetchProfileData({ userId: user._id, token }));

//     console.log("Promise::",promise)
    
    
//   }
// }, []);

//   if (loading) {
//     return (
//       <div className={`flex flex-col justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <motion.div
//           animate={{ 
//             rotate: 360,
//             scale: [1, 1.2, 1]
//           }}
//           transition={{ 
//             rotate: { duration: 2, repeat: Infinity, ease: "linear" },
//             scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
//           }}
//           className={`rounded-full h-16 w-16 border-t-4 border-b-4 ${darkMode ? 'border-blue-400' : 'border-blue-600'}`}
//         ></motion.div>
//         <motion.p 
//           initial={{ opacity: 0.5 }}
//           animate={{ opacity: 1 }}
//           transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
//           className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}
//         >
//           Loading your profile data...
//         </motion.p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`flex flex-col justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md max-w-md text-center`}>
//           <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
//             Error Loading Profile
//           </h2>
//           <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//             {error}
//           </p>
//           <button
//             onClick={() => dispatch(fetchProfileData({ userId: user._id, token }))}
//             className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!user || !stats) {
//     return null; // or a skeleton loader
//   }

//   return (
//     <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-8 px-4 sm:px-6 lg:px-8 mt-16`}>
//       <div className="w-full">
//         {/* Header with animated greeting */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-8"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold">
//                 Welcome back, <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>{user.name || 'Coder'}!</span>
//               </h1>
//               <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                 Here's your coding journey at a glance
//               </p>
//             </div>
//             <motion.div 
//               whileHover={{ scale: 1.05 }}
//               className={`flex items-center px-4 py-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
//             >
//               <FiUser className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
//               <span className="font-medium">{currentStreak} day streak</span>
//               <FiZap className={`ml-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Main Content with animated transitions */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={activeTab}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
//               {/* Left Column - Profile Info */}
//               <div className="lg:col-span-1">
//                 <ProfileInfo user={user} stats={stats} darkMode={darkMode} />
                
//                 {/* Quick Stats */}
//                 <motion.div 
//                   whileHover={{ y: -5 }}
//                   className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
//                 >
//                   <h3 className="flex items-center text-lg font-semibold mb-4">
//                     <FiTrendingUp className="mr-2" />
//                     Weekly Progress
//                   </h3>
//                   <div className="space-y-4">
//                     <div>
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm font-medium">Problems Solved</span>
//                         <span className="text-sm">{stats.totalProblemsSolved}/{stats.totalProblemsInDB
// }</span>
//                       </div>
//                       <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                         <div 
//                           className={`h-2 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`} 
//                           style={{ width: `${Math.min(100, (stats.totalProblemsSolved /stats.totalProblemsInDB
// ) * 100)}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                     <div>
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm font-medium">Accuracy</span>
//                         <span className="text-sm">{stats.accuracy}%</span>
//                       </div>
//                       <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                         <div 
//                           className={`h-2 rounded-full ${stats.accuracy > 80 ? (darkMode ? 'bg-green-400' : 'bg-green-600') : (darkMode ? 'bg-yellow-400' : 'bg-yellow-500')}`} 
//                           style={{ width: `${stats.accuracy}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   <div className="space-y-2">
//   <div className="flex justify-between items-center">
//     <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
//       Active Days
//     </span>
//     <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
//       {stats.activeDaysInWeek}/7
//     </span>
//   </div>
  
//   <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//     <div 
//       className={`h-full rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-600'} transition-all duration-300`} 
//       style={{ width: `${(stats.activeDaysInWeek / 7) * 100}%` }}
//     />
//   </div>
// </div>
//                   </div>
//                 </motion.div>
                
//                 {/* Languages */}
//                 <motion.div 
//                   whileHover={{ y: -5 }}
//                   className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
//                 >
//                   <h3 className="flex items-center text-lg font-semibold mb-4">
//                     <FiCode className="mr-2" />
//                     Language Distribution
//                   </h3>
//                   <div className="space-y-3">
//                     {Object.entries(stats.languages || {}).map(([lang, count]) => {
//                       const total = Object.values(stats.languages).reduce((a, b) => a + b, 0);
//                       const percentage = Math.round((count / total) * 100);
//                       return (
//                         <div key={lang}>
//                           <div className="flex justify-between text-sm mb-1">
//                             <span>{lang}</span>
//                             <span>{percentage}%</span>
//                           </div>
//                           <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                             <div 
//                               className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" 
//                               style={{ width: `${percentage}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </motion.div>
//               </div>

//               {/* Right Column - Stats and Activity */}
//               <div className="lg:col-span-2 space-y-6">
//                 {/* Stats Cards with hover effects */}
//                 <motion.div 
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.1 }}
//                 >
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <motion.div 
//                       whileHover={{ y: -3 }}
//                       className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'} border-l-4 border-blue-500`}
//                     >
//                       <div className="flex items-center">
//                         <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} mr-3`}>
//                           <FiCheckCircle className={`text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
//                         </div>
//                         <div>
//                           <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Problems Solved</p>
//                           <p className="text-2xl font-bold">{stats.totalProblemsSolved}</p>
//                         </div>
//                       </div>
//                     </motion.div>
                    
//                     <motion.div 
//                       whileHover={{ y: -3 }}
//                       className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'} border-l-4 border-green-500`}
//                     >
//                       <div className="flex items-center">
//                         <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-100'} mr-3`}>
//                           <FiBarChart2 className={`text-xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
//                         </div>
//                         <div>
//                           <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Accuracy</p>
//                           <p className="text-2xl font-bold">{stats.accuracy}%</p>
//                         </div>
//                       </div>
//                     </motion.div>
                    
//                     <motion.div 
//                       whileHover={{ y: -3 }}
//                       className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'} border-l-4 border-purple-500`}
//                     >
//                       <div className="flex items-center">
//                         <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'} mr-3`}>
//                           <FiClock className={`text-xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
//                         </div>
//                         <div>
//                           <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Streak</p>
//                           <p className="text-2xl font-bold">{currentStreak} days</p>
//                         </div>
//                       </div>
//                     </motion.div>
                    
//                     <motion.div 
//                       whileHover={{ y: -3 }}
//                       className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'} border-l-4 border-yellow-500`}
//                     >
//                       <div className="flex items-center">
//                         <div className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'} mr-3`}>
//                           <FiStar className={`text-xl ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
//                         </div>
//                         <div>
//                           <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Global Rank</p>
//                           <p className="text-2xl font-bold">#{stats.rank?.toLocaleString()}</p>
//                         </div>
//                       </div>
//                     </motion.div>
//                   </div>
//                 </motion.div>
                
//                 {/* Charts Section */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <motion.div 
//                     whileHover={{ scale: 1.01 }}
//                     className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
//                   >
//                     <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                       <h3 className="flex items-center font-semibold">
//                         <FiBarChart2 className="mr-2" />
//                         Problems Solved
//                       </h3>
//                     </div>
//                     <div className=" h-72">
//                       <ProblemSolvedChart monthlyUniqueProblems
// ={stats.monthlyUniqueProblems
// } darkMode={darkMode} />
//                     </div>
//                   </motion.div>
                  
//                   <motion.div 
//                     whileHover={{ scale: 1.01 }}
//                     className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
//                   >
//                     <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                       <h3 className="flex items-center font-semibold">
//                         <FiCalendar className="mr-2" />
//                         Activity Heatmap
//                       </h3>
//                     </div>
//                     <div className="p-4">
//                       <HeatmapCalendar submissionData={stats.submissionData} darkMode={darkMode} />
//                     </div>
//                   </motion.div>
//                 </div>

//                 {/* Activity Timeline */}
//                 <motion.div 
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.2 }}
//                   className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
//                 >
//                   <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                     <h3 className="flex items-center font-semibold">
//                       <FiActivity className="mr-2" />
//                       Recent Activity
//                     </h3>
//                   </div>
//                   <div className="p-4">
//                     <ActivityTimeline recentActivities={stats.recentActivities} darkMode={darkMode} />
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;



// import React, { useEffect, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FiActivity, 
//   FiCalendar, 
//   FiBarChart2, 
//   FiAward, 
//   FiCode,
//   FiUser,
//   FiCheckCircle,
//   FiClock,
//   FiTrendingUp,
//   FiStar,
//   FiZap
// } from 'react-icons/fi';
// import ProfileStats from '../components/ProfileComponents/ProfileStats';
// import ActivityTimeline from '../components/ProfileComponents/ActivityTimeline';
// import ProblemSolvedChart from '../components/ProfileComponents/ProblemSolvedChart';
// import HeatmapCalendar from '../components/ProfileComponents/HeatMapCalender';
// import ProfileInfo from '../components/ProfileComponents/ProfileInfo';
// import { fetchProfileData } from '../../services/operations/ProfileAPI';
// import { useSelector } from 'react-redux';

// const ProfilePage = () => {
//   const [profileData, setProfileData] = useState({
//     user: null,
//     stats: null,
//     currentStreak: 0,
//     loading: true,
//     error: null
//   });
//   const darkmode = useSelector((state)=>state.theme.darkmode)
//   const [activeTab, setActiveTab] = useState('overview');
//   const users = useSelector((state)=>state.profile.user)
//    const { token } = useSelector((state) => state.auth);


//   useEffect(() => {
//     const loadProfileData = async () => {
//       try {
//         // Assuming fetchProfileData now returns the data directly instead of using Redux
//         const response = await fetchProfileData({ userId: users._id, token });
//         setProfileData({
//           user: response.user,
//           stats: response.stats,
//           currentStreak: response.currentStreak,
//           loading: false,
//           error: null
//         });
//       } catch (err) {
//         setProfileData(prev => ({
//           ...prev,
//           loading: false,
//           error: err.message || 'Failed to load profile data'
//         }));
//       }
//     };

//     loadProfileData();
//   }, []);

//   if (profileData.loading) {
//     return (
//       <div className={`flex flex-col justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <motion.div
//           animate={{ 
//             rotate: 360,
//             scale: [1, 1.2, 1]
//           }}
//           transition={{ 
//             rotate: { duration: 2, repeat: Infinity, ease: "linear" },
//             scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
//           }}
//           className={`rounded-full h-16 w-16 border-t-4 border-b-4 ${darkMode ? 'border-blue-400' : 'border-blue-600'}`}
//         ></motion.div>
//         <motion.p 
//           initial={{ opacity: 0.5 }}
//           animate={{ opacity: 1 }}
//           transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
//           className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} font-medium`}
//         >
//           Loading your profile data...
//         </motion.p>
//       </div>
//     );
//   }

//   if (profileData.error) {
//     return (
//       <div className={`flex flex-col justify-center items-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
//         <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md max-w-md text-center`}>
//           <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
//             Error Loading Profile
//           </h2>
//           <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//             {profileData.error}
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className={`px-4 py-2 rounded-md ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!profileData.user || !profileData.stats) {
//     return null; // or a skeleton loader
//   }

//   const { user, stats, currentStreak } = profileData;

//   return (
//     <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-8 px-4 sm:px-6 lg:px-8 mt-16`}>
//       <div className="w-full">
//         {/* Header with animated greeting */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-8"
//         >
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold">
//                 Welcome back, <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>{user.name || 'Coder'}!</span>
//               </h1>
//               <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
//                 Here's your coding journey at a glance
//               </p>
//             </div>
//             <motion.div 
//               whileHover={{ scale: 1.05 }}
//               className={`flex items-center px-4 py-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
//             >
//               <FiUser className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
//               <span className="font-medium">{currentStreak} day streak</span>
//               <FiZap className={`ml-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
//             </motion.div>
//           </div>
//         </motion.div>

//         {/* Main Content with animated transitions */}
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={activeTab}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.3 }}
//           >
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
//               {/* Left Column - Profile Info */}
//               <div className="lg:col-span-1">
//                 <ProfileInfo user={user} stats={stats} darkMode={darkMode} />
                
//                 {/* Quick Stats */}
//                 <motion.div 
//                   whileHover={{ y: -5 }}
//                   className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
//                 >
//                   <h3 className="flex items-center text-lg font-semibold mb-4">
//                     <FiTrendingUp className="mr-2" />
//                     Weekly Progress
//                   </h3>
//                   <div className="space-y-4">
//                     <div>
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm font-medium">Problems Solved</span>
//                         <span className="text-sm">{stats.totalProblemsSolved}/{stats.totalProblemsInDB}</span>
//                       </div>
//                       <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                         <div 
//                           className={`h-2 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`} 
//                           style={{ width: `${Math.min(100, (stats.totalProblemsSolved / stats.totalProblemsInDB) * 100)}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                     <div>
//                       <div className="flex justify-between mb-1">
//                         <span className="text-sm font-medium">Accuracy</span>
//                         <span className="text-sm">{stats.accuracy}%</span>
//                       </div>
//                       <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                         <div 
//                           className={`h-2 rounded-full ${stats.accuracy > 80 ? (darkMode ? 'bg-green-400' : 'bg-green-600') : (darkMode ? 'bg-yellow-400' : 'bg-yellow-500')}`} 
//                           style={{ width: `${stats.accuracy}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
//                           Active Days
//                         </span>
//                         <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
//                           {stats.activeDaysInWeek}/7
//                         </span>
//                       </div>
//                       <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                         <div 
//                           className={`h-full rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-600'} transition-all duration-300`} 
//                           style={{ width: `${(stats.activeDaysInWeek / 7) * 100}%` }}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </motion.div>
                
//                 {/* Languages */}
//                 <motion.div 
//                   whileHover={{ y: -5 }}
//                   className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
//                 >
//                   <h3 className="flex items-center text-lg font-semibold mb-4">
//                     <FiCode className="mr-2" />
//                     Language Distribution
//                   </h3>
//                   <div className="space-y-3">
//                     {Object.entries(stats.languages || {}).map(([lang, count]) => {
//                       const total = Object.values(stats.languages).reduce((a, b) => a + b, 0);
//                       const percentage = Math.round((count / total) * 100);
//                       return (
//                         <div key={lang}>
//                           <div className="flex justify-between text-sm mb-1">
//                             <span>{lang}</span>
//                             <span>{percentage}%</span>
//                           </div>
//                           <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
//                             <div 
//                               className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" 
//                               style={{ width: `${percentage}%` }}
//                             ></div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </motion.div>
//               </div>

//               {/* Right Column - Stats and Activity */}
//               <div className="lg:col-span-2 space-y-6">
//                 {/* Stats Cards with hover effects */}
//                 <motion.div 
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.1 }}
//                 >
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                     <motion.div 
//                       whileHover={{ y: -3 }}
//                       className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'} border-l-4 border-blue-500`}
//                     >
//                       <div className="flex items-center">
//                         <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'} mr-3`}>
//                           <FiCheckCircle className={`text-xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
//                         </div>
//                         <div>
//                           <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Problems Solved</p>
//                           <p className="text-2xl font-bold">{stats.totalProblemsSolved}</p>
//                         </div>
//                       </div>
//                     </motion.div>
                    
//                     <motion.div 
//                       whileHover={{ y: -3 }}
//                       className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'} border-l-4 border-green-500`}
//                     >
//                       <div className="flex items-center">
//                         <div className={`p-2 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-100'} mr-3`}>
//                           <FiBarChart2 className={`text-xl ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
//                         </div>
//                         <div>
//                           <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Accuracy</p>
//                           <p className="text-2xl font-bold">{stats.accuracy}%</p>
//                         </div>
//                       </div>
//                     </motion.div>
                    
//                     <motion.div 
//                       whileHover={{ y: -3 }}
//                       className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'} border-l-4 border-purple-500`}
//                     >
//                       <div className="flex items-center">
//                         <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'} mr-3`}>
//                           <FiClock className={`text-xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
//                         </div>
//                         <div>
//                           <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current Streak</p>
//                           <p className="text-2xl font-bold">{currentStreak} days</p>
//                         </div>
//                       </div>
//                     </motion.div>
                    
//                     <motion.div 
//                       whileHover={{ y: -3 }}
//                       className={`rounded-xl p-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'} border-l-4 border-yellow-500`}
//                     >
//                       <div className="flex items-center">
//                         <div className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'} mr-3`}>
//                           <FiStar className={`text-xl ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
//                         </div>
//                         <div>
//                           <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Global Rank</p>
//                           <p className="text-2xl font-bold">#{stats.rank?.toLocaleString()}</p>
//                         </div>
//                       </div>
//                     </motion.div>
//                   </div>
//                 </motion.div>
                
//                 {/* Charts Section */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                   <motion.div 
//                     whileHover={{ scale: 1.01 }}
//                     className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
//                   >
//                     <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                       <h3 className="flex items-center font-semibold">
//                         <FiBarChart2 className="mr-2" />
//                         Problems Solved
//                       </h3>
//                     </div>
//                     <div className="h-72">
//                       <ProblemSolvedChart monthlyUniqueProblems={stats.monthlyUniqueProblems} darkMode={darkMode} />
//                     </div>
//                   </motion.div>
                  
//                   <motion.div 
//                     whileHover={{ scale: 1.01 }}
//                     className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
//                   >
//                     <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                       <h3 className="flex items-center font-semibold">
//                         <FiCalendar className="mr-2" />
//                         Activity Heatmap
//                       </h3>
//                     </div>
//                     <div className="p-4">
//                       <HeatmapCalendar submissionData={stats.submissionData} darkMode={darkMode} />
//                     </div>
//                   </motion.div>
//                 </div>

//                 {/* Activity Timeline */}
//                 <motion.div 
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.2 }}
//                   className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
//                 >
//                   <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//                     <h3 className="flex items-center font-semibold">
//                       <FiActivity className="mr-2" />
//                       Recent Activity
//                     </h3>
//                   </div>
//                   <div className="p-4">
//                     <ActivityTimeline recentActivities={stats.recentActivities} darkMode={darkMode} />
//                   </div>
//                 </motion.div>
//               </div>
//             </div>
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiActivity, 
  FiCalendar, 
  FiBarChart2, 
  FiAward, 
  FiCode,
  FiUser,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiStar,
  FiZap
} from 'react-icons/fi';
import ProfileStats from '../components/ProfileComponents/ProfileStats';
import ActivityTimeline from '../components/ProfileComponents/ActivityTimeline';
import ProblemSolvedChart from '../components/ProfileComponents/ProblemSolvedChart';
import HeatmapCalendar from '../components/ProfileComponents/HeatMapCalender';
import ProfileInfo from '../components/ProfileComponents/ProfileInfo';
import { fetchProfileData } from '../../services/operations/ProfileAPI';
import { useSelector } from 'react-redux';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    user: null,
    stats: null,
    currentStreak: 0,
    loading: true,
    error: null
  });
  const darkmode = useSelector((state) => state.theme.darkMode);
  const [activeTab, setActiveTab] = useState('overview');
  const users = useSelector((state) => state.profile.user);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const response = await fetchProfileData({ userId: users._id, token });
        setProfileData({
          user: response.user,
          stats: response.stats,
          currentStreak: response.currentStreak,
          loading: false,
          error: null
        });
      } catch (err) {
        setProfileData(prev => ({
          ...prev,
          loading: false,
          error: err.message || 'Failed to load profile data'
        }));
      }
    };

    loadProfileData();
  }, [users._id, token]);

  if (profileData.loading) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-screen ${darkmode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className={`rounded-full h-16 w-16 border-t-4 border-b-4 ${darkmode ? 'border-blue-400' : 'border-blue-600'}`}
        ></motion.div>
        <motion.p 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          className={`mt-4 ${darkmode ? 'text-gray-300' : 'text-gray-600'} font-medium`}
        >
          Loading your profile data...
        </motion.p>
      </div>
    );
  }

  if (profileData.error) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-screen ${darkmode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-6 rounded-lg ${darkmode ? 'bg-gray-800' : 'bg-white'} shadow-md max-w-md text-center`}>
          <h2 className={`text-xl font-bold mb-4 ${darkmode ? 'text-red-400' : 'text-red-600'}`}>
            Error Loading Profile
          </h2>
          <p className={`mb-4 ${darkmode ? 'text-gray-300' : 'text-gray-700'}`}>
            {profileData.error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 rounded-md ${darkmode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profileData.user || !profileData.stats) {
    return null;
  }

  const { user, stats, currentStreak } = profileData;

  return (
    <div className={`min-h-screen ${darkmode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-8 px-4 sm:px-6 lg:px-8 mt-16`}>
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, <span className={darkmode ? 'text-blue-400' : 'text-blue-600'}>{user.name || 'Coder'}!</span>
              </h1>
              <p className={`mt-2 ${darkmode ? 'text-gray-400' : 'text-gray-600'}`}>
                Here's your coding journey at a glance
              </p>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className={`flex items-center px-4 py-2 rounded-full ${darkmode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
            >
              <FiUser className={`mr-2 ${darkmode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className="font-medium">{currentStreak} day streak</span>
              <FiZap className={`ml-2 ${darkmode ? 'text-yellow-400' : 'text-yellow-500'}`} />
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ProfileInfo user={user} stats={stats} darkMode={darkmode} />
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className={`rounded-xl p-6 mb-6 ${darkmode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
                >
                  <h3 className="flex items-center text-lg font-semibold mb-4">
                    <FiTrendingUp className="mr-2" />
                    Weekly Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Problems Solved</span>
                        <span className="text-sm">{stats.totalProblemsSolved}/{stats.totalProblemsInDB}</span>
                      </div>
                      <div className={`w-full h-2 rounded-full ${darkmode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-2 rounded-full ${darkmode ? 'bg-blue-400' : 'bg-blue-600'}`} 
                          style={{ width: `${Math.min(100, (stats.totalProblemsSolved / stats.totalProblemsInDB) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Accuracy</span>
                        <span className="text-sm">{stats.accuracy}%</span>
                      </div>
                      <div className={`w-full h-2 rounded-full ${darkmode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-2 rounded-full ${stats.accuracy > 80 ? (darkmode ? 'bg-green-400' : 'bg-green-600') : (darkmode ? 'bg-yellow-400' : 'bg-yellow-500')}`} 
                          style={{ width: `${stats.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium ${darkmode ? 'text-gray-300' : 'text-gray-600'}`}>
                          Active Days
                        </span>
                        <span className={`text-sm font-semibold ${darkmode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {stats.activeDaysInWeek}/7
                        </span>
                      </div>
                      <div className={`w-full h-2 rounded-full ${darkmode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div 
                          className={`h-full rounded-full ${darkmode ? 'bg-purple-400' : 'bg-purple-600'} transition-all duration-300`} 
                          style={{ width: `${(stats.activeDaysInWeek / 7) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className={`rounded-xl p-6 ${darkmode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
                >
                  <h3 className="flex items-center text-lg font-semibold mb-4">
                    <FiCode className="mr-2" />
                    Language Distribution
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(stats.languages || {}).map(([lang, count]) => {
                      const total = Object.values(stats.languages).reduce((a, b) => a + b, 0);
                      const percentage = Math.round((count / total) * 100);
                      return (
                        <div key={lang}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{lang}</span>
                            <span>{percentage}%</span>
                          </div>
                          <div className={`w-full h-2 rounded-full ${darkmode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div 
                              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div 
                      whileHover={{ y: -3 }}
                      className={`rounded-xl p-4 ${darkmode ? 'bg-gray-800' : 'bg-white shadow-sm'} border-l-4 border-blue-500`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${darkmode ? 'bg-blue-900/30' : 'bg-blue-100'} mr-3`}>
                          <FiCheckCircle className={`text-xl ${darkmode ? 'text-blue-400' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <p className={`text-sm ${darkmode ? 'text-gray-400' : 'text-gray-500'}`}>Problems Solved</p>
                          <p className="text-2xl font-bold">{stats.totalProblemsSolved}</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ y: -3 }}
                      className={`rounded-xl p-4 ${darkmode ? 'bg-gray-800' : 'bg-white shadow-sm'} border-l-4 border-green-500`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${darkmode ? 'bg-green-900/30' : 'bg-green-100'} mr-3`}>
                          <FiBarChart2 className={`text-xl ${darkmode ? 'text-green-400' : 'text-green-600'}`} />
                        </div>
                        <div>
                          <p className={`text-sm ${darkmode ? 'text-gray-400' : 'text-gray-500'}`}>Accuracy</p>
                          <p className="text-2xl font-bold">{stats.accuracy}%</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ y: -3 }}
                      className={`rounded-xl p-4 ${darkmode ? 'bg-gray-800' : 'bg-white shadow-sm'} border-l-4 border-purple-500`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${darkmode ? 'bg-purple-900/30' : 'bg-purple-100'} mr-3`}>
                          <FiClock className={`text-xl ${darkmode ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <div>
                          <p className={`text-sm ${darkmode ? 'text-gray-400' : 'text-gray-500'}`}>Current Streak</p>
                          <p className="text-2xl font-bold">{currentStreak} days</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ y: -3 }}
                      className={`rounded-xl p-4 ${darkmode ? 'bg-gray-800' : 'bg-white shadow-sm'} border-l-4 border-yellow-500`}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${darkmode ? 'bg-yellow-900/30' : 'bg-yellow-100'} mr-3`}>
                          <FiStar className={`text-xl ${darkmode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        </div>
                        <div>
                          <p className={`text-sm ${darkmode ? 'text-gray-400' : 'text-gray-500'}`}>Global Rank</p>
                          <p className="text-2xl font-bold">#{stats.rank?.toLocaleString()}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className={`rounded-xl overflow-hidden ${darkmode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
                  >
                    <div className={`p-4 border-b ${darkmode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h3 className="flex items-center font-semibold">
                        <FiBarChart2 className="mr-2" />
                        Problems Solved
                      </h3>
                    </div>
                    <div className="h-72">
                      <ProblemSolvedChart monthlyUniqueProblems={stats.monthlyUniqueProblems} darkMode={darkmode} />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className={`rounded-xl overflow-hidden ${darkmode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
                  >
                    <div className={`p-4 border-b ${darkmode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h3 className="flex items-center font-semibold">
                        <FiCalendar className="mr-2" />
                        Activity Heatmap
                      </h3>
                    </div>
                    <div className="p-4">
                      <HeatmapCalendar submissionData={stats.submissionData} darkMode={darkmode} />
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`rounded-xl overflow-hidden ${darkmode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}
                >
                  <div className={`p-4 border-b ${darkmode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className="flex items-center font-semibold">
                      <FiActivity className="mr-2" />
                      Recent Activity
                    </h3>
                  </div>
                  <div className="p-4">
                    <ActivityTimeline recentActivities={stats.recentActivities} darkMode={darkmode} />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;