// ========================
// Chatbot.js - Safe Version
// ========================

// Default Fallback Knowledge
const fallbackKnowledge = {
    "identity": {
        "name": "Hrid Raian Khan",
        "role": "Front-End Developer & Computer Engineering Student",
        "about": "Hrid is a passionate Front-End Developer and Computer Engineering student at AIUB."
    },
    "intents": [
        { "keywords": ["hi","hello","hey"], "response": "Hello! I'm Hrid's AI assistant. Ask me about his skills, projects, or education!" },
        { "keywords": ["skill","java","cpp","javascript","html","css","sql"], "response": "Hrid is proficient in Java, C/C++, Web Development, and SQL." },
        { "keywords": ["education","study","aiub","college"], "response": "Hrid is a CSE student at AIUB, with excellent HSC and SSC results." },
        { "keywords": ["project","work","car","flappy"], "response": "Hrid built a Car Rental System, Flappy Bird game, and his portfolio!" },
        { "keywords": ["contact","email","phone"], "response": "Reach Hrid at raiankhanhrid07@gmail.com or +880 1886184059." }
    ],
    "synonyms": {
        "university":"aiub","college":"education","coding":"skill","c++":"cpp","mail":"email"
    }
};

// Global knowledge variable
let hridKnowledge = fallbackKnowledge;

// Initialize Chatbot
async function initChatbot() {
    try {
        const response = await fetch('knowledge.json');
        if (response.ok) {
            hridKnowledge = await response.json();
            console.log("Chatbot Knowledge Base loaded from JSON.");
        } else {
            console.warn("knowledge.json not found. Using fallback.");
        }
    } catch (err) {
        console.warn("Using fallback knowledge. Error fetching JSON:", err);
    }
}

// Wait until DOM is loaded and chatbot is ready
window.addEventListener('DOMContentLoaded', async () => {
    await initChatbot();

    // Toggle button
    const toggleBtn = document.getElementById('chatbot-toggle');
    if (toggleBtn) toggleBtn.addEventListener('click', toggleChat);

    // Input enter key
    const input = document.getElementById('chatbot-input');
    if (input) input.addEventListener('keydown', handleChatKey);

    console.log("Chatbot ready!");
});

// --------------------
// Chatbot UI Functions
// --------------------
function toggleChat() {
    const chat = document.getElementById('chatbot-widget');
    if (!chat) return;
    chat.style.display = chat.style.display === 'flex' ? 'none' : 'flex';
    if (chat.style.display === 'flex') document.getElementById('chatbot-input').focus();
}

function handleChatKey(event) {
    if (event.key === 'Enter') sendChatMessage();
}

async function sendChatMessage(presetText=null) {
    const input = document.getElementById('chatbot-input');
    const text = presetText || input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    if (!presetText) input.value = '';

    const typingId = showTyping();
    await sleep(Math.random() * 600 + 400);
    removeTyping(typingId);

    const response = getResponse(text);
    addMessage(response, 'bot');
}

function addMessage(text, sender) {
    const msgContainer = document.getElementById('chatbot-messages');
    if (!msgContainer) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    msgDiv.innerText = text;
    msgContainer.appendChild(msgDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

function showTyping() {
    const msgContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    typingDiv.id = 'typing-' + Date.now();
    msgContainer.appendChild(typingDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    return typingDiv.id;
}

function removeTyping(id) {
    const indicator = document.getElementById(id);
    if (indicator) indicator.remove();
}

// --------------------
// Chatbot Logic
// --------------------
function getResponse(input) {
    const query = input.toLowerCase().replace(/[?.,!]/g,'');
    const tokens = query.split(/\s+/);

    let bestIntent = null;
    let highestScore = 0;

    hridKnowledge.intents.forEach(intent => {
        let score = 0;
        intent.keywords.forEach(keyword => {
            if (tokens.includes(keyword)) score += 3;
            else if (query.includes(keyword)) score += 1;
        });

        tokens.forEach(token => {
            if (hridKnowledge.synonyms[token]) {
                const mapped = hridKnowledge.synonyms[token];
                if (intent.keywords.includes(mapped)) score += 2;
            }
        });

        if (score > highestScore) {
            highestScore = score;
            bestIntent = intent;
        }
    });

    if (bestIntent && highestScore > 0.5) return bestIntent.response;

    return "I'm not sure about that. You can ask about skills, projects, or education, or contact Hrid.";
}

// --------------------
// Utility
// --------------------
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
window.addEventListener('DOMContentLoaded', async () => {
    await initChatbot();

    // Toggle chatbot open/close
    document.getElementById('chatbot-trigger').addEventListener('click', toggleChat);
    document.getElementById('close-chat').addEventListener('click', toggleChat);

    // Send message on enter
    const input = document.getElementById('chatbot-input');
    input.addEventListener('keypress', handleChatKey);

    // Send button
    document.getElementById('send-btn').addEventListener('click', sendChatMessage);

    // Suggestion buttons
    const suggestions = document.querySelectorAll('#chatbot-suggestions span');
    suggestions.forEach(span => {
        span.addEventListener('click', () => askSuggestion(span.dataset.suggestion));
    });
});