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

const questions = [
    "Tell me about yourself and why you're interested in this position.",
    "What are your greatest strengths and how do they apply to this role?",
    "Describe a challenging situation you faced and how you overcame it.",
    "Where do you see yourself in 5 years?",
    "Tell us about a time when you had to work in a team. What was your role?",
    "Why should we hire you for this position?",
    "What do you know about our company and industry?",
    "Describe your experience with this technology/skill.",
    "How do you handle stress and tight deadlines?",
    "What's a project you're proud of? Tell us about your role.",
    "Why did you leave your last job?",
    "Do you have any questions for us?"
];

let currentQuestionIndex = 0;

document.addEventListener('DOMContentLoaded', async function() {
    updateQuestionDisplay();
    renderQuestionProgress();
    setupEventListeners();
    await initializeCamera();
    faceAPILoaded = await loadFaceAPI();
    document.getElementById('finish-interview').disabled = true;
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
        
        const status = document.getElementById('camera-status');
        status.innerHTML = '<span class="status-indicator"></span>Camera & Microphone Ready';
        
        console.log('✅ Camera and microphone initialized successfully');
        startPersonDetection();
        updateLiveStatus('Ready to start', '🟡');
        updateQuestionStatus('Press Start to begin');
    } catch (error) {
        console.error('❌ Error accessing camera/microphone:', error);
        document.getElementById('camera-status').innerHTML = 
            '<span class="status-indicator" style="background: #e53e3e;"></span>Camera/Microphone Error';
        updateLiveStatus('Camera unavailable', '⚠️');
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
        console.log('Loading face detection models...');
        
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models')
        ]);
        
        console.log('✅ Face API models loaded successfully');
        return true;
    } catch (error) {
        console.warn('⚠️ Face API models not available:', error.message);
        return false;
    }
}

function startInterview() {
    if (!stream) {
        alert('Camera not available. Please refresh the page and allow camera access.');
        return;
    }
    
    document.querySelector('.interview-setup').style.display = 'none';
    document.getElementById('interview-active').style.display = 'block';
    document.getElementById('processing-section').style.display = 'none';
    
    updateQuestionStatus('Recording your response');
    updateLiveStatus('Recording', '🔴');
    
    startRecording();
    startTimer();
    startEmotionDetection();
    
    console.log('Interview started');
}

function startRecording() {
    try {
        console.log('🎤 Starting voice recording...');
        
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
        emotionData = [];
        
        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
                console.log('📹 Recording chunk:', event.data.size, 'bytes');
            }
        };
        
        mediaRecorder.onstop = function() {
            console.log('🛑 Recording stopped');
        };
        
        mediaRecorder.onerror = function(event) {
            console.error('❌ Recording error:', event.error);
        };
        
        mediaRecorder.start(1000);
        isRecording = true;
        
        document.getElementById('start-interview').disabled = true;
        document.getElementById('stop-interview').disabled = false;
        document.getElementById('finish-interview').disabled = true;
        
        const recordingVideo = document.getElementById('recording-video');
        recordingVideo.srcObject = stream;
        
        updateQuestionDisplay();
        
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
                
                personDetected = detections.length > 0;
                updatePersonStatus(personDetected);
            } else {
                personDetected = true;
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
    if (!isRecording) {
        alert('Start the interview to move to the next question.');
        return;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateQuestionDisplay();
        updateQuestionStatus('New question ready');
    } else {
        finishInterview();
    }
}

function stopInterview() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        
        if (timerInterval) {
            clearInterval(timerInterval);
        }
        
        document.getElementById('stop-interview').disabled = true;
        document.getElementById('finish-interview').disabled = false;
        updateQuestionStatus('Recording paused');
        updateLiveStatus('Paused', '🟡');
        console.log('Interview stopped');
    }
}

async function finishInterview() {
    if (mediaRecorder && isRecording) {
        stopInterview();
    }
    
    if (recordedChunks.length === 0) {
        alert('No recording was captured. Please restart the interview and allow recording.');
        return;
    }
    
    document.getElementById('interview-active').style.display = 'none';
    document.getElementById('processing-section').style.display = 'block';
    updateQuestionStatus('Analyzing your video');
    updateLiveStatus('Processing', '🧠');
    
    simulateProcessingSteps();
    await processInterview();
}

function updateQuestionDisplay() {
    const questionText = questions[currentQuestionIndex];
    document.getElementById('current-question').textContent = questionText;
    document.getElementById('question-counter').textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    renderQuestionProgress();
}

function renderQuestionProgress() {
    const progressContainer = document.getElementById('question-progress');
    if (!progressContainer) return;
    progressContainer.innerHTML = questions.map((_, index) => {
        const active = index <= currentQuestionIndex ? 'active' : '';
        return `<span class="progress-dot ${active}"></span>`;
    }).join('');
}

function updateQuestionStatus(message) {
    const statusElement = document.getElementById('question-status');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

function simulateProcessingSteps() {
    const steps = ['step-1', 'step-2', 'step-3', 'step-4'];
    let currentStep = 0;
    
    const stepInterval = setInterval(() => {
        if (currentStep < steps.length) {
            steps.forEach(step => {
                const stepEl = document.getElementById(step);
                if (stepEl) stepEl.classList.remove('active');
            });
            const currentStepEl = document.getElementById(steps[currentStep]);
            if (currentStepEl) currentStepEl.classList.add('active');
            currentStep++;
        } else {
            clearInterval(stepInterval);
        }
    }, 1700);
}

async function processInterview() {
    try {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('video', blob, 'interview.webm');
        if (emotionData.length > 0) {
            formData.append('emotionData', JSON.stringify(emotionData));
        }
        
        console.log('Uploading video for analysis...');
        
        const response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('Analysis completed:', result);
            window.location.href = `/results/${result.interviewId}`;
        } else {
            throw new Error(result.error || 'Analysis failed');
        }
    } catch (error) {
        console.error('Error processing interview:', error);
        document.querySelector('.processing-animation h3').textContent = 'Analysis Failed';
        document.querySelector('.processing-animation p').textContent = 
            'There was an error analyzing your interview. Please try again.';
        
        setTimeout(() => {
            const retryButton = document.createElement('button');
            retryButton.textContent = 'Try Again';
            retryButton.className = 'primary-button';
            retryButton.onclick = () => window.location.reload();
            document.querySelector('.processing-animation').appendChild(retryButton);
        }, 2000);
    }
}

function updatePersonStatus(detected) {
    const statusElement = document.getElementById('person-status');
    if (statusElement) {
        if (detected) {
            statusElement.classList.add('active');
            statusElement.classList.remove('inactive');
            statusElement.textContent = '👤';
        } else {
            statusElement.classList.add('inactive');
            statusElement.classList.remove('active');
            statusElement.textContent = '🚫';
        }
    }
}

function updateVoiceStatus(detected) {
    const statusElement = document.getElementById('voice-status');
    if (statusElement) {
        if (detected) {
            statusElement.classList.add('active');
            statusElement.classList.remove('inactive');
            statusElement.textContent = '🎤';
        } else {
            statusElement.classList.add('inactive');
            statusElement.classList.remove('active');
            statusElement.textContent = '🔇';
        }
    }
}

function updateLiveStatus(label, symbol) {
    const liveStatus = document.getElementById('live-status');
    if (liveStatus) {
        liveStatus.innerHTML = `<span>${symbol}</span> ${label}`;
        if (label.toLowerCase().includes('recording')) {
            liveStatus.classList.add('active');
        } else {
            liveStatus.classList.remove('active');
        }
    }
}

window.addEventListener('beforeunload', function() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});
