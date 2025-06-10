const Submission = require('../shared/models/Submission');

exports.getUserProblemSubmissions = async (req, res) => {
  try {
    // console.log("Reached getUserProblemSubmissions...",req.body)
    // const { userId, problemId } = req.params;
     const {problemId} = req.body; // From the parent router
    const userId = req.params.userId;
    // console.log("userId, problemId",userId, problemId)

    const submissions = await Submission.find({
      userId,
      problemId
    })
    .sort({ createdAt: -1 }) // Sort by most recent first
   
    .lean();

    // console.log("Submissions",submissions);

    const formattedSubmissions = submissions.map(sub => ({
      id: sub._id,
      date: sub.createdAt,
      status: sub.status,
      runtime: `${sub.overallRuntime.toFixed(2)} s`,
      language: sub.language,
      score: sub.score,
      results: sub.results
    }));

    // console.log("formattedSubmissions",formattedSubmissions);

    res.json(formattedSubmissions);
  } catch (error) {
    console.error('Error fetching user submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions'
    });
  }
};