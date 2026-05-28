#!/usr/bin/env node

/**
 * 🚀 AI Interview Coach - Interactive Setup Script
 * This script helps configure the project with MongoDB and OpenAI API keys
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const envPath = path.join(__dirname, '.env');
const examplePath = path.join(__dirname, 'env.example');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    red: '\x1b[31m'
};

function log(color, text) {
    console.log(`${colors[color] || ''}${text}${colors.reset}`);
}

function question(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, resolve);
    });
}

async function main() {
    console.clear();
    log('cyan', '========================================');
    log('cyan', '  🚀 AI Interview Coach - Setup Wizard');
    log('cyan', '========================================\n');

    // Check if .env exists
    if (fs.existsSync(envPath)) {
        log('yellow', `⚠️  .env file already exists at ${envPath}`);
        const overwrite = await question('Would you like to reconfigure? (y/n): ');
        if (overwrite.toLowerCase() !== 'y') {
            log('green', '✅ Setup skipped. Your configuration is preserved.\n');
            rl.close();
            return;
        }
    }

    log('bright', '\n📋 Configuration Setup\n');

    // OpenAI API Key
    log('blue', '1️⃣  OpenAI API Configuration');
    log('yellow', '   Get your free API key from: https://platform.openai.com/api-keys');
    const openaiKey = await question('   Enter your OpenAI API key (or press Enter to skip): ');

    // MongoDB Setup
    log('blue', '\n2️⃣  MongoDB Configuration');
    log('yellow', '   Choose your MongoDB setup:');
    log('yellow', '   1. MongoDB Atlas (Cloud - Recommended, no installation needed)');
    log('yellow', '   2. Local MongoDB (requires installation)');
    log('yellow', '   3. Skip for now (demo mode only)');
    
    const mongoChoice = await question('   Enter choice (1-3): ');
    
    let mongoUri = 'mongodb://localhost:27017/interviewCoach';

    if (mongoChoice === '1') {
        log('cyan', '\n   📖 MongoDB Atlas Setup:');
        log('cyan', '      1. Go to https://www.mongodb.com/cloud/atlas');
        log('cyan', '      2. Create free account');
        log('cyan', '      3. Create M0 free cluster');
        log('cyan', '      4. Get connection string');
        mongoUri = await question('\n   Paste your MongoDB Atlas URI: ');
    } else if (mongoChoice === '2') {
        log('cyan', '\n   📖 Local MongoDB Setup:');
        log('cyan', '      1. Install: https://www.mongodb.com/try/download/community');
        log('cyan', '      2. Start MongoDB (mongod command)');
        log('cyan', '      3. Then start this app with: npm start');
        log('yellow', '   ⚠️  Make sure MongoDB is running on localhost:27017');
        mongoUri = 'mongodb://localhost:27017/interviewCoach';
    } else {
        log('yellow', '   ℹ️  Skipped MongoDB setup. App will run in demo mode.');
        log('yellow', '      (Data won\'t be saved, but you can still test features)');
        mongoUri = 'mongodb://localhost:27017/interviewCoach';
    }

    // Port Configuration
    log('blue', '\n3️⃣  Server Configuration');
    const port = await question('   Enter port (default: 5000): ');
    const serverPort = port || '5000';

    // Create .env file
    log('bright', '\n📝 Creating .env configuration...\n');

    const envContent = `# OpenAI API Configuration
OPENAI_API_KEY=${openaiKey || 'your_openai_api_key_here'}

# MongoDB Configuration
MONGODB_URI=${mongoUri}

# Server Configuration
PORT=${serverPort}
NODE_ENV=development
`;

    try {
        fs.writeFileSync(envPath, envContent);
        log('green', '✅ .env file created successfully!\n');

        // Summary
        log('bright', '📋 Configuration Summary:');
        log('green', `   ✅ Port: ${serverPort}`);
        
        if (openaiKey) {
            log('green', `   ✅ OpenAI API: Configured`);
        } else {
            log('yellow', `   ⚠️  OpenAI API: Not configured (add later for transcription)`);
        }

        if (mongoChoice === '1' || mongoChoice === '2') {
            log('green', `   ✅ MongoDB: Configured`);
        } else {
            log('yellow', `   ⚠️  MongoDB: Demo mode (add later to save data)`);
        }

        log('bright', '\n🚀 Next Steps:');
        log('cyan', '   1. Start the server:');
        log('cyan', '      npm start');
        log('cyan', '\n   2. Open in browser:');
        log('cyan', `      http://localhost:${serverPort}`);
        log('cyan', '\n   3. Start your first interview and see AI coaching in action!');

        log('bright', '\n📚 Documentation:');
        log('cyan', '   • Quick Start: QUICK_START.md');
        log('cyan', '   • MongoDB Setup: MONGODB_SETUP.md');
        log('cyan', '   • Full README: README.md');

        log('green', '\n✨ Setup complete! Enjoy AI coaching! ✨\n');

    } catch (error) {
        log('red', `\n❌ Error creating .env file: ${error.message}\n`);
    }

    rl.close();
}

main().catch(err => {
    log('red', `\n❌ Setup error: ${err.message}\n`);
    rl.close();
    process.exit(1);
});
