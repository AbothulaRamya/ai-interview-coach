// Demo Data Seeder for AI Interview Coach
import mongoose from "mongoose";
import Interview from "./models/Interview.js";
import dotenv from "dotenv";

dotenv.config();

const demoInterviews = [
  {
    candidateName: "Alex Johnson",
    transcript: "I'm Alex Johnson, and I'm excited about this software engineering position. I have five years of experience in full-stack development, with expertise in React, Node.js, and cloud technologies. I'm passionate about building scalable applications and working in collaborative teams.",
    clarityScore: 92,
    fillerWords: 2,
    speechRate: 145,
    pauseCount: 1,
    emotions: [
      { timestamp: 0, emotion: 'confident', confidence: 0.9 },
      { timestamp: 30, emotion: 'focused', confidence: 0.85 },
      { timestamp: 60, emotion: 'confident', confidence: 0.88 }
    ],
    averageConfidence: 0.88,
    overallScore: 89,
    feedback: {
      strengths: ["Clear articulation", "Good pace", "Confident delivery", "Relevant experience"],
      improvements: ["Slightly reduce filler words"],
      tips: ["Great job! Continue practicing to maintain consistency"]
    },
    duration: 45,
    createdAt: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    candidateName: "Sarah Chen",
    transcript: "Hello, I'm Sarah Chen. I'm a product manager with six years of experience in tech startups. I've led cross-functional teams and launched three successful products. I'm particularly interested in this role because of the company's innovative approach to user experience.",
    clarityScore: 88,
    fillerWords: 1,
    speechRate: 138,
    pauseCount: 2,
    emotions: [
      { timestamp: 0, emotion: 'happy', confidence: 0.82 },
      { timestamp: 25, emotion: 'confident', confidence: 0.9 },
      { timestamp: 50, emotion: 'focused', confidence: 0.87 }
    ],
    averageConfidence: 0.86,
    overallScore: 87,
    feedback: {
      strengths: ["Excellent articulation", "Perfect pace", "Strong experience", "Clear motivation"],
      improvements: ["Minor pause optimization"],
      tips: ["Outstanding performance! Keep up the great work"]
    },
    duration: 52,
    createdAt: new Date(Date.now() - 172800000) // 2 days ago
  },
  {
    candidateName: "Mike Rodriguez",
    transcript: "Hi there, I'm Mike Rodriguez. I'm a data scientist with four years of experience in machine learning and analytics. I've worked on projects involving predictive modeling and have experience with Python, R, and various ML frameworks. I'm excited about the opportunity to contribute to your data-driven initiatives.",
    clarityScore: 85,
    fillerWords: 3,
    speechRate: 142,
    pauseCount: 1,
    emotions: [
      { timestamp: 0, emotion: 'neutral', confidence: 0.75 },
      { timestamp: 30, emotion: 'confident', confidence: 0.83 },
      { timestamp: 60, emotion: 'focused', confidence: 0.8 }
    ],
    averageConfidence: 0.79,
    overallScore: 82,
    feedback: {
      strengths: ["Good technical knowledge", "Clear experience", "Relevant skills"],
      improvements: ["Reduce filler words", "Increase confidence"],
      tips: ["Practice pausing instead of using 'um'", "Speak with more confidence about your achievements"]
    },
    duration: 48,
    createdAt: new Date(Date.now() - 259200000) // 3 days ago
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Seeding demo data...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/interviewCoach';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await Interview.deleteMany({});
    console.log('🗑️  Cleared existing interviews');
    
    // Insert demo data
    const interviews = await Interview.insertMany(demoInterviews);
    console.log(`✅ Inserted ${interviews.length} demo interviews`);
    
    console.log('');
    console.log('🎉 Demo data seeded successfully!');
    console.log('📊 Sample interviews created:');
    interviews.forEach((interview, index) => {
      console.log(`   ${index + 1}. ${interview.candidateName} - Score: ${interview.overallScore}/100`);
    });
    
    console.log('');
    console.log('🚀 Your AI Interview Coach now has sample data!');
    console.log('📱 Visit http://localhost:5000 to see the interviews');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDatabase();
