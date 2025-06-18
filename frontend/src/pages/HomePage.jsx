import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { FaCode, FaRobot, FaLaptopCode, FaUsers, FaTrophy, FaLightbulb, FaArrowRight, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {fetchStats} from '../../services/operations/ProfileAPI'

const HomePage = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewGenerated, setReviewGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false); // New state for loading
  const [stats,setStats] = useState({});


  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchStats());

                        // console.log("Responsedta::",response.payload)


        if (response.payload) {
          setStats({
            totalUsers: response.payload.totalUsersInDB || 0,
            totalProblems: response.payload.totalProblemsInDB || 0,
            totalSubmissions: response.payload.totalSubmissionsInDB || 0
          });
        }

      } catch (error) {
        // console.error("Error fetching stats:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const generateReview = () => {
    setIsGenerating(true); // Disable button and show loading
    // Simulate API call delay
    setTimeout(() => {
      setReviewGenerated(true);
      setIsGenerating(false);
    }, 1000);
  };


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
    },
    {
      icon: <FaRobot className="w-8 h-8" />,
      title: "AI Code Review",
      description: "Get instant AI-powered feedback on your solutions",
      color: "from-blue-500 to-cyan-500",
      action: () => setIsModalOpen(true)
    }
  ];

 

  const closeModal = () => {
    setIsModalOpen(false);
    setReviewGenerated(false);
  };

  // Mock code for the demo
  const mockCode = `function twoSum(nums, target) {
  const map = {};
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.hasOwnProperty(complement)) {
      return [map[complement], i];
    }
    
    map[nums[i]] = i;
  }
  
  return [];
}`;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} ${isModalOpen ? 'overflow-hidden' : ''}`}>
      {/* AI Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/30 bg-opacity-50 backdrop-blur-sm transition-all duration-300"
            onClick={closeModal}
          ></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} z-50`}
          >
            <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <FaRobot className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                AI Code Review
              </h3>
              <button 
                onClick={closeModal}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {!reviewGenerated ? (
                <div>
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold mb-3">Demo Preview</h4>
                    <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      This is a demo of our AI Code Review feature. For the best experience, submit your own solution to any problem.
                    </p>
                    <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} font-mono text-sm overflow-x-auto`}>
                      <pre className={`${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{mockCode}</pre>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={generateReview}
                       disabled={isGenerating}
                      className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                      Generate Mock Review
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-blue-900 bg-opacity-30 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${darkMode ? 'bg-blue-800' : 'bg-blue-100'}`}>
                        <FaRobot className={`w-5 h-5 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <h4 className="font-bold mb-2">AI Code Review Results</h4>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Here's your mock review based on the Two Sum problem solution:
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex items-start gap-3 mb-2">
                        <FaCheck className={`w-5 h-5 mt-1 flex-shrink-0 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                        <div>
                          <h5 className="font-semibold">Correct Approach</h5>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Your solution uses a hash map to store complements, which is optimal for this problem with O(n) time complexity.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex items-start gap-3 mb-2">
                        <FaExclamationTriangle className={`w-5 h-5 mt-1 flex-shrink-0 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <div>
                          <h5 className="font-semibold">Potential Issue</h5>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            There's a syntax error in your code: <code className={`px-1 py-0.5 rounded ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>map[nums[i]]</code> has an extra closing bracket.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <div className="flex items-start gap-3 mb-2">
                        <FaCheck className={`w-5 h-5 mt-1 flex-shrink-0 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <div>
                          <h5 className="font-semibold">Suggestions</h5>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Consider adding input validation and edge case handling (empty array, no solution found).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-yellow-900 bg-opacity-30 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <FaLightbulb className={`w-5 h-5 mt-1 flex-shrink-0 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                        <div>
                          <h5 className="font-semibold">Want a real review?</h5>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Submit your own solution to any problem for personalized feedback!
                          </p>
                        </div>
                      </div>
                      <Link 
                        to="/problems" 
                        onClick={closeModal}
                        className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                      >
                        Browse Problems
                      </Link>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={closeModal}
                      className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg transition-all duration-300"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CodeServ?</h2>
            <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Our platform is designed to help you become a better developer through practice and competition.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
                {feature.action ? (
                  <button
                    onClick={feature.action}
                    className={`inline-flex items-center font-medium ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-500'} cursor-pointer`}
                  >
                    Try it now <FaArrowRight className="ml-2" />
                  </button>
                ) : (
                  <Link 
                    to={
                      index === 0 ? "/problems" : 
                      index === 1 ? "/contests" : 
                      index === 2 ? "/leaderboard" : 
                      "/ai-review"
                    } 
                    className={`inline-flex items-center font-medium ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-500'}`}
                  >
                    Learn more <FaArrowRight className="ml-2" />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="container mx-auto px-4 ">
          <div className="flex justify-center md:grid-cols-4 gap-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">{stats.totalUsers}</div>
              <div className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Active Users</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-pink-500">{stats.totalProblems}</div>
              <div className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Coding Problems</div>
            </motion.div>
          
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="p-6"
            >
              <div className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">{stats.totalSubmissions}</div>
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
