// Demo Database - In-Memory Storage
// Perfect for hackathon demos without external dependencies

class DemoDatabase {
  constructor() {
    this.interviews = [
      {
        _id: 'demo-1',
        candidateName: 'Alex Johnson',
        transcript: 'I\'m Alex Johnson, and I\'m excited about this software engineering position. I have five years of experience in full-stack development, with expertise in React, Node.js, and cloud technologies.',
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
          strengths: ['Clear articulation', 'Good pace', 'Confident delivery', 'Relevant experience'],
          improvements: ['Slightly reduce filler words'],
          tips: ['Great job! Continue practicing to maintain consistency']
        },
        duration: 45,
        createdAt: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        _id: 'demo-2',
        candidateName: 'Sarah Chen',
        transcript: 'Hello, I\'m Sarah Chen. I\'m a product manager with six years of experience in tech startups. I\'ve led cross-functional teams and launched three successful products.',
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
          strengths: ['Excellent articulation', 'Perfect pace', 'Strong experience', 'Clear motivation'],
          improvements: ['Minor pause optimization'],
          tips: ['Outstanding performance! Keep up the great work']
        },
        duration: 52,
        createdAt: new Date(Date.now() - 172800000) // 2 days ago
      }
    ];
  }

  async find() {
    return this.interviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async findById(id) {
    return this.interviews.find(interview => interview._id === id);
  }

  async create(interviewData) {
    const newInterview = {
      _id: 'demo-' + Date.now(),
      ...interviewData,
      createdAt: new Date()
    };
    this.interviews.push(newInterview);
    return newInterview;
  }
}

// Export demo database
export default DemoDatabase;
