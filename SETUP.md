# 🚀 Quick Setup Guide

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js** (v16+) installed
- [ ] **MongoDB** running locally or Atlas account
- [ ] **OpenAI API key** with Whisper access
- [ ] **FFmpeg** installed and in PATH

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your settings:
# - Add your OpenAI API key
# - Set MongoDB connection string
# - Configure port (default: 5000)
```

### Step 3: Start the Application
```bash
npm start
```

### Step 4: Access the App
Open http://localhost:5000 in your browser

## Environment Variables

Create a `.env` file with:

```env
# Required: OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Required: MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/interviewCoach

# Optional: Server Configuration
PORT=5000
NODE_ENV=development
```

## Quick Test

1. Go to http://localhost:5000
2. Click "Start Mock Interview"
3. Allow camera/microphone access
4. Record a short response
5. View your AI-generated feedback!

## Troubleshooting

### Camera Issues
- Use HTTPS or localhost
- Check browser permissions
- Try Chrome/Firefox

### FFmpeg Issues
```bash
# Test installation
ffmpeg -version

# Windows: Add to PATH
# macOS: brew install ffmpeg
# Linux: sudo apt install ffmpeg
```

### MongoDB Issues
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### OpenAI API Issues
- Verify API key is correct
- Check account has credits
- Ensure Whisper access is enabled

## Ready to Go! 🎯

Your AI Interview Coach is now ready for hackathon action!
