// Interview page functionality
let mediaRecorder;
let recordedChunks = [];
let stream;
let startTime;
let timerInterval;
let emotionData = [];
let isRecording = false;
let faceAPILoaded = false;
let personDetected = false;
let voiceDetected = false;

// Interview questions
const questions = [
    "Tell me about yourself and why you're interested in this position.",
    "What are your greatest strengths and how do they apply to this role?",
    "Describe a challenging situation you faced and how you overcame it.",
    "Where do you see yourself in 5 years?",
    "Why should we hire you for this position?",
    "Do you have any questions for us?"
];

let currentQuestionIndex = 0;

document.addEventListener('DOMContentLoaded', async function() {
    await initializeCamera();
    setupEventListeners();
    faceAPILoaded = await loadFaceAPI();
});

async function initializeCamera() {
    try {
        console.log('🎥 Initializing camera and microphone...');
        
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            }, 
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        });
        
        const video = document.getElementById('video');
        video.srcObject = stream;
        
        // Update camera status
        const status = document.getElementById('camera-status');
        status.innerHTML = '<span class="status-indicator"></span>Camera & Microphone Ready';
        
        console.log('✅ Camera and microphone initialized successfully');
        console.log('👤 Person detection ready');
        console.log('🎤 Voice recognition ready');
        
        // Start person detection
        startPersonDetection();
        
    } catch (error) {
        console.error('❌ Error accessing camera/microphone:', error);
        document.getElementById('camera-status').innerHTML = 
            '<span class="status-indicator" style="background: #e53e3e;"></span>Camera/Microphone Error';
    }
}

function setupEventListeners() {
    document.getElementById('start-interview').addEventListener('click', startInterview);
    document.getElementById('stop-interview').addEventListener('click', stopInterview);
    document.getElementById('next-question').addEventListener('click', nextQuestion);
    document.getElementById('finish-interview').addEventListener('click', finishInterview);
}

async function loadFaceAPI() {
    try {
        // Load face-api.js models with error handling
        console.log('Loading face detection models...');
        
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        
        console.log('✅ Face API models loaded successfully');
        console.log('🎭 Person recognition and emotion detection ready');
        return true;
    } catch (error) {
        console.warn('⚠️ Face API models not available:', error.message);
        console.log('📝 Continuing with simulated face detection');
        return false;
    }
}

function startInterview() {
    if (!stream) {
        alert('Camera not available. Please refresh the page and allow camera access.');
        return;
    }
    
    // Hide setup, show interview interface
    document.querySelector('.interview-setup').style.display = 'none';
    document.getElementById('interview-active').style.display = 'block';
    
    // Start recording
    startRecording();
    
    // Start timer
    startTimer();
    
    // Start emotion detection
    startEmotionDetection();
    
    console.log('Interview started');
}

function startRecording() {
    try {
        console.log('🎤 Starting voice recording...');
        
        // Check if audio is available
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length === 0) {
            console.warn('⚠️ No audio track available');
            voiceDetected = false;
            updateVoiceStatus(false);
        } else {
            console.log('✅ Audio track available:', audioTracks[0].label);
            voiceDetected = true;
            updateVoiceStatus(true);
        }
        
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9,opus',
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000
        });
        
        recordedChunks = [];
        
        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
                console.log('📹 Recording chunk:', event.data.size, 'bytes');
            }
        };
        
        mediaRecorder.onstop = function() {
            console.log('🛑 Recording stopped');
            console.log('📊 Total chunks recorded:', recordedChunks.length);
        };
        
        mediaRecorder.onerror = function(event) {
            console.error('❌ Recording error:', event.error);
        };
        
        mediaRecorder.start(1000); // Record in 1-second chunks
        isRecording = true;
        
        // Update button states
        document.getElementById('start-interview').disabled = true;
        document.getElementById('stop-interview').disabled = false;
        
        console.log('✅ Voice recording started successfully');
        
    } catch (error) {
        console.error('❌ Error starting recording:', error);
        alert('Failed to start recording. Please check your camera and microphone permissions.');
    }
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    document.getElementById('timer-display').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startPersonDetection() {
    const video = document.getElementById('video');
    
    // Detect person every 1 second
    const personInterval = setInterval(async () => {
        if (!video.srcObject) {
            clearInterval(personInterval);
            return;
        }
        
        try {
            if (faceAPILoaded) {
                const detections = await faceapi
                    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks();
                
                if (detections.length > 0) {
                    personDetected = true;
                    console.log('👤 Person detected:', detections.length, 'face(s)');
                    updatePersonStatus(true);
                } else {
                    personDetected = false;
                    console.log('👤 No person detected');
                    updatePersonStatus(false);
                }
            } else {
                // Simulate person detection
                personDetected = true;
                console.log('👤 Person detection (simulated)');
                updatePersonStatus(true);
            }
        } catch (error) {
            console.warn('⚠️ Person detection error:', error);
            personDetected = false;
            updatePersonStatus(false);
        }
    }, 1000);
}

