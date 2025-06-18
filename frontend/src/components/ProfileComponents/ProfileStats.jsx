// import React from 'react';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const ProfileStats = ({ userStats }) => {
//   const difficultyData = {
//     labels: ['Easy', 'Medium', 'Hard'],
//     datasets: [
//       {
//         data: [
//           userStats?.problemsByDifficulty?.easy || 0,
//           userStats?.problemsByDifficulty?.medium || 0,
//           userStats?.problemsByDifficulty?.hard || 0,
//         ],
//         backgroundColor: [
//           '#4ade80', // Green for easy
//           '#fbbf24', // Yellow for medium
//           '#f87171', // Red for hard
//         ],
//         borderWidth: 0,
//       },
//     ],
//   };

//   const languageData = {
//     labels: Object.keys(userStats?.languages || {}),
//     datasets: [
//       {
//         data: Object.values(userStats?.languages || {}),
//         backgroundColor: [
//           '#60a5fa', // Blue
//           '#34d399', // Emerald
//           '#f472b6', // Pink
//           '#a78bfa', // Purple
//           '#f59e0b', // Amber
//         ],
//         borderWidth: 0,
//       },
//     ],
//   };

//   const StatCard = ({ title, value, icon, color }) => (
//     <div className={`p-4 rounded-lg shadow-md ${color}`}>
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium opacity-80">{title}</p>
//           <p className="text-2xl font-bold">{value}</p>
//         </div>
//         <div className="text-3xl">{icon}</div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-bold">Your Coding Statistics</h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard 
//           title="Problems Solved" 
//           value={userStats?.totalProblems || 0} 
//           icon="💻" 
//           color="bg-blue-100 dark:bg-blue-900/50" 
//         />
//         <StatCard 
//           title="Submissions" 
//           value={userStats?.totalSubmissions || 0} 
//           icon="📝" 
//           color="bg-green-100 dark:bg-green-900/50" 
//         />
//         <StatCard 
//           title="Accuracy" 
//           value={`${userStats?.accuracy || 0}%`} 
//           icon="🎯" 
//           color="bg-purple-100 dark:bg-purple-900/50" 
//         />
//         <StatCard 
//           title="Contests" 
//           value={userStats?.contestsParticipated || 0} 
//           icon="🏆" 
//           color="bg-yellow-100 dark:bg-yellow-900/50" 
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
//           <h3 className="font-medium mb-3">Problems by Difficulty</h3>
//           <Doughnut 
//             data={difficultyData} 
//             options={{ 
//               plugins: { 
//                 legend: { position: 'bottom' } 
//               } 
//             }} 
//           />
//         </div>
        
//         <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
//           <h3 className="font-medium mb-3">Languages Used</h3>
//           <Doughnut 
//             data={languageData} 
//             options={{ 
//               plugins: { 
//                 legend: { position: 'bottom' } 
//               } 
//             }} 
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileStats;


import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useSelector } from 'react-redux';
import {
  FiCheckCircle,
  FiCode,
  FiBarChart2,
  FiAward,
  FiClock,
  FiTrendingUp
} from 'react-icons/fi';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProfileStats = ({ darkMode }) => {
  const { stats } = useSelector((state) => state.profile);
  
  // Default values if stats are not loaded yet
  const difficultyData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [
          stats?.problemsByDifficulty?.easy || 0,
          stats?.problemsByDifficulty?.medium || 0,
          stats?.problemsByDifficulty?.hard || 0,
        ],
        backgroundColor: [
          '#4ade80', // Green for easy
          '#fbbf24', // Yellow for medium
          '#f87171', // Red for hard
        ],
        borderColor: darkMode ? '#1f2937' : '#f3f4f6',
        borderWidth: 1,
        hoverOffset: 10
      },
    ],
  };

  const languageData = {
    labels: stats?.languages ? Object.keys(stats.languages) : [],
    datasets: [
      {
        data: stats?.languages ? Object.values(stats.languages) : [],
        backgroundColor: [
          '#60a5fa', // Blue
          '#34d399', // Emerald
          '#f472b6', // Pink
          '#a78bfa', // Purple
          '#f59e0b', // Amber
          '#f97316', // Orange
        ],
        borderColor: darkMode ? '#1f2937' : '#f3f4f6',
        borderWidth: 1,
        hoverOffset: 10
      },
    ],
  };

  const StatCard = ({ title, value, icon, color, iconColor }) => (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md border-l-4 ${color} transition-all hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          {React.cloneElement(icon, { 
            className: `text-xl ${iconColor}`,
            size: 20
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Coding Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Problems Solved" 
          value={stats?.totalProblems || 0}
          icon={<FiCheckCircle />}
          color="border-blue-500"
          iconColor={darkMode ? 'text-blue-400' : 'text-blue-600'}
        />
        <StatCard 
          title="Accuracy" 
          value={`${stats?.accuracy || 0}%`}
          icon={<FiTrendingUp />}
          color="border-green-500"
          iconColor={darkMode ? 'text-green-400' : 'text-green-600'}
        />
        <StatCard 
          title="Current Streak" 
          value={`${stats?.streak || 0} days`}
          icon={<FiClock />}
          color="border-purple-500"
          iconColor={darkMode ? 'text-purple-400' : 'text-purple-600'}
        />
        <StatCard 
          title="Global Rank" 
          value={`#${stats?.rank ? stats.rank.toLocaleString() : 'N/A'}`}
          icon={<FiAward />}
          color="border-yellow-500"
          iconColor={darkMode ? 'text-yellow-400' : 'text-yellow-600'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <h3 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Problems by Difficulty</h3>
          <div className="h-64">
            <Doughnut 
              data={difficultyData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    position: 'bottom',
                    labels: {
                      color: darkMode ? '#e5e7eb' : '#374151',
                      font: {
                        size: 12
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    titleColor: darkMode ? '#e5e7eb' : '#111827',
                    bodyColor: darkMode ? '#d1d5db' : '#4b5563',
                    borderColor: darkMode ? '#374151' : '#d1d5db',
                    borderWidth: 1
                  }
                } 
              }} 
            />
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <h3 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Languages Used</h3>
          <div className="h-64">
            <Doughnut 
              data={languageData} 
              options={{ 
                maintainAspectRatio: false,
                plugins: { 
                  legend: { 
                    position: 'bottom',
                    labels: {
                      color: darkMode ? '#e5e7eb' : '#374151',
                      font: {
                        size: 12
                      }
                    }
                  },
                  tooltip: {
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    titleColor: darkMode ? '#e5e7eb' : '#111827',
                    bodyColor: darkMode ? '#d1d5db' : '#4b5563',
                    borderColor: darkMode ? '#374151' : '#d1d5db',
                    borderWidth: 1
                  }
                } 
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;