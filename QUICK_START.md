# 🚀 AI Interview Coach - Quick Start Guide

Welcome to the AI Interview Coach! This guide will get you up and running in 5 minutes.

## Prerequisites

- Node.js (v16+) - [Download](https://nodejs.org/)
- npm (comes with Node.js)
- Either MongoDB or MongoDB Atlas account

## ⚡ 30-Second Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `env.example` to `.env`:
```bash
cp env.example .env
```

Then edit `.env` and add:
```env
# Your OpenAI API Key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-your-api-key-here

# MongoDB Connection (choose one option below)
# Option A: MongoDB Atlas (Cloud - Recommended)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/interviewCoach

# Option B: Local MongoDB
MONGODB_URI=mongodb://localhost:27017/interviewCoach

PORT=5000
NODE_ENV=development
```

### 3. Start the Server
```bash
npm start
```

The app will open at: **http://localhost:5000**

---

## 🔧 MongoDB Setup

### Option 1: MongoDB Atlas (Cloud) ⭐ RECOMMENDED

**✅ Easiest - No installation needed**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a free M0 cluster
4. Add database user (username: `interviewcoach`)
5. Allow access from anywhere (0.0.0.0/0)
6. Copy connection string and paste into `.env`

**That's it! You're connected to the cloud.**

### Option 2: Local MongoDB

**For developers who prefer local setup:**

1. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Install and run MongoDB:
   - **Windows:** `mongod` (in MongoDB bin directory)
   - **macOS:** `brew install mongodb-community && brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`
3. Use default connection: `mongodb://localhost:27017/interviewCoach`

**MongoDB should be running before starting the app.**

---

## 🔑 OpenAI API Setup

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy the key
4. Paste into `.env` as `OPENAI_API_KEY=sk-...`

**Estimated cost:** ~$0.01 per interview (with demo mode fallback)

---

## ✅ Verify Everything Works

When you start the server, you should see:
```
🚀 AI Interview Coach server running on port 5000
📱 Open http://localhost:5000 to start your interview!
✅ Connected to MongoDB
```

If you see `⚠️ MongoDB connection failed`, the app still works in **demo mode** (data won't be saved).

---

## 🎯 Try It Out

1. Open http://localhost:5000
2. Click "Start Mock Interview"
3. Allow camera & microphone access
4. Answer the interview questions
5. See your AI analysis

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Port 5000 already in use` | Change PORT in .env or stop other app on port 5000 |
| `Camera not working` | Check browser permissions; try HTTPS or localhost only |
| `MongoDB connection failed` | App works in demo mode; optional for testing |
| `API key invalid` | Verify key from https://platform.openai.com/api-keys |

---

## 📱 Usage Timeline

- **Recording**: ~30-60 seconds per interview
- **Processing**: ~30-60 seconds for AI analysis
- **Results**: Instant analytics and feedback

---

## 🚀 Next Steps

- **Customize questions**: Edit `public/interview.js` → `questions` array
- **Adjust analysis**: Modify `controllers/analyzeController.js`
- **Deploy**: See DEPLOYMENT.md for production setup

---

## 💬 Support

For issues or questions:
1. Check console for error messages
2. Verify `.env` configuration
3. Ensure MongoDB/OpenAI keys are valid
4. Check browser console (F12) for frontend errors

**Happy interviewing! 🎉**
