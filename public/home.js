// Home page functionality
document.addEventListener('DOMContentLoaded', function() {
    loadInterviewHistory();
});

async function loadInterviewHistory() {
    try {
        const response = await fetch('/api/interviews');
        const data = await response.json();
        
        if (data.success) {
            displayInterviewHistory(data.interviews);
        } else {
            console.error('Failed to load interview history:', data.error);
        }
    } catch (error) {
        console.error('Error loading interview history:', error);
    }
}

function displayInterviewHistory(interviews) {
    const container = document.getElementById('interview-history');
    
    if (!interviews || interviews.length === 0) {
        container.innerHTML = `
            <div class="interview-item">
                <h3>No interviews yet</h3>
                <p>Start your first mock interview to see your results here!</p>
                <a href="/interview" class="primary-button" style="margin-top: 1rem; display: inline-block;">
                    Start Interview
                </a>
            </div>
        `;
        return;
    }
    
    const interviewHTML = interviews.map(interview => {
        const date = new Date(interview.createdAt).toLocaleDateString();
        const time = new Date(interview.createdAt).toLocaleTimeString();
        const duration = interview.duration ? `${Math.round(interview.duration)}s` : 'N/A';
        
        return `
            <div class="interview-item">
                <h3>Interview from ${date}</h3>
                <p>Time: ${time} | Duration: ${duration}</p>
                <div class="interview-score">Score: ${interview.overallScore}/100</div>
                <a href="/results/${interview._id}" class="secondary-button" style="margin-top: 1rem; display: inline-block;">
                    View Results
                </a>
            </div>
        `;
    }).join('');
    
    container.innerHTML = interviewHTML;
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
