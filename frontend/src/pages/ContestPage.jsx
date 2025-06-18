import React from 'react';
import { useSelector } from 'react-redux';
import { FaCalendarAlt, FaMedal, FaLaptopCode, FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Contests = () => {
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
            <FaCalendarAlt className={`w-12 h-12 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-pink-500">
            Coding Contests Coming Soon
          </h1>
          
          <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            We're preparing thrilling coding competitions to test your skills against developers worldwide. Get ready to compete!
          </p>
          
          <div className={`rounded-xl p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg w-full mb-12`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full ${darkMode ? 'bg-red-900' : 'bg-red-100'}`}>
                    <FaLaptopCode className={`w-6 h-6 ${darkMode ? 'text-red-300' : 'text-red-600'}`} />
                  </div>
                  <h3 className="text-xl font-bold">Timed Challenges</h3>
                </div>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Solve problems against the clock in our upcoming timed competitions.
                </p>
              </div>
              
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-full ${darkMode ? 'bg-amber-900' : 'bg-amber-100'}`}>
                    <FaMedal className={`w-6 h-6 ${darkMode ? 'text-amber-300' : 'text-amber-600'}`} />
                  </div>
                  <h3 className="text-xl font-bold">Win Prizes</h3>
                </div>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Top performers will earn recognition and exciting rewards.
                </p>
              </div>
            </div>
          </div>
          
          
        </motion.div>
      </div>
    </div>
  );
};

export default Contests;