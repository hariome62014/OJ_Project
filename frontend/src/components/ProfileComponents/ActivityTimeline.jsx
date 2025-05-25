import React from 'react';
import { format } from 'date-fns';

const ActivityTimeline = ({ recentActivities }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {recentActivities?.length > 0 ? (
          recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <div className={`w-3 h-3 rounded-full ${
                  activity.type === 'submission' ? 'bg-blue-500' : 
                  activity.type === 'contest' ? 'bg-purple-500' : 'bg-green-500'
                }`}></div>
                {index !== recentActivities.length - 1 && (
                  <div className="w-px h-10 bg-gray-300 dark:bg-gray-600"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-medium">
                    {activity.type === 'submission' ? 'Solved Problem' : 
                     activity.type === 'contest' ? 'Joined Contest' : 'Achievement'}
                  </p>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(activity.date), 'MMM d, h:mm a')}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  {activity.type === 'submission' ? (
                    <span>
                      Solved <span className="font-semibold">{activity.problemTitle}</span> (
                      <span className={`${
                        activity.difficulty === 'easy' ? 'text-green-500' :
                        activity.difficulty === 'medium' ? 'text-yellow-500' : 'text-red-500'
                      }`}>
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
                  <div className="mt-1 flex space-x-2">
                    {activity.language && (
                      <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                        {activity.language}
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      Runtime: {activity.runtime}ms
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;