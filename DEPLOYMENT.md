# 🚀 Deployment Guide - AI Interview Coach

This guide covers deploying the AI Interview Coach to production environments.

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured in `.env`
- [ ] MongoDB Atlas cluster created and accessible
- [ ] OpenAI API key valid and has sufficient credits
- [ ] All tests passing locally
- [ ] HTTPS configured
- [ ] CORS settings verified
- [ ] Rate limiting configured

## 🌐 Deployment Options

### Option 1: Heroku (Easiest) ⭐

**Perfect for hackathons and quick demos**

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set OPENAI_API_KEY=sk-your-key
   heroku config:set MONGODB_URI=mongodb+srv://...
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View Logs**
   ```bash
   heroku logs --tail
   ```

Your app will be live at: `https://your-app-name.herokuapp.com`

---

### Option 2: Railway ⚡

**Fast deployment with good free tier**

1. **Install Railway CLI** (optional)
   ```bash
   npm install -g @railway/cli
   ```

2. **Connect GitHub**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub account
   - Select this repository
   - Configure environment variables

3. **Automatic Deployment**
   - Every push to `main` auto-deploys
   - View logs in Railway dashboard

---

### Option 3: Render 🎨

**Developer-friendly alternative to Heroku**

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Connect GitHub

2. **Create New Web Service**
   - Select repository
   - Build command: `npm install`
   - Start command: `npm start`

3. **Add Environment Variables**
   - Set all variables from `.env`

4. **Deploy**
   - Automatic on push to main

---

### Option 4: AWS EC2 (Advanced)

**Full control, highest customization**

1. **Launch EC2 Instance**
   ```bash
   # Ubuntu 20.04 or later
   # t2.micro (free tier eligible)
   ```

2. **Install Dependencies**
   ```bash
   sudo apt update && sudo apt upgrade
   sudo apt install nodejs npm mongodb
   ```

3. **Clone Repository**
   ```bash
   git clone https://github.com/AbothulaRamya/ai-interview-coach.git
   cd ai-interview-coach
   ```

4. **Configure Environment**
   ```bash
   cp env.example .env
   nano .env  # Edit with your keys
   ```

5. **Install PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "interview-coach"
   pm2 startup
   pm2 save
   ```

6. **Setup Nginx Reverse Proxy**
   ```bash
   sudo apt install nginx
   # Configure /etc/nginx/sites-available/default
   sudo systemctl restart nginx
   ```

---

### Option 5: Docker (Production Best Practice)

**Containerized deployment**

1. **Create Dockerfile**
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Build Image**
   ```bash
   docker build -t ai-interview-coach .
   ```

3. **Run Container**
   ```bash
   docker run -p 5000:5000 \
     -e OPENAI_API_KEY=sk-your-key \
     -e MONGODB_URI=mongodb+srv://... \
     ai-interview-coach
   ```

4. **Deploy to Docker Hub**
   ```bash
   docker tag ai-interview-coach:latest username/ai-interview-coach:latest
   docker push username/ai-interview-coach:latest
   ```

---

## 🔐 Production Security

### Environment Variables
- Never commit `.env` to Git
- Use platform's secret management
- Rotate API keys regularly

### Rate Limiting
```javascript
// Add to server.js
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

### CORS Configuration
```javascript
// In server.js
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
```

### HTTPS/SSL
- Use Let's Encrypt for free SSL
- Redirect HTTP to HTTPS
- Set secure cookie flags

---

## 📊 Monitoring & Logs

### Heroku Logs
```bash
heroku logs -n 50
heroku logs --tail
```

### PM2 Monitoring
```bash
pm2 monit
pm2 logs
```

### Application Metrics
Monitor:
- API response times
- Error rates
- Database connection pool
- File upload sizes

---

## 🚨 Performance Optimization

### Frontend
- Enable gzip compression
- Minify CSS/JS
- Cache static files (1 year for versioned assets)
- Lazy load video components

### Backend
- Connection pooling
- Request timeout: 60s
- Max video size: 100MB
- Cache frequently accessed data

### Database
- Index queries: `createdAt`, `overallScore`
- Archive old interviews (>90 days)
- Optimize video storage (S3/Cloud Storage)

---

## 📈 Scaling Strategies

### If traffic increases:
1. **Database**: Upgrade MongoDB Atlas tier
2. **Async Processing**: Queue video analysis with Bull/RabbitMQ
3. **CDN**: Use CloudFront/Cloudflare for static files
4. **Caching**: Redis for session cache
5. **Load Balancer**: Distribute across multiple instances

---

## 🔍 Health Checks

Add health endpoint to monitor deployment:

```javascript
app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'ok' : 'down';
  res.json({
    status: 'ok',
    mongodb: mongoStatus,
    uptime: process.uptime(),
    timestamp: new Date()
  });
});
```

---

## 📞 Support & Troubleshooting

### Common Issues:

**App crashes on startup**
- Check logs for errors
- Verify all env variables set
- Ensure MongoDB is accessible
- Check file permissions

**Memory issues**
- Increase Node heap: `NODE_OPTIONS="--max-old-space-size=1024"`
- Optimize video processing
- Set garbage collection

**Database connection pooling**
- Increase pool size in production
- Use connection pooling service (PgBouncer)

---

## 🎉 You're Live!

Congratulations! Your AI Interview Coach is now in production.

**Monitor your deployment:**
- Check logs regularly
- Monitor API errors
- Track user engagement
- Gather feedback

**Next improvements:**
- Add analytics dashboard
- Implement user authentication
- Add interview templates
- Mobile app version

---

*Happy interviewing at scale! 🚀*
