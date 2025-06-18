// import React from 'react';
// import { format } from 'date-fns';

// const ActivityTimeline = ({ recentActivities }) => {
//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
//       <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
//       <div className="space-y-4">
//         {recentActivities?.length > 0 ? (
//           recentActivities.map((activity, index) => (
//             <div key={index} className="flex items-start">
//               <div className="flex flex-col items-center mr-4">
//                 <div className={`w-3 h-3 rounded-full ${
//                   activity.type === 'submission' ? 'bg-blue-500' : 
//                   activity.type === 'contest' ? 'bg-purple-500' : 'bg-green-500'
//                 }`}></div>
//                 {index !== recentActivities.length - 1 && (
//                   <div className="w-px h-10 bg-gray-300 dark:bg-gray-600"></div>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <div className="flex justify-between items-start">
//                   <p className="font-medium">
//                     {activity.type === 'submission' ? 'Solved Problem' : 
//                      activity.type === 'contest' ? 'Joined Contest' : 'Achievement'}
//                   </p>
//                   <span className="text-sm text-gray-500 dark:text-gray-400">
//                     {format(new Date(activity.date), 'MMM d, h:mm a')}
//                   </span>
//                 </div>
//                 <p className="text-gray-700 dark:text-gray-300">
//                   {activity.type === 'submission' ? (
//                     <span>
//                       Solved <span className="font-semibold">{activity.problemTitle}</span> (
//                       <span className={`${
//                         activity.difficulty === 'easy' ? 'text-green-500' :
//                         activity.difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'
//                       }`}>
//                         {activity.difficulty}
//                       </span>)
//                     </span>
//                   ) : activity.type === 'contest' ? (
//                     <span>Participated in <span className="font-semibold">{activity.contestName}</span></span>
//                   ) : (
//                     <span>Earned <span className="font-semibold">{activity.achievementName}</span></span>
//                   )}
//                 </p>
//                 {activity.type === 'submission' && (
//                   <div className="mt-1 flex space-x-2">
//                     {activity.language && (
//                       <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
//                         {activity.language}
//                       </span>
//                     )}
//                     <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
//                       Runtime: {activity.runtime}ms
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ActivityTimeline;



import React from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCode,
  FiAward,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAlertTriangle
} from 'react-icons/fi';

const ActivityTimeline = ({ recentActivities, darkMode }) => {
  const getActivityIcon = (type, status) => {
    if (type !== 'submission') {
      switch (type) {
        case 'contest':
          return <FiTrendingUp className="text-purple-500" size={16} />;
        case 'achievement':
          return <FiAward className="text-yellow-500" size={16} />;
        default:
          return <FiCode className="text-green-500" size={16} />;
      }
    }
    
    // For submissions, show different icons based on status
    switch (status) {
      case 'Accepted':
        return <FiCheckCircle className="text-green-500" size={16} />;
      case 'Wrong Answer':
        return <FiXCircle className="text-red-500" size={16} />;
      case 'Time Limit Exceeded':
      case 'Runtime Error':
        return <FiAlertTriangle className="text-yellow-500" size={16} />;
      default:
        return <FiCode className="text-blue-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'text-green-500';
      case 'Wrong Answer':
        return 'text-red-500';
      case 'Time Limit Exceeded':
      case 'Runtime Error':
        return 'text-yellow-500';
      default:
        return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getDifficultyColor = (difficulty) => {
    return difficulty === 'easy' 
      ? 'text-green-500' 
      : difficulty === 'medium' 
        ? 'text-yellow-500' 
        : 'text-red-500';
  };

  const getActivityTitle = (activity) => {
    if (activity.type === 'submission') {
      return activity.status === 'Accepted' ? 'Solved Problem' : 'Attempted Problem';
    }
    return activity.type === 'contest' ? 'Joined Contest' : 'Achievement';
  };

  return (
    <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6`}>
      <h2 className="text-xl font-bold mb-6 flex items-center">
        <FiClock className="mr-2" />
        Recent Activity
      </h2>
      
      <div className="space-y-6">
        <AnimatePresence>
          {recentActivities?.length > 0 ? (
            recentActivities.map((activity, index) => (
              <motion.div
                key={`${activity.id || index}-${activity.date}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-start"
              >
                <div className="flex flex-col items-center mr-4">
                  <div className={`p-1.5 rounded-full ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {getActivityIcon(activity.type, activity.status)}
                  </div>
                  {index !== recentActivities.length - 1 && (
                    <div className={`w-px h-12 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className={`flex items-center text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {getActivityTitle(activity)}
                    </div>
                    <span className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {format(new Date(activity.date), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  
                  <p className={`mt-1 text-sm ${
                    darkMode ? 'text-gray-200' : 'text-gray-600'
                  }`}>
                    {activity.type === 'submission' ? (
                      <span>
                        {activity.status === 'Accepted' ? 'Solved' : 'Attempted'} <span className="font-semibold">{activity.problemTitle}</span> (
                        <span className={getDifficultyColor(activity.difficulty)}>
                          {activity.difficulty}
                        </span>)
                      </span>
                    ) : activity.type === 'contest' ? (
                      <span>Participated in <span className="font-semibold">{activity.contestName}</span></span>
                    ) : (
                      <span>Earned <span className="font-semibold">{activity.achievementName}</span></span>
                    )}
                  </p>
                  
                  {activity.type === 'submission' && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {activity.language && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {activity.language}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      } ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                      {/* {activity.runtime && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-gray-700 text-purple-400' : 'bg-purple-100 text-purple-800'
                        }`}>
                          Runtime: {activity.runtime.toFixed(2)}ms
                        </span>
                      )}
                      {activity.memory && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-gray-700 text-green-400' : 'bg-green-100 text-green-800'
                        }`}>
                          Memory: {activity.memory.toFixed(2)}MB
                        </span>
                      )} */}
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`text-center py-8 ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              No recent activity to display
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActivityTimeline;