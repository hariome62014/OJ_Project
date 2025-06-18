import React from 'react';
import { useSelector } from 'react-redux';
import { FaTrophy, FaUsers, FaChartLine, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} mt-16`}>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto"
        >
          <div className={`p-5 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} mb-6`}>
            <FaTrophy className={`w-12 h-12 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500">
            Leaderboard Coming Soon
          </h1>
          
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            We're building an exciting leaderboard system to showcase top coders and track your progress. Stay tuned for this competitive feature!
          </p>
          
          <div className={`rounded-xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg w-full mb-12`}>
            <div className="flex flex-col md:flex-row justify-around gap-6">
              <div className="flex flex-col items-center">
                <FaUsers className={`w-10 h-10 mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className="text-xl font-bold mb-2">Global Rankings</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Compete with coders worldwide</p>
              </div>
              <div className="flex flex-col items-center">
                <FaChartLine className={`w-10 h-10 mb-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Watch your ranking improve</p>
              </div>
              <div className="flex flex-col items-center">
                <FaClock className={`w-10 h-10 mb-3 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>See your position change</p>
              </div>
            </div>
          </div>
          
          {/* <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900 bg-opacity-30 border border-blue-800' : 'bg-blue-50 border border-blue-200'} flex items-start gap-4 max-w-2xl`}>
            <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-800' : 'bg-blue-100'}`}>
              <FaTrophy className={`w-5 h-5 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
            </div>
            <div>
              <h3 className="font-bold mb-2">Want to be notified when we launch?</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Join our mailing list to get updates about the leaderboard and other exciting features.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'} flex-grow`}
                />
                <button className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-lg transition-all">
                  Notify Me
                </button>
              </div>
            </div>
          </div> */}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;