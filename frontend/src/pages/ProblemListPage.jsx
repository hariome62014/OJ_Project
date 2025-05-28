import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaCheckCircle,
  FaLock,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { fetchProblems } from '../../services/operations/ProblemAPI';

const ProblemsPage = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();
 const { 
  problem, 
  loading,  // Changed from 'status' to 'loading' to match your slice
  error, 
  pagination 
} = useSelector((state) => state.problem); // Changed from 'problems' to 'problem'
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: [],
    status: [],
    category: []
  });
  const [sortOption, setSortOption] = useState('recent');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProblems({
      page: pagination.currentPage || 1,
      limit: pagination.pageSize || 10,
      difficulty: filters.difficulty.join(','),
      search: searchTerm
    }));
    console.log("Problems",problem)
  }, [dispatch, pagination.currentPage, pagination.pageSize, filters.difficulty, searchTerm]);

  // Transform the data from the API format to the format your UI expects
 const transformProblemData = (problem) => {
  console.log("problem.solved", problem);
  return {
    id: problem._id,
    title: problem.title,
    difficulty: problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1),
    category: problem.tags?.join(', ') || 'Unknown', // Show all tags joined by comma
    tags: problem.tags || [], // Keep original tags array if needed
    acceptance: '72%', // Calculate this from your data
    solved: problem.solved, // Get this from user data
    premium: !problem.isPublished,
    frequency: 0.5 // Calculate this based on usage data
  };
};

  // Filter and sort problems
 const filteredProblems = (Array.isArray(problem) ? problem : [])
  .map(transformProblemData)
  .filter(Boolean) // Remove null entries (if transform returns null)
  .filter(problem => {
    const searchLower = searchTerm.toLowerCase();
    const difficultyLower = problem.difficulty.toLowerCase();
    const titleLower = problem.title.toLowerCase();

    const matchesSearch = titleLower.includes(searchLower);
    const matchesDifficulty = filters.difficulty.length === 0 || 
      filters.difficulty.some(d => d.toLowerCase() === difficultyLower);
    const matchesStatus = filters.status.length === 0 || 
      (filters.status.includes('solved') && problem.solved) ||
      (filters.status.includes('unsolved') && !problem.solved);

    return matchesSearch && matchesDifficulty && matchesStatus;
  })
  .sort((a, b) => {
    switch(sortOption) {
      case 'acceptance': 
        return parseFloat(b.acceptance) - parseFloat(a.acceptance);
      case 'difficulty': 
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'frequency': 
        return b.frequency - a.frequency;
      default: 
        return (new Date(b.createdAt) - new Date(a.createdAt)); // Fallback: sort by date
    }
  });

  const toggleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value) 
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handlePageSizeChange = (e) => {
    dispatch(setPageSize(Number(e.target.value)));
  };

  if (loading === 'loading' && !problems.length) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} mt-16 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading problems...</p>
        </div>
      </div>
    );
  }

  if (loading === 'failed') {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} mt-16 flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-red-500">Error: {error}</p>
          <button 
            onClick={() => dispatch(fetchProblems({
              page: 1,
              limit: pagination.pageSize || 10
            }))}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} mt-16`}>
      {/* Header Section */}
      <div className={`py-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl md:text-3xl font-bold">Problem Set</h1>
            <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Practice coding problems to improve your skills
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4 flex justify-between items-center">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
          >
            {mobileFiltersOpen ? <FaTimes /> : <FaBars />}
            Filters
          </button>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          {(mobileFiltersOpen || window.innerWidth >= 768) && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`w-full md:w-64 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}
            >
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <FaFilter /> Filters
              </h3>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Difficulty</h4>
                {['Easy', 'Medium', 'Hard'].map(diff => (
                  <label key={diff} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={filters.difficulty.includes(diff)}
                      onChange={() => toggleFilter('difficulty', diff)}
                      className="mr-2"
                    />
                    {diff}
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Status</h4>
                {['solved', 'unsolved'].map(status => (
                  <label key={status} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => toggleFilter('status', status)}
                      className="mr-2"
                    />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </label>
                ))}
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Items per page</h4>
                <select
                  value={pagination.pageSize}
                  onChange={handlePageSizeChange}
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                >
                  {[10, 20, 30, 50].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Sort By</h4>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className={`w-full p-2 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                >
                  <option value="recent">Most Recent</option>
                  <option value="acceptance">Acceptance Rate</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="frequency">Frequency</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* Problems List */}
          <div className="flex-1">
            {/* Search Bar - Desktop */}
            <div className="hidden md:block mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>

            {/* Problems Table */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`rounded-xl overflow-hidden shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase">Title</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase hidden sm:table-cell">Difficulty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase hidden md:table-cell">Tags</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase hidden lg:table-cell">Acceptance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredProblems.length > 0 ? (
                      filteredProblems.map((problem, index) => (
                        <motion.tr
                          key={problem.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            {problem.solved ? (
                              <FaCheckCircle className="text-green-500" />
                            ) : problem.premium ? (
                              <FaLock className="text-yellow-500" />
                            ) : null}
                          </td>
                          <td className="px-4 py-4">
                            <Link 
                              to={`/problems/${problem.id}`} 
                              className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                            >
                              <div className="flex flex-col">
                                <span>{problem.title}</span>
                                <span className="text-xs md:hidden">
                                  <span className={`px-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                                    problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  }`}>
                                    {problem.difficulty}
                                  </span>
                                </span>
                              </div>
                            </Link>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                              {problem.difficulty}
                            </span>
                          </td>
                         <td className="px-4 py-4 whitespace-nowrap text-sm hidden md:table-cell">
  <div className="flex flex-wrap gap-1">
    {problem.tags?.map(tag => (
      <span 
        key={tag} 
        className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700"
      >
        {tag}
      </span>
    ))}
  </div>
</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm hidden lg:table-cell">
                            {problem.acceptance}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          No problems found matching your criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className={`mt-4 flex flex-col sm:flex-row justify-between items-center p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
                <div className="mb-2 sm:mb-0">
                  <span className="text-sm">
                    Showing {(pagination.currentPage - 1) * pagination.pageSize + 1} to{' '}
                    {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of{' '}
                    {pagination.totalItems} problems
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`p-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${
                      pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FaChevronLeft />
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded ${
                          pagination.currentPage === pageNum
                            ? darkMode
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-500 text-white'
                            : darkMode
                              ? 'bg-gray-700 hover:bg-gray-600'
                              : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                    <span className="px-2">...</span>
                  )}
                  
                  {pagination.totalPages > 5 && pagination.currentPage < pagination.totalPages - 2 && (
                    <button
                      onClick={() => handlePageChange(pagination.totalPages)}
                      className={`w-10 h-10 rounded ${
                        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {pagination.totalPages}
                    </button>
                  )}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`p-2 rounded ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} ${
                      pagination.currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;