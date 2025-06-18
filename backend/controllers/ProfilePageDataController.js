// const User = require('../shared/models/User');
// const Submission = require('../shared/models/Submission');
// const Problem = require('../shared/models/Problem');

// const profileController = {
//   getUserStats: async (req, res) => {
//     try {
//       const userId = req.user.id;

//       // Get user basic info
//       const user = await User.findById(userId)
//         .populate('solvedProblems', 'title difficulty')
//         .lean();

//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       // Get all submissions for the user
//       const submissions = await Submission.find({ userId })
//         .sort({ createdAt: -1 })
//         .populate('problemId', 'title difficulty')
//         .lean();

//       // Calculate rank based on problems solved
//       const totalProblemsSolved = user.solvedProblems?.length || 0;
      
//       // Get all users with their solvedProblems count to calculate rank
//       const allUsers = await User.find({}, '_id solvedProblems')
//         .lean();
      
//       // Create array of users with their solvedProblems count
//       const usersWithCounts = allUsers.map(u => ({
//         userId: u._id,
//         solvedCount: u.solvedProblems?.length || 0
//       }));
      
//       // Sort users by problems solved (descending)
//       usersWithCounts.sort((a, b) => b.solvedCount - a.solvedCount);
      
//       // Find the current user's rank
//       let rank = 1;
//       for (let i = 0; i < usersWithCounts.length; i++) {
//         if (usersWithCounts[i].userId.toString() === userId.toString()) {
//           break;
//         }
//         rank++;
//       }

//       // Calculate stats
//       const totalSubmissions = submissions.length;
//       const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted');
//       const accuracy = totalSubmissions > 0 
//         ? Math.round((acceptedSubmissions.length / totalSubmissions) * 100) 
//         : 0;

//       // Group by language
//       const languages = {};
//       submissions.forEach(sub => {
//         languages[sub.language] = (languages[sub.language] || 0) + 1;
//       });

//       // Group by difficulty
//       const problemsByDifficulty = { easy: 0, medium: 0, hard: 0 };
//       acceptedSubmissions.forEach(sub => {
//         if (sub.problemId && sub.problemId.difficulty) {
//           const diff = sub.problemId.difficulty.toLowerCase();
//           if (problemsByDifficulty.hasOwnProperty(diff)) {
//             problemsByDifficulty[diff]++;
//           }
//         }
//       });

//       // Calculate streak (simplified version)
//       let currentStreak = 0;
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       let checkDate = new Date(today);
//       while (true) {
//         const hasSubmission = submissions.some(s => {
//           const subDate = new Date(s.createdAt);
//           subDate.setHours(0, 0, 0, 0);
//           return subDate.getTime() === checkDate.getTime();
//         });
        
//         if (hasSubmission) {
//           currentStreak++;
//           checkDate.setDate(checkDate.getDate() - 1);
//         } else {
//           break;
//         }
//       }

//       // Generate submission heatmap data (last 365 days)
//       const submissionData = [];
//       const dateCounts = {};
      
//       submissions.forEach(sub => {
//         const dateStr = sub.createdAt.toISOString().split('T')[0];
//         dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
//       });
      
//       for (let i = 0; i < 365; i++) {
//         const date = new Date();
//         date.setDate(date.getDate() - (364 - i));
//         const dateStr = date.toISOString().split('T')[0];
//         submissionData.push({
//           date: dateStr,
//           count: dateCounts[dateStr] || 0
//         });
//       }

//       // Generate solved problems chart data (last 6 months)
//       const solvedData = {
//         labels: [],
//         values: []
//       };
      
//       const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//       const now = new Date();
      
//       for (let i = 6; i >= 0; i--) {
//         const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
//         const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
//         solvedData.labels.push(monthNames[monthDate.getMonth()]);
        
//         const count = acceptedSubmissions.filter(sub => {
//           const subDate = new Date(sub.createdAt);
//           return subDate.getFullYear() === monthDate.getFullYear() && 
//                  subDate.getMonth() === monthDate.getMonth();
//         }).length;
        
//         solvedData.values.push(count);
//       }

