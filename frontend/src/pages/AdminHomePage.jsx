import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaCode, 
  FaUsers, 
  FaChartLine, 
  FaDatabase, 
  FaCog,
  FaTrophy,
  FaFileAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminHomePage = () => {
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

  const adminCards = [
    {
      icon: <FaCode className="w-6 h-6" />,
      title: "Problems",
      description: "Manage coding problems, test cases, and categories",
      link: "/admin-problem-list",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <FaUsers className="w-6 h-6" />,
      title: "Users",
      description: "View and manage user accounts and progress",
      link: "/admin/users",
      color: "from-amber-500 to-pink-500"
    },
    {
      icon: <FaTrophy className="w-6 h-6" />,
      title: "Contests",
      description: "Create and manage coding competitions",
      link: "/admin/contests",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <FaChartLine className="w-6 h-6" />,
      title: "Analytics",
      description: "View platform usage and performance metrics",
      link: "/admin/analytics",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaDatabase className="w-6 h-6" />,
      title: "Test Cases",
      description: "Manage test cases for all problems",
      link: "/admin/testcases",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: <FaFileAlt className="w-6 h-6" />,
      title: "Submissions",
      description: "Review user submissions and solutions",
      link: "/admin/submissions",
      color: "from-green-500 to-lime-500"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header Section */}
      <header className={`relative py-12 ${darkMode ? 'bg-gray-800' : 'bg-white'} overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-purple-900 to-indigo-800' : 'bg-gradient-to-br from-purple-100 to-indigo-100'}`}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center py-8"
          >
            <motion.div variants={itemVariants} className="mb-6">
              <div className={`inline-flex items-center justify-center p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-4`}>
                <FaCog className={`w-8 h-8 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-500"
            >
              Admin Dashboard
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className={`text-xl max-w-3xl mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Manage the platform, track performance, and ensure smooth operation of the coding judge.
            </motion.p>
          </motion.div>
        </div>
      </header>

      {/* Quick Stats Section */}
      <section className={`py-12 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
              <div className="text-3xl font-bold mb-2 text-purple-500">1,245</div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Problems</div>
            </div>
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
              <div className="text-3xl font-bold mb-2 text-amber-500">10,892</div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Users</div>
            </div>
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
              <div className="text-3xl font-bold mb-2 text-emerald-500">756</div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Today's Submissions</div>
            </div>
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
              <div className="text-3xl font-bold mb-2 text-blue-500">24</div>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Contests</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Admin Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Administration Tools</h2>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage all aspects of the coding platform from one centralized dashboard
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminCards.map((card, index) => (
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
                    Go to {card.title} →
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          >
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} flex items-center`}>
                  <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} mr-4`}>
                    <FaCode className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} />
                  </div>
                  <div>
                    <p className="font-medium">New problem added: "Graph Traversal"</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>2 hours ago by Admin</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link 
                to="/admin/activity" 
                className={`inline-flex items-center font-medium ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-500'}`}
              >
                View all activity →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AdminHomePage;