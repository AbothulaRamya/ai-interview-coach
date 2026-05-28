import mongoose from "mongoose";
import Interview from "../models/Interview.js";

export const getInterviewHistory = async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('📝 MongoDB not connected, returning demo data');
      return res.json({
        success: true,
        interviews: [
          {
            _id: 'demo-1',
            overallScore: 85,
            clarityScore: 88,
            createdAt: new Date(Date.now() - 86400000), // 1 day ago
            duration: 120
          },
          {
            _id: 'demo-2', 
            overallScore: 92,
            clarityScore: 90,
            createdAt: new Date(Date.now() - 172800000), // 2 days ago
            duration: 95
          }
        ]
      });
    }

    const interviews = await Interview.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select('overallScore clarityScore createdAt duration')
      .lean();

    res.json({
      success: true,
      interviews
    });
  } catch (error) {
    console.error('Error fetching interview history:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch interview history"
    });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      console.log('📝 MongoDB not connected, returning demo interview data');
      return res.json({
        success: true,
        interview: {
          _id: id,
          transcript: "This is a demo transcript. In the full version, your speech would be transcribed using OpenAI's Whisper API. The AI would analyze your speech patterns, detect filler words, and provide detailed feedback on your interview performance.",
          clarityScore: 85,
          fillerWords: 3,
          speechRate: 145,
          pauseCount: 2,
          emotions: [
            { timestamp: 0, emotion: 'confident', confidence: 0.8 },
            { timestamp: 30, emotion: 'focused', confidence: 0.9 },
            { timestamp: 60, emotion: 'confident', confidence: 0.85 }
          ],
          averageConfidence: 0.85,
          overallScore: 85,
          feedback: {
            strengths: ["Clear articulation", "Good pace", "Confident delivery"],
            improvements: ["Reduce filler words", "Add more pauses"],
            tips: ["Practice pausing instead of using 'um'", "Slow down slightly for clarity"]
          },
          duration: 90,
          createdAt: new Date()
        }
      });
    }
    
    const interview = await Interview.findById(id);
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        error: "Interview not found"
      });
    }

    res.json({
      success: true,
      interview
    });
  } catch (error) {
    console.error('Error fetching interview:', error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch interview details"
    });
  }
};
