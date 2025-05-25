import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProfileStats = ({ userStats }) => {
  const difficultyData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [
      {
        data: [
          userStats?.problemsByDifficulty?.easy || 0,
          userStats?.problemsByDifficulty?.medium || 0,
          userStats?.problemsByDifficulty?.hard || 0,
        ],
        backgroundColor: [
          '#4ade80', // Green for easy
          '#fbbf24', // Yellow for medium
          '#f87171', // Red for hard
        ],
        borderWidth: 0,
      },
    ],
  };

  const languageData = {
    labels: Object.keys(userStats?.languages || {}),
    datasets: [
      {
        data: Object.values(userStats?.languages || {}),
        backgroundColor: [
          '#60a5fa', // Blue
          '#34d399', // Emerald
          '#f472b6', // Pink
          '#a78bfa', // Purple
          '#f59e0b', // Amber
        ],
        borderWidth: 0,
      },
    ],
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-4 rounded-lg shadow-md ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Your Coding Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Problems Solved" 
          value={userStats?.totalProblems || 0} 
          icon="💻" 
          color="bg-blue-100 dark:bg-blue-900/50" 
        />
        <StatCard 
          title="Submissions" 
          value={userStats?.totalSubmissions || 0} 
          icon="📝" 
          color="bg-green-100 dark:bg-green-900/50" 
        />
        <StatCard 
          title="Accuracy" 
          value={`${userStats?.accuracy || 0}%`} 
          icon="🎯" 
          color="bg-purple-100 dark:bg-purple-900/50" 
        />
        <StatCard 
          title="Contests" 
          value={userStats?.contestsParticipated || 0} 
          icon="🏆" 
          color="bg-yellow-100 dark:bg-yellow-900/50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="font-medium mb-3">Problems by Difficulty</h3>
          <Doughnut 
            data={difficultyData} 
            options={{ 
              plugins: { 
                legend: { position: 'bottom' } 
              } 
            }} 
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="font-medium mb-3">Languages Used</h3>
          <Doughnut 
            data={languageData} 
            options={{ 
              plugins: { 
                legend: { position: 'bottom' } 
              } 
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;