// Results page functionality
let interviewData = null;

document.addEventListener('DOMContentLoaded', function() {
    const interviewId = getInterviewIdFromURL();
    if (interviewId) {
        loadInterviewResults(interviewId);
    } else {
        showError('No interview ID provided');
    }
    
    setupEventListeners();
});

function getInterviewIdFromURL() {
    const path = window.location.pathname;
    const match = path.match(/\/results\/(.+)/);
    return match ? match[1] : null;
}

async function loadInterviewResults(interviewId) {
    try {
        const response = await fetch(`/api/interviews/${interviewId}`);
        const data = await response.json();
        
        if (data.success) {
            interviewData = data.interview;
            displayResults(interviewData);
        } else {
            throw new Error(data.error || 'Failed to load interview results');
        }
    } catch (error) {
        console.error('Error loading interview results:', error);
        showError('Failed to load interview results. Please try again.');
    }
}

function displayResults(data) {
    // Hide loading, show content
    document.getElementById('loading').style.display = 'none';
    document.getElementById('results-content').style.display = 'block';
    
    // Update overall score
    updateOverallScore(data.overallScore);
    
    // Update score breakdown
    updateScoreBreakdown(data);
    
    // Update metrics
    updateMetrics(data);
    
    // Update transcript
    updateTranscript(data.transcript);
    
    // Update feedback
    updateFeedback(data.feedback);
    
    // Create emotion chart
    createEmotionChart(data.emotions);
    
    console.log('Results displayed successfully');
}

function updateOverallScore(score) {
    const scoreElement = document.getElementById('overall-score');
    animateNumber(scoreElement, 0, score, 2000);
}

function updateScoreBreakdown(data) {
    // Clarity score
    const clarityScore = data.clarityScore || 0;
    const clarityBar = document.getElementById('clarity-bar');
    const clarityValue = document.getElementById('clarity-score');
    
    setTimeout(() => {
        clarityBar.style.width = `${clarityScore}%`;
        animateNumber(clarityValue, 0, clarityScore, 1500, '/100');
    }, 500);
    
    // Confidence score
    const confidenceScore = Math.round((data.averageConfidence || 0) * 100);
    const confidenceBar = document.getElementById('confidence-bar');
    const confidenceValue = document.getElementById('confidence-score');
    
    setTimeout(() => {
        confidenceBar.style.width = `${confidenceScore}%`;
        animateNumber(confidenceValue, 0, confidenceScore, 1500, '%');
    }, 1000);
}

function updateMetrics(data) {
    // Speech rate
    const speechRate = data.speechRate || 0;
    animateNumber(document.getElementById('speech-rate'), 0, speechRate, 1500);
    
    // Filler words
    const fillerWords = data.fillerWords || 0;
    animateNumber(document.getElementById('filler-words'), 0, fillerWords, 1500);
    
    // Pause count
    const pauseCount = data.pauseCount || 0;
    animateNumber(document.getElementById('pause-count'), 0, pauseCount, 1500);
    
    // Duration
    const duration = data.duration || 0;
    document.getElementById('duration').textContent = `${Math.round(duration)}s`;
}

function updateTranscript(transcript) {
    const transcriptElement = document.getElementById('transcript-text');
    if (transcript && transcript.trim()) {
        transcriptElement.textContent = transcript;
    } else {
        transcriptElement.textContent = 'No transcript available.';
    }
}

function updateFeedback(feedback) {
    // Strengths
    const strengthsList = document.getElementById('strengths-list');
    if (feedback.strengths && feedback.strengths.length > 0) {
        strengthsList.innerHTML = feedback.strengths.map(strength => 
            `<li>${strength}</li>`
        ).join('');
    } else {
        strengthsList.innerHTML = '<li>Keep practicing to build your strengths!</li>';
    }
    
    // Improvements
    const improvementsList = document.getElementById('improvements-list');
    if (feedback.improvements && feedback.improvements.length > 0) {
        improvementsList.innerHTML = feedback.improvements.map(improvement => 
            `<li>${improvement}</li>`
        ).join('');
    } else {
        improvementsList.innerHTML = '<li>Great job! No major areas for improvement identified.</li>';
    }
    
    // Tips
    const tipsList = document.getElementById('tips-list');
    if (feedback.tips && feedback.tips.length > 0) {
        tipsList.innerHTML = feedback.tips.map(tip => 
            `<li>${tip}</li>`
        ).join('');
    } else {
        tipsList.innerHTML = '<li>Continue practicing regularly to maintain your skills!</li>';
    }
}

function createEmotionChart(emotions) {
    const ctx = document.getElementById('emotion-chart').getContext('2d');
    
    if (!emotions || emotions.length === 0) {
        // Show placeholder if no emotion data
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = '#4a5568';
        ctx.font = '16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('No emotion data available', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }
    
    // Prepare data for chart
    const labels = emotions.map(e => Math.round(e.timestamp / 1000) + 's');
    const emotionTypes = [...new Set(emotions.map(e => e.emotion))];
    const datasets = emotionTypes.map(emotion => ({
        label: emotion.charAt(0).toUpperCase() + emotion.slice(1),
        data: emotions.map(e => e.emotion === emotion ? e.confidence : 0),
        borderColor: getEmotionColor(emotion),
        backgroundColor: getEmotionColor(emotion, 0.2),
        tension: 0.4,
        fill: false
    }));
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: false
                },
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Confidence Level'
                    },
                    min: 0,
                    max: 1
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        }
    });
}

function getEmotionColor(emotion, alpha = 1) {
    const colors = {
        'neutral': `rgba(102, 126, 234, ${alpha})`,
        'happy': `rgba(72, 187, 120, ${alpha})`,
        'confident': `rgba(56, 161, 105, ${alpha})`,
        'nervous': `rgba(245, 101, 101, ${alpha})`,
        'focused': `rgba(66, 153, 225, ${alpha})`,
        'sad': `rgba(160, 174, 192, ${alpha})`,
        'angry': `rgba(229, 62, 62, ${alpha})`,
        'surprised': `rgba(237, 137, 54, ${alpha})`,
        'fearful': `rgba(155, 89, 182, ${alpha})`,
        'disgusted': `rgba(52, 144, 220, ${alpha})`
    };
    return colors[emotion] || `rgba(102, 126, 234, ${alpha})`;
}

function animateNumber(element, start, end, duration, suffix = '') {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOut);
        
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function setupEventListeners() {
    // Share results functionality
    document.getElementById('share-results').addEventListener('click', shareResults);
}

function shareResults() {
    if (navigator.share && interviewData) {
        navigator.share({
            title: 'My Interview Results',
            text: `I scored ${interviewData.overallScore}/100 on my AI Interview Coach assessment!`,
            url: window.location.href
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare();
        });
    } else {
        fallbackShare();
    }
}

function fallbackShare() {
    // Copy URL to clipboard
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Results URL copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Results URL copied to clipboard!');
    });
}

function showError(message) {
    document.getElementById('loading').innerHTML = `
        <div class="error-message">
            <h3>Error</h3>
            <p>${message}</p>
            <a href="/" class="primary-button">Back to Home</a>
        </div>
    `;
}
