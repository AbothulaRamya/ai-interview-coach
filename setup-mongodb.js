// MongoDB Atlas Setup Helper
// This script helps you set up MongoDB Atlas connection

console.log('🗄️  MongoDB Atlas Setup Helper');
console.log('================================');
console.log('');
console.log('📋 Steps to set up MongoDB Atlas:');
console.log('');
console.log('1. 🌐 Go to: https://www.mongodb.com/cloud/atlas');
console.log('2. 📝 Create a free account');
console.log('3. 🏗️  Build a free cluster (M0 Sandbox)');
console.log('4. 👤 Create database user:');
console.log('   - Username: interviewcoach');
console.log('   - Password: [create a strong password]');
console.log('   - Role: Read and write to any database');
console.log('');
console.log('5. 🌍 Network Access:');
console.log('   - Add IP Address: 0.0.0.0/0 (Allow access from anywhere)');
console.log('');
console.log('6. 🔗 Get connection string:');
console.log('   - Click "Connect" on your cluster');
console.log('   - Choose "Connect your application"');
console.log('   - Copy the connection string');
console.log('');
console.log('7. 📝 Update your .env file:');
console.log('   MONGODB_URI=mongodb+srv://interviewcoach:<password>@cluster0.xxxxx.mongodb.net/interviewCoach?retryWrites=true&w=majority');
console.log('');
console.log('8. 🚀 Restart your server: npm start');
console.log('');
console.log('✅ Your AI Interview Coach will then connect to MongoDB Atlas!');
console.log('');
console.log('💡 Demo Mode Benefits:');
console.log('- Free 512MB storage');
console.log('- No credit card required');
console.log('- Perfect for hackathon demos');
console.log('- Real database persistence');
console.log('');
