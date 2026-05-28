import Interview from "../models/Interview.js";

export const getInterviewHistory = async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const interviews = await Interview.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('transcript clarityScore overallScore createdAt question duration')
      .lean();

    const total = await Interview.countDocuments();

    res.json({
      success: true,
      data: {
        interviews,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: interviews.length,
          totalRecords: total
        }
      }
    });

  } catch (error) {
    console.error("History fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch interview history"
    });
  }
};
