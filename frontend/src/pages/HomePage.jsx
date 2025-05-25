import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaCode, FaLaptopCode, FaUsers, FaTrophy, FaLightbulb, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HomePage = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const featureCards = [
    {
      icon: <FaLaptopCode className="w-8 h-8" />,
      title: "Solve Problems",
      description: "Challenge yourself with our curated collection of coding problems",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Join Contests",
      description: "Compete with developers worldwide in timed coding competitions",
      color: "from-amber-500 to-pink-500"
    },
    {
      icon: <FaTrophy className="w-8 h-8" />,
      title: "Climb Leaderboard",
      description: "Track your progress and rise through the ranks",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <section className={`relative py-16 ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-purple-900 to-indigo-800' : 'bg-gradient-to-br from-purple-100 to-indigo-100'}`}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center py-16"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className={`inline-flex items-center justify-center p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-4`}>
                <FaCode className={`w-8 h-8 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500"
            >
              Master Coding Through Competition
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className={`text-xl max-w-3xl mb-10 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Join thousands of developers improving their skills by solving problems, competing in contests, and climbing the leaderboard.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/problems" 
                className="px-8 py-4 rounded-lg font-semibold bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Solving Problems
              </Link>
              <Link 
                to="/contests" 
                className={`px-8 py-4 rounded-lg font-semibold ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-all duration-300 transform hover:scale-105`}
              >
                View Upcoming Contests
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CodeJudge?</h2>
            <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Our platform is designed to help you become a better developer through practice and competition.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCards.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                <div className={`inline-flex items-center justify-center p-4 rounded-lg bg-gradient-to-br ${feature.color} text-white mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
                <Link 
                  to={index === 0 ? "/problems" : index === 1 ? "/contests" : "/leaderboard"} 
                  className={`inline-flex items-center font-medium ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-500'}`}
                >
                  Learn more <FaArrowRight className="ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">10,000+</div>
              <div className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Users</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-pink-500">500+</div>
              <div className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Coding Problems</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">50+</div>
              <div className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Contests Monthly</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">1M+</div>
              <div className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Submissions</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`rounded-xl p-8 md:p-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <div className="max-w-4xl mx-auto text-center">
              <FaLightbulb className={`w-12 h-12 mx-auto mb-6 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Challenge Yourself?</h2>
              <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Join our community of passionate developers and take your coding skills to the next level.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/register" 
                  className="px-8 py-4 rounded-lg font-semibold bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Create Free Account
                </Link>
                <Link 
                  to="/problems" 
                  className={`px-8 py-4 rounded-lg font-semibold ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-all duration-300 transform hover:scale-105`}
                >
                  Browse Problems
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;