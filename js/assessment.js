let currentQuestionIndex = 0;
let responses = [];
let allQuestions = [];
let assessmentSections = [];

const assessmentData = {
    depression: {
        title: "Depression",
        icon: "bi-heart",
        questions: [
            "Little interest or pleasure in doing things",
            "Feeling down, depressed, or hopeless",
            "Trouble falling or staying asleep, or sleeping too much",
            "Feeling tired or having little energy",
            "Poor appetite or overeating"
        ],
        prefix: "Over the last 2 weeks, how often have you been bothered by:",
        options: [
            { text: "Not at all", value: 0 },
            { text: "Several days", value: 1 },
            { text: "More than half the days", value: 2 },
            { text: "Nearly every day", value: 3 }
        ],
        scoring: {
            ranges: [
                { min: 0, max: 2, level: "Minimal", description: "Minimal depression symptoms", color: "minimal", percentage: 0 },
                { min: 3, max: 6, level: "Mild", description: "Mild depression symptoms", color: "mild", percentage: 25 },
                { min: 7, max: 10, level: "Moderate", description: "Moderate depression symptoms", color: "moderate", percentage: 50 },
                { min: 11, max: 15, level: "Severe", description: "Severe depression symptoms", color: "severe", percentage: 75 }
            ]
        }
    },
    anxiety: {
        title: "Anxiety",
        icon: "bi-cloud-lightning",
        questions: [
            "Feeling nervous, anxious or on edge",
            "Not being able to stop or control worrying",
            "Worrying too much about different things",
            "Trouble relaxing",
            "Being so restless that it is hard to sit still"
        ],
        prefix: "Over the last 2 weeks, how often have you been bothered by:",
        options: [
            { text: "Not at all", value: 0 },
            { text: "Several days", value: 1 },
            { text: "More than half the days", value: 2 },
            { text: "Nearly every day", value: 3 }
        ],
        scoring: {
            ranges: [
                { min: 0, max: 2, level: "Minimal", description: "Minimal anxiety symptoms", color: "minimal", percentage: 0 },
                { min: 3, max: 6, level: "Mild", description: "Mild anxiety symptoms", color: "mild", percentage: 25 },
                { min: 7, max: 10, level: "Moderate", description: "Moderate anxiety symptoms", color: "moderate", percentage: 50 },
                { min: 11, max: 15, level: "Severe", description: "Severe anxiety symptoms", color: "severe", percentage: 75 }
            ]
        }
    },
    ptsd: {
        title: "PTSD",
        icon: "bi-shield-exclamation",
        questions: [
            "Repeated, disturbing, and unwanted memories of stressful experiences?",
            "Repeated, disturbing dreams of stressful experiences?",
            "Suddenly feeling or acting as if stressful experiences were happening again?",
            "Feeling very upset when something reminded you of stressful experiences?",
            "Having strong physical reactions when reminded of stressful experiences?"
        ],
        prefix: "In the past month, how much were you bothered by:",
        options: [
            { text: "Not at all", value: 0 },
            { text: "A little bit", value: 1 },
            { text: "Moderately", value: 2 },
            { text: "Quite a bit", value: 3 },
            { text: "Extremely", value: 4 }
        ],
        scoring: {
            ranges: [
                { min: 0, max: 5, level: "Minimal", description: "Minimal PTSD symptoms", color: "minimal", percentage: 0 },
                { min: 6, max: 10, level: "Mild", description: "Mild PTSD symptoms", color: "mild", percentage: 25 },
                { min: 11, max: 15, level: "Moderate", description: "Moderate PTSD symptoms", color: "moderate", percentage: 50 },
                { min: 16, max: 20, level: "Severe", description: "Severe PTSD symptoms", color: "severe", percentage: 75 }
            ]
        }
    },
    wellbeing: {
        title: "Well-being",
        icon: "bi-sun",
        questions: [
            "I have felt cheerful and in good spirits",
            "I have felt calm and relaxed",
            "I have felt active and vigorous",
            "I woke up feeling fresh and rested",
            "My daily life has been filled with things that interest me"
        ],
        prefix: "Over the past two weeks, how often have you felt this way:",
        options: [
            { text: "All of the time", value: 5 },
            { text: "Most of the time", value: 4 },
            { text: "More than half of the time", value: 3 },
            { text: "Less than half of the time", value: 2 },
            { text: "Some of the time", value: 1 },
            { text: "At no time", value: 0 }
        ],
        scoring: {
            ranges: [
                { min: 0, max: 12, level: "Poor", description: "Poor well-being", color: "severe", percentage: 75 },
                { min: 13, max: 15, level: "Below Average", description: "Below average well-being", color: "moderate", percentage: 50 },
                { min: 16, max: 19, level: "Average", description: "Average well-being", color: "mild", percentage: 25 },
                { min: 20, max: 25, level: "Good", description: "Good well-being", color: "minimal", percentage: 0 }
            ]
        }
    }
};