//       // Prepare recent activities (last 10 submissions)
//       const recentActivities = submissions.slice(0, 10).map(sub => ({
//         type: 'submission',
//         date: sub.createdAt.toISOString(),
//         problemTitle: sub.problemId?.title || 'Unknown Problem',
//         difficulty: sub.problemId?.difficulty || 'unknown',
//         language: sub.language,
//         runtime: sub.overallRuntime,
//         status: sub.status,
//         memory: sub.overallMemory
//       }));

//       const stats = {
//         totalProblemsSolved: totalProblemsSolved,
//         totalSubmissions: totalSubmissions,
//         accuracy: accuracy,
//         contestsParticipated: 0,
//         rank: rank,
//         streak: currentStreak,
//         problemsByDifficulty,
//         languages,
//         solvedData,
//         submissionData,
//         recentActivities
//       };

//       res.json({
//         user,
//         stats
//       });

//     } catch (error) {
//       console.error('Error fetching user stats:', error);
//       res.status(500).json({ message: 'Server error while fetching profile data' });
//     }
//   }
// };

// module.exports = profileController;


const User = require('../shared/models/User');
const Submission = require('../shared/models/Submission');
const Problem = require('../shared/models/Problem');

const {uploadImageToCloudinary} = require('../utils/imageUploader')

