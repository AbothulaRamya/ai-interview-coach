# 🗄️ MongoDB Setup Guide for AI Interview Coach

## 🚀 Quick Setup Options

### Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

**Perfect for hackathon demos - No installation required!**

1. **Create Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster:**
   - Click "Build a Cluster"
   - Choose "M0 Sandbox" (Free tier)
   - Select region closest to you
   - Click "Create Cluster"

3. **Database Access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `interviewcoach`
   - Password: `[create strong password]`
   - Role: "Read and write to any database"

4. **Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)

5. **Get Connection String:**
   - Go to "Clusters"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string

6. **Update .env file:**
   ```env
   MONGODB_URI=mongodb+srv://interviewcoach:<password>@cluster0.xxxxx.mongodb.net/interviewCoach?retryWrites=true&w=majority
   ```

7. **Restart server:**
   ```bash
   npm start
   ```

### Option 2: Local MongoDB

1. **Download MongoDB:**
   - Go to [MongoDB Download](https://www.mongodb.com/try/download/community)
   - Download Community Server

2. **Install MongoDB:**
   - Run installer
   - Choose "Complete" installation
   - Install as Windows Service

3. **Start Service:**
   - Open Services (services.msc)
   - Find "MongoDB" service
   - Start the service

4. **Update .env file:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/interviewCoach
   ```

5. **Restart server:**
   ```bash
   npm start
   ```

## 🌱 Seed Demo Data

After setting up MongoDB, run the demo data seeder:

```bash
node seed-demo-data.js
```

This will create sample interview data for your demo.

## ✅ Verification

Your server should show:
```
✅ Connected to MongoDB
```

Instead of:
```
⚠️ MongoDB connection failed
```

## 🎯 Demo Benefits

- **Real Database:** Persistent data storage
- **Interview History:** Track multiple interviews
- **Professional Demo:** Shows full functionality
- **No Errors:** Clean, professional presentation

## 🆘 Troubleshooting

### Connection Issues:
- Check your connection string
- Verify username/password
- Ensure network access is configured
- Check if MongoDB service is running (local)

### Still Getting Errors:
- Your app will continue in demo mode
- All features still work
- Just without data persistence

## 🏆 Ready for Hackathon!

With MongoDB connected, your AI Interview Coach will have:
- ✅ Real data persistence
- ✅ Interview history tracking
- ✅ Professional database integration
- ✅ Complete full-stack functionality

Perfect for impressing hackathon judges! 🎯