function startUnifiedAssessment() {
    allQuestions = [];
    assessmentSections = [];
    
    Object.keys(assessmentData).forEach(sectionKey => {
        const section = assessmentData[sectionKey];
        section.questions.forEach((question, index) => {
            allQuestions.push({
                section: sectionKey,
                sectionTitle: section.title,
                sectionIcon: section.icon,
                questionIndex: index,
                question: question,
                prefix: section.prefix,
                options: section.options
            });
        });
        
        assessmentSections.push({
            key: sectionKey,
            title: section.title,
            startIndex: allQuestions.length - section.questions.length,
            endIndex: allQuestions.length - 1,
            totalQuestions: section.questions.length
        });
    });
    
    currentQuestionIndex = 0;
    responses = new Array(allQuestions.length).fill(undefined);

    document.getElementById('assessment-intro').style.display = 'none';
    document.getElementById('assessment-form').style.display = 'block';
    document.getElementById('results-section').style.display = 'none';
    
    renderQuestion();
    updateProgress();
}

function renderQuestion() {
    const container = document.getElementById('questions-container');
    const questionData = allQuestions[currentQuestionIndex];
    
    // Update section indicator
    const currentSection = assessmentSections.find(section => 
        currentQuestionIndex >= section.startIndex && currentQuestionIndex <= section.endIndex
    );
    const sectionQuestionIndex = currentQuestionIndex - currentSection.startIndex + 1;
    document.getElementById('section-indicator').textContent = 
        `${currentSection.title} - Question ${sectionQuestionIndex} of ${currentSection.totalQuestions}`;
    
    container.innerHTML = `
        <div class="question-card active">
            <div class="question-title">
                <i class="${questionData.sectionIcon} me-2"></i>
                Question ${currentQuestionIndex + 1} of ${allQuestions.length}
            </div>
            <div class="question-prefix mb-3">
                <small class="text-muted">${questionData.prefix}</small>
            </div>
            <p class="question-text">${questionData.question}</p>
            <div class="question-options">
                <div class="option-group">
                    ${questionData.options.map((option, index) => `
                        <div class="option-item" onclick="selectOption(${option.value})">
                            <input type="radio" name="question_${currentQuestionIndex}" value="${option.value}" id="option_${index}">
                            <label for="option_${index}">${option.text}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Update navigation buttons
    document.getElementById('prev-btn').style.display = currentQuestionIndex > 0 ? 'inline-block' : 'none';
    document.getElementById('next-btn').style.display = currentQuestionIndex < allQuestions.length - 1 ? 'inline-block' : 'none';
    document.getElementById('submit-btn').style.display = currentQuestionIndex === allQuestions.length - 1 ? 'inline-block' : 'none';
    
    // Restore previous answer if exists
    if (responses[currentQuestionIndex] !== undefined) {
        selectOption(responses[currentQuestionIndex], false);
    }
}

function selectOption(value, advance = false) {
    responses[currentQuestionIndex] = value;
    
    // Update UI
    const options = document.querySelectorAll('.option-item');
    options.forEach(option => option.classList.remove('selected'));
    
    const selectedOption = document.querySelector(`input[value="${value}"]`).closest('.option-item');
    selectedOption.classList.add('selected');
    
    // Check the radio button
    document.querySelector(`input[value="${value}"]`).checked = true;
}

function nextQuestion() {
    if (responses[currentQuestionIndex] === undefined) {
        alert('Please select an answer before proceeding.');
        return;
    }
    
    if (currentQuestionIndex < allQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
        updateProgress();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
        updateProgress();
    }
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
}