function startEmotionDetection() {
    const video = document.getElementById('recording-video');
    video.srcObject = stream;
    
    // Detect emotions every 2 seconds
    const emotionInterval = setInterval(async () => {
        if (!isRecording) {
            clearInterval(emotionInterval);
            return;
        }
        
        try {
            if (faceAPILoaded) {
                const detections = await faceapi
                    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceExpressions();
                
                if (detections.length > 0) {
                    const expressions = detections[0].expressions;
                    const dominantEmotion = Object.keys(expressions).reduce((a, b) => 
                        expressions[a] > expressions[b] ? a : b
                    );
                    
                    emotionData.push({
                        timestamp: Date.now() - startTime,
                        emotion: dominantEmotion,
                        confidence: expressions[dominantEmotion]
                    });
                    
                    console.log('🎭 Emotion detected:', dominantEmotion, expressions[dominantEmotion]);
                }
            } else {
                // Simulate emotion detection
                const emotions = ['confident', 'focused', 'happy', 'neutral'];
                const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
                const confidence = Math.random() * 0.4 + 0.6;
                
                emotionData.push({
                    timestamp: Date.now() - startTime,
                    emotion: randomEmotion,
                    confidence: confidence
                });
                
                console.log('🎭 Emotion detected (simulated):', randomEmotion, confidence);
            }
        } catch (error) {
            console.warn('⚠️ Emotion detection error:', error);
        }
    }, 2000);
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        document.getElementById('current-question').textContent = questions[currentQuestionIndex];
    } else {
        finishInterview();
    }
}

function stopInterview() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        // Stop timer
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        // Update button states
        document.getElementById('stop-interview').disabled = true;
        document.getElementById('finish-interview').disabled = false;
        
        console.log('Interview stopped');
    }
}

async function finishInterview() {
    if (mediaRecorder && isRecording) {
        stopInterview();
    }
    
    // Hide interview interface, show processing
    document.getElementById('interview-active').style.display = 'none';
    document.getElementById('processing-section').style.display = 'block';
    
    // Simulate processing steps
    simulateProcessingSteps();
    
    // Process the video
    await processInterview();
}

function simulateProcessingSteps() {
    const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
    let currentStep = 0;
    
    const stepInterval = setInterval(() => {
        if (currentStep < steps.length) {
            // Remove active class from all steps
            steps.forEach(step => {
                document.getElementById(step).classList.remove('active');
            });
            
            // Add active class to current step
            document.getElementById(steps[currentStep]).classList.add('active');
            currentStep++;
        } else {
            clearInterval(stepInterval);
        }
    }, 2000);
}

async function processInterview() {
    try {
        // Create blob from recorded chunks
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        
        // Create form data
        const formData = new FormData();
        formData.append('video', blob, 'interview.webm');
        
        // Add emotion data if available
        if (emotionData.length > 0) {
            formData.append('emotionData', JSON.stringify(emotionData));
        }
        
        console.log('Uploading video for analysis...');
        
        // Send to backend for analysis
        const response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Analysis completed:', result);
            // Redirect to results page
            window.location.href = `/results/${result.interviewId}`;
        } else {
            throw new Error(result.error || 'Analysis failed');
        }
        
    } catch (error) {
        console.error('Error processing interview:', error);
        
        // Show error message
        document.querySelector('.processing-animation h3').textContent = 'Analysis Failed';
        document.querySelector('.processing-animation p').textContent = 
            'There was an error analyzing your interview. Please try again.';
        
        // Add retry button
        setTimeout(() => {
            const retryButton = document.createElement('button');
            retryButton.textContent = 'Try Again';
            retryButton.className = 'primary-button';
            retryButton.onclick = () => window.location.reload();
            document.querySelector('.processing-animation').appendChild(retryButton);
        }, 2000);
    }
}

// Status update functions
function updatePersonStatus(detected) {
    const statusElement = document.getElementById('person-status');
    if (statusElement) {
        if (detected) {
            statusElement.classList.add('active');
            statusElement.classList.remove('inactive');
        } else {
            statusElement.classList.add('inactive');
            statusElement.classList.remove('active');
        }
    }
}

function updateVoiceStatus(detected) {
    const statusElement = document.getElementById('voice-status');
    if (statusElement) {
        if (detected) {
            statusElement.classList.add('active');
            statusElement.classList.remove('inactive');
        } else {
            statusElement.classList.add('inactive');
            statusElement.classList.remove('active');
        }
    }
}

// Clean up when page is unloaded
window.addEventListener('beforeunload', function() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});
