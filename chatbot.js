// Fallback Knowledge Base (used if knowledge.json fails to load, e.g., on local file:// protocol)
const fallbackKnowledge = {
    "identity": {
        "name": "Hrid Raian Khan",
        "role": "Front-End Developer & Computer Engineering Student",
        "about": "Hrid is a passionate Front-End Developer and Computer Engineering student at AIUB."
    },
    "intents": [
        {
            "keywords": ["hi", "hello", "hey", "sup", "greet"],
            "response": "Hello! I'm Hrid's AI assistant. Ask me about his skills, projects, or education!"
        },
        {
            "keywords": ["skill", "java", "cpp", "javascript", "html", "css", "sql", "git", "web"],
            "response": "Hrid is proficient in Java (GUI/OOP), C/C++, Web Development (HTML/CSS/JS), and SQL. He's currently a CSE student at AIUB."
        },
        {
            "keywords": ["education", "study", "university", "aiub", "college", "hsc", "ssc", "gpa"],
            "response": "Hrid is a CSE student at AIUB. He received GPA 5.00 in HSC and GPA 4.83 in SSC."
        },
        {
            "keywords": ["project", "work", "car", "rental", "flappy", "bird"],
            "response": "Hrid built a Car Rental System, a Flappy Bird game, and this portfolio! Check his GitHub (hrid07) for more."
        },
        {
            "keywords": ["contact", "email", "phone", "linkedin", "reach"],
            "response": "Reach Hrid at raiankhanhrid07@gmail.com or +880 1886184059."
        }
    ],
    "synonyms": {
        "university": "aiub", "college": "education", "coding": "skill", "tech": "skill", "c++": "cpp", "mail": "email"
    }
};

let hridKnowledge = fallbackKnowledge; // Default to fallback

// Initialize Chatbot Data
async function initChatbot() {
    try {
        // Try to fetch newest data from JSON
        const response = await fetch('knowledge.json');
        if (response.ok) {
            hridKnowledge = await response.json();
            console.log("Chatbot Knowledge Base updated from JSON.");
        }
    } catch (error) {
        console.warn('Note: Using built-in knowledge base (external JSON fetching is blocked in local file view).');
    }
}

// Call initialization
initChatbot();

function toggleChat() {
    const chat = document.getElementById('chatbot-widget');
    if (!chat) return;
    const isVisible = chat.style.display === 'flex';
    chat.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) document.getElementById('chatbot-input').focus();
}

function handleChatKey(event) {
    if (event.key === 'Enter') sendChatMessage();
}

async function sendChatMessage(presetText = null) {
    const input = document.getElementById('chatbot-input');
    const text = presetText || input.value.trim();
    if (text === '') return;

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
    typingDiv.id = 'typing-indicator-' + Date.now();
    msgContainer.appendChild(typingDiv);
    msgContainer.scrollTop = msgContainer.scrollHeight;
    return typingDiv.id;
}

function removeTyping(id) {
    const indicator = document.getElementById(id);
    if (indicator) indicator.remove();
}

function getResponse(input) {
    const query = input.toLowerCase().replace(/[?.,!]/g, '');
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

        if (highestScore < score) {
            highestScore = score;
            bestIntent = intent;
        }
    });

    if (bestIntent && highestScore > 0.5) return bestIntent.response;

    return "I'm not sure about that. Try asking about my skills, projects, or education! You can also email me at raiankhanhrid07@gmail.com.";
}

function askSuggestion(text) {
    sendChatMessage(text);
}

if (typeof sleep === 'undefined') {
    var sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
}