function submitAssessment() {
    if (responses[currentQuestionIndex] === undefined) {
        alert('Please answer the current question before submitting.');
        return;
    }
    
    // Calculate scores for each assessment
    const results = {};
    
    assessmentSections.forEach(section => {
        const sectionResponses = responses.slice(section.startIndex, section.endIndex + 1);
        const totalScore = sectionResponses.reduce((sum, value) => sum + value, 0);
        
        const scoreRange = assessmentData[section.key].scoring.ranges.find(range => 
            totalScore >= range.min && totalScore <= range.max
        );
        
        results[section.key] = {
            title: section.title,
            icon: assessmentData[section.key].icon,
            score: totalScore,
            maxScore: assessmentData[section.key].questions.length * Math.max(...assessmentData[section.key].options.map(o => o.value)),
            level: scoreRange.level,
            description: scoreRange.description,
            color: scoreRange.color,
            percentage: scoreRange.percentage || Math.round((totalScore / (assessmentData[section.key].questions.length * Math.max(...assessmentData[section.key].options.map(o => o.value)))) * 100)
        };
    });
    
    showVisualResults(results);
}

function showVisualResults(results) {
    document.getElementById('assessment-form').style.display = 'none';
    document.getElementById('results-section').style.display = 'block';
    
    const resultsContainer = document.getElementById('results-content');
    const overallContainer = document.getElementById('overall-recommendations');
    
    // Generate visual results
    let resultsHTML = '<div class="mental-health-levels">';
    
    const conditions = ['depression', 'anxiety', 'ptsd', 'wellbeing'];
    
    conditions.forEach(condition => {
        const result = results[condition];
        const percentage = result.percentage;
        
        resultsHTML += `
            <div class="condition-level-display">
                <div class="condition-header-display">
                    <div class="condition-icon-large">
                        <i class="${result.icon}"></i>
                    </div>
                    <div class="condition-info">
                        <h4>${result.title}</h4>
                        <div class="level-badge ${result.color}">${result.level}</div>
                    </div>
                </div>
                
                <div class="level-bar-container">
                    <div class="level-bar">
                        <div class="level-fill ${result.color}" style="width: ${percentage}%"></div>
                    </div>
                    <div class="level-text">${percentage}%</div>
                </div>
                
                <p class="condition-description-small">${result.description}</p>
            </div>
        `;
    });
    
    resultsHTML += '</div>';
    resultsContainer.innerHTML = resultsHTML;
    
    // Generate overall recommendations
    const detectedConditions = conditions.filter(condition => 
        results[condition].color !== 'minimal' && condition !== 'wellbeing'
    );
    
    let overallHTML = '';
    
    if (detectedConditions.length === 0) {
        overallHTML = `
            <div class="overall-recommendations" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%);">
                <h5><i class="bi-check-circle-fill me-2"></i>Overall Assessment: Positive Mental Health</h5>
                <p>Your responses indicate generally positive mental health across all areas assessed.</p>
                <ul>
                    <li>Continue maintaining good mental health habits</li>
                    <li>Regular exercise, adequate sleep, and social connections</li>
                    <li>Use our mood calendar to track your mental wellness</li>
                    <li>Consider our relaxing sounds for stress management</li>
                </ul>
            </div>
        `;
    } else {
        const conditionNames = detectedConditions.map(c => results[c].title).join(', ');
        const hasSevere = detectedConditions.some(c => results[c].color === 'severe');
        
        overallHTML = `
            <div class="overall-recommendations">
                <h5><i class="bi-info-circle-fill me-2"></i>Areas of Concern Identified</h5>
                <p>Your assessment indicates symptoms in: <strong>${conditionNames}</strong></p>
                <ul>
                    ${hasSevere ? '<li><strong>We recommend seeking professional help</strong></li>' : '<li>Consider speaking with a mental health professional</li>'}
                    <li>Use our appointment booking system to connect with a therapist</li>
                    <li>Practice self-care: regular exercise, adequate sleep, healthy eating</li>
                    <li>Monitor your symptoms using our mood calendar</li>
                    <li>Try our relaxing sounds for stress relief</li>
                </ul>
            </div>
        `;
    }
    
    overallContainer.innerHTML = overallHTML;
}

function backToIntro() {
    document.getElementById('assessment-intro').style.display = 'block';
    document.getElementById('assessment-form').style.display = 'none';
    document.getElementById('results-section').style.display = 'none';
    
    // Reset state
    currentQuestionIndex = 0;
    responses = [];
    allQuestions = [];
    assessmentSections = [];
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Unified Mental Health Assessment page loaded (20 questions)');
});