const profileController = {
  getUserStats: async (req, res) => {
    try {
      const userId = req.user.id;

      // Get user basic info
      const user = await User.findById(userId)
        .populate('solvedProblems', 'title difficulty')
        .lean();

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Get all submissions for the user
      const submissions = await Submission.find({ userId })
        .sort({ createdAt: -1 })
        .populate('problemId', 'title difficulty')
        .lean();

      // Get total number of problems in the database
      const totalProblemsInDB = await Problem.countDocuments();
      const totalUsersInDB  = await User.countDocuments();
      const totalSubmissionsInDB  = await Submission.countDocuments();

      // Calculate rank based on problems solved
      const totalProblemsSolved = user.solvedProblems?.length || 0;
      
      // Get all users with their solvedProblems count to calculate rank
      const allUsers = await User.find({}, '_id solvedProblems')
        .lean();
      
      // Create array of users with their solvedProblems count
      const usersWithCounts = allUsers.map(u => ({
        userId: u._id,
        solvedCount: u.solvedProblems?.length || 0
      }));
      
      // Sort users by problems solved (descending)
      usersWithCounts.sort((a, b) => b.solvedCount - a.solvedCount);
      
      // Find the current user's rank
      let rank = 1;
      for (let i = 0; i < usersWithCounts.length; i++) {
        if (usersWithCounts[i].userId.toString() === userId.toString()) {
          break;
        }
        rank++;
      }

      // Calculate stats
      const totalSubmissions = submissions.length;
      const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted');
      const accuracy = totalSubmissions > 0 
        ? Math.round((acceptedSubmissions.length / totalSubmissions) * 100) 
        : 0;

      // Group by language
      const languages = {};
      submissions.forEach(sub => {
        languages[sub.language] = (languages[sub.language] || 0) + 1;
      });

      // Group by difficulty
      const problemsByDifficulty = { easy: 0, medium: 0, hard: 0 };
      acceptedSubmissions.forEach(sub => {
        if (sub.problemId && sub.problemId.difficulty) {
          const diff = sub.problemId.difficulty.toLowerCase();
          if (problemsByDifficulty.hasOwnProperty(diff)) {
            problemsByDifficulty[diff]++;
          }
        }
      });

      // Calculate streak (simplified version)
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let checkDate = new Date(today);
      while (true) {
        const hasSubmission = submissions.some(s => {
          const subDate = new Date(s.createdAt);
          subDate.setHours(0, 0, 0, 0);
          return subDate.getTime() === checkDate.getTime();
        });
        
        if (hasSubmission) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Calculate active days in the current week (Sunday to Saturday)
      const now = new Date();
      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(now.getDate() - now.getDay()); // Sunday
      currentWeekStart.setHours(0, 0, 0, 0);
      
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // Saturday
      currentWeekEnd.setHours(23, 59, 59, 999);

      const weeklySubmissions = submissions.filter(sub => {
        const subDate = new Date(sub.createdAt);
        return subDate >= currentWeekStart && subDate <= currentWeekEnd;
      });

      const activeDaysInWeek = new Set(
        weeklySubmissions.map(sub => {
          const subDate = new Date(sub.createdAt);
          return subDate.getDay(); // 0 (Sunday) to 6 (Saturday)
        })
      ).size;

      // Calculate unique problems solved in each month
      const monthlyUniqueProblems = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Initialize for last 6 months
      for (let i = 6; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
        monthlyUniqueProblems[monthKey] = {
          monthName: monthNames[monthDate.getMonth()],
          year: monthDate.getFullYear(),
          uniqueProblems: new Set()
        };
      }

      // Track unique problems per month
      acceptedSubmissions.forEach(sub => {
        if (sub.problemId) {
          const subDate = new Date(sub.createdAt);
          const monthKey = `${subDate.getFullYear()}-${subDate.getMonth()}`;
          
          if (monthlyUniqueProblems[monthKey]) {
            monthlyUniqueProblems[monthKey].uniqueProblems.add(sub.problemId._id.toString());
          }
        }
      });

      // Convert to array format for easier consumption
      const monthlyUniqueProblemsData = Object.values(monthlyUniqueProblems).map(month => ({
        month: month.monthName,
        year: month.year,
        count: month.uniqueProblems.size
      }));

      // Generate submission heatmap data (last 365 days)
      const submissionData = [];
      const dateCounts = {};
      
      submissions.forEach(sub => {
        const dateStr = sub.createdAt.toISOString().split('T')[0];
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
      });
      
      for (let i = 0; i < 365; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (364 - i));
        const dateStr = date.toISOString().split('T')[0];
        submissionData.push({
          date: dateStr,
          count: dateCounts[dateStr] || 0
        });
      }

      // Generate solved problems chart data (last 6 months)
      const solvedData = {
        labels: [],
        values: []
      };
      
      for (let i = 6; i >= 0; i--) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth()}`;
        solvedData.labels.push(monthNames[monthDate.getMonth()]);
        
        const count = acceptedSubmissions.filter(sub => {
          const subDate = new Date(sub.createdAt);
          return subDate.getFullYear() === monthDate.getFullYear() && 
                 subDate.getMonth() === monthDate.getMonth();
        }).length;
        
        solvedData.values.push(count);
      }

      // Prepare recent activities (last 10 submissions)
      const recentActivities = submissions.slice(0, 10).map(sub => ({
        type: 'submission',
        date: sub.createdAt.toISOString(),
        problemTitle: sub.problemId?.title || 'Unknown Problem',
        difficulty: sub.problemId?.difficulty || 'unknown',
        language: sub.language,
        runtime: sub.overallRuntime,
        status: sub.status,
        memory: sub.overallMemory
      }));

      const stats = {
        totalProblemsSolved: totalProblemsSolved,
        totalSubmissions: totalSubmissions,
        accuracy: accuracy,
        contestsParticipated: 0,
        rank: rank,
        streak: currentStreak,
        problemsByDifficulty,
        languages,
        solvedData,
        submissionData,
        recentActivities,
        // New stats added
        activeDaysInWeek: activeDaysInWeek,
        totalProblemsInDB: totalProblemsInDB,
        monthlyUniqueProblems: monthlyUniqueProblemsData,
        totalSubmissionsInDB:totalSubmissionsInDB,
        totalUsersInDB:totalUsersInDB
      };

      res.json({
        user,
        stats
      });

    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ message: 'Server error while fetching profile data' });
    }
  },


  getStats: async (req, res) => {
    try {
      
      const totalProblemsInDB = await Problem.countDocuments();
      const totalUsersInDB  = await User.countDocuments();
      const totalSubmissionsInDB  = await Submission.countDocuments();

     

      

      res.json({
       totalProblemsInDB:totalProblemsInDB,
       totalUsersInDB:totalUsersInDB,
       totalSubmissionsInDB:totalSubmissionsInDB
      });

    } catch (error) {
      console.error('Error fetching  stats:', error);
      res.status(500).json({ message: 'Server error while fetching stats data' });
    }
  },

 updateDisplayPicture : async (req, res) => {
    try {
      // console.group("Req Files",req.file)
       if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded or incorrect field name (use 'displayPicture')",
      });
    }
      const displayPicture = req.file.buffer
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        image: image.secure_url,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
}

};

module.exports = profileController;