

// Default Fallback Knowledge
const fallbackKnowledge = {
    "identity": {
        "name": "Hrid Raian Khan",
        "role": "Front-End Developer & Computer Engineering Student",
        "about": "Hrid is a passionate Front-End Developer and Computer Engineering student at AIUB."
    },
    "intents": [
        { "keywords": ["hi", "hello", "hey"], "response": "Hello! I'm Hrid's AI assistant. Ask me about his skills, projects, or education!" },
        { "keywords": ["skill", "java", "cpp", "javascript", "html", "css", "sql"], "response": "Hrid is proficient in Java, C/C++, Web Development, and SQL." },
        { "keywords": ["education", "study", "aiub", "college"], "response": "Hrid is a CSE student at AIUB, with excellent HSC and SSC results." },
        { "keywords": ["project", "work", "car", "flappy"], "response": "Hrid built a Car Rental System, Flappy Bird game, and his portfolio!" },
        { "keywords": ["contact", "email", "phone"], "response": "Reach Hrid at raiankhanhrid07@gmail.com or +880 1886184059." }
    ],
    "synonyms": {
        "university": "aiub", "college": "education", "coding": "skill", "c++": "cpp", "mail": "email"
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

// Initialize Chatbot logic and UI listeners once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    // Start knowledge base initialization (don't block listeners)
    initChatbot();

    // UI Elements
    const triggerBtn = document.getElementById('chatbot-trigger');
    const closeBtn = document.getElementById('close-chat');
    const sendBtn = document.getElementById('send-btn');
    const input = document.getElementById('chatbot-input');
    const suggestionSpans = document.querySelectorAll('#chatbot-suggestions span');

    // Event Listeners
    if (triggerBtn) triggerBtn.addEventListener('click', toggleChat);
    if (closeBtn) closeBtn.addEventListener('click', toggleChat);
    if (sendBtn) sendBtn.addEventListener('click', () => sendChatMessage());
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }

    suggestionSpans.forEach(span => {
        span.addEventListener('click', () => {
            const suggestion = span.getAttribute('data-suggestion');
            askSuggestion(suggestion);
        });
    });

    console.log("Chatbot ready and listeners attached!");
});


function toggleChat() {
    const chat = document.getElementById('chatbot-widget');
    if (!chat) return;

    // Check current display state more reliably
    const isVisible = window.getComputedStyle(chat).display !== 'none';
    chat.style.display = isVisible ? 'none' : 'flex';

    if (chat.style.display === 'flex') {
        const input = document.getElementById('chatbot-input');
        if (input) input.focus();
    }
}


async function sendChatMessage(presetText = null) {
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
    if (!hridKnowledge || !hridKnowledge.intents) {
        return "I'm still learning. Please try again in a moment!";
    }

    const query = input.toLowerCase().replace(/[?.,!]/g, '');
    const tokens = query.split(/\s+/);

    const matches = [];

    hridKnowledge.intents.forEach(intent => {
        let score = 0;

        // 1. Keyword matching (tokens and substring)
        intent.keywords.forEach(keyword => {
            if (tokens.includes(keyword)) {
                score += 3; // Direct token match
            } else if (query.includes(keyword)) {
                score += 1.5; // Substring match
            }
        });

        // 2. Synonym matching
        tokens.forEach(token => {
            if (hridKnowledge.synonyms && hridKnowledge.synonyms[token]) {
                const mapped = hridKnowledge.synonyms[token];
                if (intent.keywords.includes(mapped)) {
                    score += 2.5;
                }
            }
        });

        // If score is significant, add to matches
        if (score >= 2.5) {
            matches.push({ intent, score });
        }
    });

    // Sort matches by score descending
    matches.sort((a, b) => b.score - a.score);

    // If matches found, combine unique responses
    if (matches.length > 0) {
        // Use a Set to avoid duplicate responses if keywords overlap
        const responses = [...new Set(matches.map(m => m.intent.response))];

        // If there's a greeting, it usually should come first
        const greetingIndex = matches.findIndex(m => m.intent.keywords.includes('hi') || m.intent.keywords.includes('hello'));
        if (greetingIndex > 0) {
            const greeting = responses.splice(greetingIndex, 1)[0];
            responses.unshift(greeting);
        }

        return responses.join(' ');
    }

    // Fallback if no strong matches
    return "I'm not sure about that. You can ask about skills, projects, or education, or contact Hrid.";
}

function askSuggestion(text) {
    sendChatMessage(text);
}

