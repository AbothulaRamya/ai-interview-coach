import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import OpenAI from "openai";
import Interview from "../models/Interview.js";

// Initialize OpenAI client only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

export const analyzeVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: "No video file uploaded" 
      });
    }

    const videoPath = req.file.path;
    const audioPath = path.join('uploads', `audio-${Date.now()}.wav`);
    
    console.log('🎥 Processing video:', videoPath);

    // 1. Extract audio from video using ffmpeg (or skip in demo mode)
    let audioExtracted = false;
    let audioQuality = 'unknown';
    
    try {
      console.log('🎵 Extracting audio from video...');
      execSync(`ffmpeg -i "${videoPath}" -q:a 0 -map a "${audioPath}"`, { 
        stdio: 'pipe' 
      });
      console.log('✅ Audio extracted successfully');
      audioExtracted = true;
      audioQuality = 'high';
    } catch (ffmpegError) {
      console.warn('⚠️  FFmpeg not available, running in demo mode');
      // Create a dummy audio file for demo
      fs.writeFileSync(audioPath, 'demo audio file');
      audioExtracted = true;
      audioQuality = 'demo';
    }

    // 2. Transcribe audio using OpenAI Whisper (or demo mode)
    let transcript = "";
    let transcriptionQuality = 'demo';
    
    if (!audioExtracted) {
      return res.status(500).json({ 
        success: false, 
        error: "Failed to process video file" 
      });
    }
    
    if (openai && audioQuality === 'high') {
      try {
        console.log('🎤 Processing audio with OpenAI Whisper...');
        const transcription = await openai.audio.transcriptions.create({
          file: fs.createReadStream(audioPath),
          model: "whisper-1",
          language: "en",
          response_format: "text",
          temperature: 0.0
        });
        transcript = transcription;
        transcriptionQuality = 'high';
        console.log('✅ Transcription completed with OpenAI Whisper');
        console.log('📝 Transcript length:', transcript.length, 'characters');
      } catch (whisperError) {
        console.error('❌ Whisper API error:', whisperError.message);
        transcript = "Demo mode: Audio transcription would happen here with OpenAI Whisper API.";
        transcriptionQuality = 'demo';
      }
    } else {
      console.log('📝 Running in demo mode - using sample transcript');
      transcript = "This is a demo transcript. In the full version, your speech would be transcribed using OpenAI's Whisper API. The AI would analyze your speech patterns, detect filler words, and provide detailed feedback on your interview performance.";
      transcriptionQuality = 'demo';
    }

    // 3. Analyze speech patterns
    const speechAnalysis = analyzeSpeechPatterns(transcript);
    
    // 4. Simulate emotion analysis (in a real app, you'd use face-api.js or similar)
    const emotionAnalysis = simulateEmotionAnalysis();
    
    // 5. Generate feedback
    const feedback = generateFeedback(speechAnalysis, emotionAnalysis);
    
    // 6. Calculate overall score
    const overallScore = calculateOverallScore(speechAnalysis, emotionAnalysis);

    // 7. Save to database (with fallback)
    let interviewId = 'demo-' + Date.now();
    
    try {
      const interview = new Interview({
        transcript,
        clarityScore: speechAnalysis.clarityScore,
        fillerWords: speechAnalysis.fillerWords,
        speechRate: speechAnalysis.speechRate,
        pauseCount: speechAnalysis.pauseCount,
        emotions: emotionAnalysis.emotions,
        averageConfidence: emotionAnalysis.averageConfidence,
        overallScore,
        feedback,
        duration: speechAnalysis.duration
      });

      await interview.save();
      interviewId = interview._id;
      console.log('💾 Interview saved to database');
    } catch (dbError) {
      console.warn('⚠️  Database save failed, using demo ID:', dbError.message);
    }

    // 8. Clean up temporary files
    try {
      fs.unlinkSync(videoPath);
      fs.unlinkSync(audioPath);
    } catch (cleanupError) {
      console.warn('Cleanup warning:', cleanupError.message);
    }

    res.json({
      success: true,
      interviewId: interviewId,
      transcript,
      analysis: {
        clarityScore: speechAnalysis.clarityScore,
        fillerWords: speechAnalysis.fillerWords,
        speechRate: speechAnalysis.speechRate,
        overallScore,
        feedback
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      success: false, 
      error: "Analysis failed",
      message: error.message 
    });
  }
};

