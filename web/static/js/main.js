// API base URL
const API_BASE_URL = 'http://localhost:8000';

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Navigation
    const navButtons = document.querySelectorAll('[data-section]');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Dashboard elements
    const checkHealthBtn = document.getElementById('check-health-btn');
    const generatePostBtn = document.getElementById('generate-post-btn');
    const apiStatus = document.getElementById('api-status');
    
    // Content generator elements
    const contentForm = document.getElementById('content-form');
    const contentResult = document.getElementById('content-result');
    const contentLength = document.getElementById('content-length');
    const lengthValue = document.getElementById('length-value');
    const copyContentBtn = document.getElementById('copy-content-btn');
    const saveContentBtn = document.getElementById('save-content-btn');
    
    // Engagement elements
    const engagementForm = document.getElementById('engagement-form');
    const engagementResult = document.getElementById('engagement-result');
    
    // Personality elements
    const customPrompt = document.getElementById('custom-prompt');
    const generateCustomBtn = document.getElementById('generate-custom-btn');
    const customResult = document.getElementById('custom-result');
    const personalityConfig = document.getElementById('personality-config');
    const refreshConfigBtn = document.getElementById('refresh-config-btn');
    
    // Initialize
    init();
    
    // Event Listeners
    function setupEventListeners() {
        // Navigation
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const targetSection = button.getAttribute('data-section');
                contentSections.forEach(section => {
                    section.classList.add('d-none');
                });
                document.getElementById(`${targetSection}-section`).classList.remove('d-none');
            });
        });
        
        // Dashboard
        checkHealthBtn.addEventListener('click', checkApiHealth);
        generatePostBtn.addEventListener('click', quickGeneratePost);
        
        // Content Generator
        contentForm.addEventListener('submit', handleContentGeneration);
        contentLength.addEventListener('input', updateLengthValue);
        copyContentBtn.addEventListener('click', copyContentToClipboard);
        saveContentBtn.addEventListener('click', saveContent);
        
        // Engagement
        engagementForm.addEventListener('submit', handleEngagement);
        
        // Personality
        generateCustomBtn.addEventListener('click', generateCustomResponse);
        refreshConfigBtn.addEventListener('click', loadPersonalityConfig);
    }
    
    // Initialize app
    function init() {
        setupEventListeners();
        checkApiHealth();
        loadPersonalityConfig();
    }
    
    // API Functions
    async function checkApiHealth() {
        try {
            apiStatus.textContent = 'Checking...';
            apiStatus.className = 'badge bg-secondary';
            
            const response = await fetch(`${API_BASE_URL}/health`);
            const data = await response.json();
            
            if (data.status === 'healthy') {
                apiStatus.textContent = 'Healthy';
                apiStatus.className = 'badge bg-success';
            } else {
                apiStatus.textContent = 'Unhealthy';
                apiStatus.className = 'badge bg-danger';
            }
        } catch (error) {
            console.error('Error checking API health:', error);
            apiStatus.textContent = 'Error';
            apiStatus.className = 'badge bg-danger';
        }
    }
    
    // Content functions
    async function handleContentGeneration(e) {
        e.preventDefault();
        
        const topic = document.getElementById('content-topic').value;
        const type = document.getElementById('content-type').value;
        const tone = document.getElementById('content-tone').value;
        const length = document.getElementById('content-length').value;
        
        contentResult.innerHTML = '<p class="text-muted">Generating content...</p>';
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/content/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic: topic,
                    content_type: type,
                    tone: tone,
                    word_count: parseInt(length)
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                contentResult.innerHTML = `<p>${data.content}</p>`;
            } else {
                contentResult.innerHTML = `<p class="text-danger">Error: ${data.message || 'Failed to generate content'}</p>`;
            }
        } catch (error) {
            console.error('Error generating content:', error);
            contentResult.innerHTML = '<p class="text-danger">Error: Failed to connect to the server</p>';
        }
    }
    
    function updateLengthValue() {
        lengthValue.textContent = contentLength.value;
    }
    
    function copyContentToClipboard() {
        const content = contentResult.innerText;
        navigator.clipboard.writeText(content)
            .then(() => {
                const originalText = copyContentBtn.textContent;
                copyContentBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyContentBtn.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
            });
    }
    
    function saveContent() {
        // This would typically save to a database
        // For MVP, we'll just indicate success
        const originalText = saveContentBtn.textContent;
        saveContentBtn.textContent = 'Saved!';
        setTimeout(() => {
            saveContentBtn.textContent = originalText;
        }, 2000);
    }
    
    async function quickGeneratePost() {
        const topics = ['country lifestyle', 'gun rights', 'freedom of speech', 'small business', 'patriotism'];
        const randomTopic = topics[Math.floor(Math.random() * topics.length)];
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/content/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic: randomTopic,
                    content_type: 'post',
                    tone: 'passionate',
                    word_count: 150
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Post generated successfully:\n\n' + data.content);
            } else {
                alert('Error: ' + (data.message || 'Failed to generate post'));
            }
        } catch (error) {
            console.error('Error generating quick post:', error);
            alert('Error: Failed to connect to the server');
        }
    }
    
    // Engagement functions
    async function handleEngagement(e) {
        e.preventDefault();
        
        const type = document.getElementById('interaction-type').value;
        const userType = document.getElementById('user-type').value;
        const message = document.getElementById('message-content').value;
        
        engagementResult.innerHTML = '<p class="text-muted">Processing interaction...</p>';
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/engagement/interact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type: type,
                    message: message,
                    user_type: userType
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                engagementResult.innerHTML = `<p>${data.response}</p>`;
            } else {
                engagementResult.innerHTML = `<p class="text-danger">Error: ${data.message || 'Failed to process interaction'}</p>`;
            }
        } catch (error) {
            console.error('Error processing interaction:', error);
            engagementResult.innerHTML = '<p class="text-danger">Error: Failed to connect to the server</p>';
        }
    }
    
    // Personality functions
    async function generateCustomResponse() {
        const prompt = customPrompt.value;
        
        if (!prompt) {
            customResult.innerHTML = '<p class="text-danger">Please enter a prompt</p>';
            return;
        }
        
        customResult.innerHTML = '<p class="text-muted">Generating response...</p>';
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/personality/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                customResult.innerHTML = `<p>${data.response}</p>`;
            } else {
                customResult.innerHTML = `<p class="text-danger">Error: ${data.message || 'Failed to generate response'}</p>`;
            }
        } catch (error) {
            console.error('Error generating custom response:', error);
            customResult.innerHTML = '<p class="text-danger">Error: Failed to connect to the server</p>';
        }
    }
    
    async function loadPersonalityConfig() {
        personalityConfig.innerHTML = '<p class="text-muted">Loading configuration...</p>';
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/personality/config`);
            const data = await response.json();
            
            if (data.success) {
                // Format the config as JSON with indentation
                const formattedConfig = JSON.stringify(data.config, null, 4);
                personalityConfig.innerHTML = `<pre>${formattedConfig}</pre>`;
            } else {
                personalityConfig.innerHTML = `<p class="text-danger">Error: ${data.message || 'Failed to load configuration'}</p>`;
            }
        } catch (error) {
            console.error('Error loading personality config:', error);
            personalityConfig.innerHTML = '<p class="text-danger">Error: Failed to connect to the server</p>';
        }
    }
}); 