import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaCode, 
  FaTrophy, 
  FaChartLine, 
  FaUsers,
  FaBook,
  FaLightbulb
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const LearnerHomePage = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { user } = useSelector((state) => state.auth);

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
      icon: <FaCode className="w-6 h-6" />,
      title: "Practice Problems",
      description: "Solve problems to improve your coding skills",
      link: "/problems",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <FaTrophy className="w-6 h-6" />,
      title: "Join Contests",
      description: "Compete with other learners in coding challenges",
      link: "/contests",
      color: "from-amber-500 to-pink-500"
    },
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed analytics",
      link: "/profile",
      color: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Hero Section */}
      <section className={`relative py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
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
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500"
            >
              Welcome back, {user?.name || 'Coder'}!
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className={`text-xl max-w-3xl mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Continue your coding journey with personalized recommendations.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/problems" 
                className="px-8 py-4 rounded-lg font-semibold bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Continue Practicing
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Your Learning Hub</h2>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything you need to become a better programmer
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link 
                  to={card.link}
                  className={`block h-full rounded-xl p-6 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow-md hover:shadow-lg transition-all duration-300`}
                >
                  <div className={`inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-br ${card.color} text-white mb-4`}>
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{card.description}</p>
                  <div className={`text-sm font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`}>
                    Explore →
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LearnerHomePage;