function analyzeSpeechPatterns(transcript) {
  console.log('🧠 Analyzing speech patterns...');
  
  const words = transcript.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  // Enhanced filler word detection
  const fillerWords = [
    'um', 'uh', 'ah', 'er', 'hm', 'hmm',
    'like', 'you know', 'so', 'well', 'actually', 'basically',
    'kind of', 'sort of', 'i mean', 'you see', 'right',
    'okay', 'alright', 'yeah', 'yes', 'no'
  ];
  
  let fillerCount = 0;
  fillerWords.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = transcript.match(regex);
    if (matches) {
      fillerCount += matches.length;
    }
  });
  
  // Calculate speech rate (assuming 60 seconds duration for demo)
  const duration = 60; // In a real app, get actual duration
  const speechRate = Math.round((wordCount / duration) * 60);
  
  // Enhanced pause detection
  const pauseCount = (transcript.match(/\.{2,}|,{2,}|\s{3,}/g) || []).length;
  
  // Calculate clarity score with enhanced algorithm
  const fillerPenalty = Math.min(fillerCount * 2, 25);
  const pausePenalty = Math.min(pauseCount * 1.5, 15);
  const lengthBonus = Math.min(wordCount / 10, 10); // Bonus for longer responses
  const clarityScore = Math.max(0, Math.min(100, 70 - fillerPenalty - pausePenalty + lengthBonus));
  
  // Voice quality analysis
  const voiceQuality = {
    clarity: clarityScore > 80 ? 'excellent' : clarityScore > 60 ? 'good' : 'needs improvement',
    pace: speechRate > 180 ? 'too fast' : speechRate < 120 ? 'too slow' : 'good',
    fluency: fillerCount < 3 ? 'fluent' : fillerCount < 6 ? 'moderate' : 'needs work'
  };
  
  console.log('✅ Speech analysis completed:');
  console.log('📊 Word count:', wordCount);
  console.log('🤐 Filler words:', fillerCount);
  console.log('⚡ Speech rate:', speechRate, 'WPM');
  console.log('⏸️ Pauses:', pauseCount);
  console.log('📈 Clarity score:', clarityScore);
  
  return {
    wordCount,
    fillerWords: fillerCount,
    speechRate,
    pauseCount,
    clarityScore,
    duration,
    voiceQuality
  };
}

function simulateEmotionAnalysis() {
  // In a real implementation, this would analyze facial expressions
  // For demo purposes, we'll simulate some emotion data
  const emotions = [];
  const emotionTypes = ['neutral', 'happy', 'confident', 'nervous', 'focused'];
  
  for (let i = 0; i < 10; i++) {
    const emotion = emotionTypes[Math.floor(Math.random() * emotionTypes.length)];
    emotions.push({
      timestamp: i * 6, // Every 6 seconds
      emotion,
      confidence: Math.random() * 0.4 + 0.6 // 0.6-1.0 confidence
    });
  }
  
  const averageConfidence = emotions.reduce((sum, e) => sum + e.confidence, 0) / emotions.length;
  
  return {
    emotions,
    averageConfidence
  };
}

function generateFeedback(speechAnalysis, emotionAnalysis) {
  const strengths = [];
  const improvements = [];
  const tips = [];
  
  // Analyze speech
  if (speechAnalysis.clarityScore > 80) {
    strengths.push("Clear and articulate speech");
  } else if (speechAnalysis.clarityScore < 60) {
    improvements.push("Work on reducing filler words");
    tips.push("Practice pausing instead of using 'um' or 'uh'");
  }
  
  if (speechAnalysis.speechRate > 120 && speechAnalysis.speechRate < 180) {
    strengths.push("Good speaking pace");
  } else if (speechAnalysis.speechRate > 180) {
    improvements.push("Speaking too fast");
    tips.push("Slow down and take deliberate pauses");
  } else if (speechAnalysis.speechRate < 120) {
    improvements.push("Speaking too slowly");
    tips.push("Try to maintain a more energetic pace");
  }
  
  // Analyze emotions
  const confidentEmotions = emotionAnalysis.emotions.filter(e => 
    e.emotion === 'confident' || e.emotion === 'happy'
  ).length;
  
  if (confidentEmotions > emotionAnalysis.emotions.length * 0.6) {
    strengths.push("Maintained confident demeanor");
  } else {
    improvements.push("Work on projecting more confidence");
    tips.push("Practice power poses and maintain eye contact");
  }
  
  // Default tips if no specific issues
  if (tips.length === 0) {
    tips.push("Great job! Keep practicing to maintain consistency");
    tips.push("Consider recording yourself more often to track progress");
  }
  
  return {
    strengths,
    improvements,
    tips
  };
}

function calculateOverallScore(speechAnalysis, emotionAnalysis) {
  const speechWeight = 0.6;
  const emotionWeight = 0.4;
  
  const speechScore = speechAnalysis.clarityScore;
  const emotionScore = emotionAnalysis.averageConfidence * 100;
  
  return Math.round((speechScore * speechWeight) + (emotionScore * emotionWeight));
}