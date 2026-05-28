import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  // Basic interview info
  candidateName: {
    type: String,
    default: "Anonymous"
  },
  
  // Speech analysis
  transcript: {
    type: String,
    required: true
  },
  
  // Speech metrics
  clarityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  fillerWords: {
    type: Number,
    default: 0
  },
  
  speechRate: {
    type: Number, // words per minute
    default: 0
  },
  
  pauseCount: {
    type: Number,
    default: 0
  },
  
  // Emotion analysis
  emotions: [{
    timestamp: Number,
    emotion: String,
    confidence: Number
  }],
  
  averageConfidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  
  // Overall feedback
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  feedback: {
    strengths: [String],
    improvements: [String],
    tips: [String]
  },
  
  // Metadata
  duration: {
    type: Number, // in seconds
    default: 0
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
interviewSchema.index({ createdAt: -1 });
interviewSchema.index({ overallScore: -1 });

export default mongoose.model("Interview", interviewSchema);