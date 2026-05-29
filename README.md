# 🎯 AI Interview Coach

A hackathon-scale AI-powered interview coaching platform that analyzes speech patterns and facial expressions to provide instant feedback on interview performance.

## 🚀 Features

- **Real-time Video Recording**: Capture your interview responses with webcam and audio
- **AI Speech Analysis**: Powered by OpenAI Whisper for accurate transcription
- **Speech Pattern Analysis**: Detect filler words, speech rate, and clarity
- **Emotion Detection**: Track confidence and emotional expression (simulated)
- **Detailed Feedback**: Get personalized insights and improvement tips
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Interview History**: Track your progress over time

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | HTML, CSS, JavaScript | Video recording, UI, face detection |
| **Backend** | Node.js + Express | API endpoints, AI integration |
| **Database** | MongoDB | Store interview data and results |
| **AI APIs** | OpenAI Whisper | Speech-to-text transcription |
| **Face Detection** | face-api.js | Emotion analysis (browser-based) |

## 📋 Prerequisites

Before running the application, make sure you have:

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **OpenAI API Key** (for Whisper speech-to-text)
- **FFmpeg** (for audio extraction from video)

### Installing Prerequisites

#### Node.js
Download and install from [nodejs.org](https://nodejs.org/)

#### MongoDB
- **Local**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- **Cloud**: Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)

#### FFmpeg
- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html) and add to PATH
- **macOS**: `brew install ffmpeg`
- **Linux**: `sudo apt install ffmpeg`

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get your API key
3. Add it to your environment variables

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-interview-coach

# Install dependencies
npm install
```

### 2. Environment Setup

```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your configuration
```

Update `.env` with your settings:
```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# MongoDB Configuration
# Use MongoDB Atlas or local MongoDB.
MONGODB_URI=mongodb://localhost:27017/interviewCoach

# Server Configuration
PORT=5000
NODE_ENV=development
```

> Tip: Use `npm run setup` to build `.env` interactively, including Atlas and OpenAI values.

### 3. Start the Application

```bash
# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
- **Local**: http://localhost:5000
- **Network**: http://your-ip:5000

## 📱 How to Use

### 1. Start an Interview
- Click "Start Mock Interview" on the home page
- Allow camera and microphone access when prompted
- Click "Start Interview" when ready

### 2. Answer Questions
- The system will present you with common interview questions
- Speak naturally while looking at the camera
- Use "Next Question" to move through questions
- Click "Finish Interview" when done

### 3. View Results
- Wait for AI analysis to complete (usually 30-60 seconds)
- Review your detailed feedback including:
  - Overall score (0-100)
  - Speech clarity analysis
  - Confidence metrics
  - Emotion timeline
  - Personalized tips

## 🏗️ Project Structure

```
ai-interview-coach/
├── public/                 # Frontend files
│   ├── index.html         # Home page
│   ├── interview.html     # Interview interface
│   ├── results.html       # Results display
│   ├── styles.css         # Main stylesheet
│   ├── home.js           # Home page logic
│   ├── interview.js      # Interview recording logic
│   ├── results.js        # Results visualization
│   └── models/           # Face-api.js models (download separately)
├── controllers/           # Backend controllers
│   ├── analyzeController.js
│   └── interviewController.js
├── models/               # Database models
│   └── Interview.js
├── uploads/              # Temporary file storage
├── server.js             # Main server file
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Home page |
| `GET` | `/interview` | Interview interface |
| `GET` | `/results/:id` | Results page |
| `POST` | `/api/analyze` | Upload and analyze video |
| `GET` | `/api/interviews` | Get interview history |
| `GET` | `/api/interviews/:id` | Get specific interview |

## 🎨 Customization

### Adding New Questions
Edit the `questions` array in `public/interview.js`:

```javascript
const questions = [
    "Your custom question here",
    "Another question",
    // ... more questions
];
```

### Modifying Analysis Logic
Update the analysis functions in `controllers/analyzeController.js`:

- `analyzeSpeechPatterns()` - Speech analysis logic
- `generateFeedback()` - Feedback generation
- `calculateOverallScore()` - Scoring algorithm

### Styling Changes
Modify `public/styles.css` to customize the appearance:

- Color scheme: Update CSS custom properties
- Layout: Modify grid and flexbox properties
- Animations: Adjust transition and animation values

## 🐛 Troubleshooting

### Common Issues

#### Camera Not Working
- Ensure you're using HTTPS or localhost
- Check browser permissions for camera/microphone
- Try refreshing the page

#### FFmpeg Not Found
- Verify FFmpeg is installed and in your PATH
- Test with: `ffmpeg -version`

#### OpenAI API Errors
- Check your API key is correct
- Ensure you have sufficient credits
- Verify the API key has Whisper access

#### MongoDB Connection Issues
- Check MongoDB is running
- Verify connection string in `.env`
- For Atlas, ensure IP whitelist includes your IP

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 🚀 Deployment

### Heroku Deployment

1. Create a Heroku app
2. Add environment variables in Heroku dashboard
3. Deploy with Git:

```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📊 Performance Tips

- **Video Quality**: Lower resolution for faster processing
- **Chunk Size**: Adjust MediaRecorder chunk size for your needs
- **Database**: Use indexes for better query performance
- **Caching**: Implement Redis for session management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Hackathon Notes

This project was designed for a 24-hour hackathon with the following priorities:

- **Speed**: Quick setup and deployment
- **Functionality**: Core features working end-to-end
- **Polish**: Professional UI and user experience
- **Scalability**: Architecture ready for expansion

### 24-Hour Timeline

| Time | Milestone |
|------|-----------|
| 0-2h | Project setup and dependencies |
| 2-6h | Frontend development |
| 6-10h | Backend API development |
| 10-14h | AI integration |
| 14-18h | Database and feedback logic |
| 18-22h | Results visualization |
| 22-24h | Polish and deployment |

## 🙏 Acknowledgments

- OpenAI for the Whisper API
- face-api.js for emotion detection
- Chart.js for data visualization
- The hackathon community for inspiration

---

**Built with ❤️ for hackathon excellence!** 🚀