// Blog Data
const blogPosts = [
    {
        id: 1,
        title: "Mastering Java GUI with Swing",
        description: "A deep dive into building interactive desktop applications using Java Swing and OOP principles.",
        date: "Feb 15, 2026",
        tags: ["Java", "OOP", "GUI"],
        content: `
            <h2>Introduction</h2>
            <p>Java Swing remains a powerful toolkit for creating cross-platform desktop applications. In this post, we'll explore how to structure your GUI code effectively.</p>
            <h3>MVC Pattern</h3>
            <p>Always separate your logic from your view. This makes your application scalable and much easier to debug.</p>
            <h3>Modern Styling</h3>
            <p>Even though Swing is old, you can use FlatLaf or custom rendering to make it look premium.</p>
        `
    },
    {
        id: 2,
        title: "The Future of AI in Web Design",
        description: "How generative AI is changing the landscape of frontend development and user experience.",
        date: "Feb 10, 2026",
        tags: ["AI", "Design", "Trends"],
        content: `
            <h2>The AI Revolution</h2>
            <p>AI is no longer just a buzzword; it's a fundamental shift in how we build interfaces.</p>
            <h3>Automated Workflows</h3>
            <p>Tools like v0 and Cursor are accelerating implementation phases by 10x.</p>
        `
    },
    {
        id: 3,
        title: "Scalable CSS Architecture",
        description: "Best practices for writing maintainable CSS in large-scale projects without using frameworks.",
        date: "Jan 28, 2026",
        tags: ["CSS", "Architecture"],
        content: `
            <h2>CSS Variables are Key</h2>
            <p>Using CSS variables (custom properties) allows for easy theming and consistent spacing across your app.</p>
        `
    }
];

let currentTag = 'All';

// Initialize Blog
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('blog-grid')) {
        renderPosts(blogPosts);
    }
});

function renderPosts(posts) {
    const grid = document.getElementById('blog-grid');
    if (!grid) return;
    grid.innerHTML = '';

    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'blog-card';
        card.innerHTML = `
            <div class="blog-card-content">
                <span class="blog-date">${post.date}</span>
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <div class="blog-tags">
                    ${post.tags.map(tag => `<span>#${tag}</span>`).join(' ')}
                </div>
                <button onclick="openPost(${post.id})" class="read-more">Read More</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterPosts() {
    const searchTerm = document.getElementById('blog-search').value.toLowerCase();
    const filtered = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm) ||
            post.description.toLowerCase().includes(searchTerm);
        const matchesTag = currentTag === 'All' || post.tags.includes(currentTag);
        return matchesSearch && matchesTag;
    });
    renderPosts(filtered);
}

function filterByTag(tag) {
    currentTag = tag;

    // Update active button
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText === tag);
    });

    filterPosts();
}

// In-page Post Overlay Logic
function openPost(id) {
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;

    const overlay = document.getElementById('post-overlay');
    document.getElementById('post-title').innerText = post.title;
    document.getElementById('post-date').innerText = post.date;
    document.getElementById('post-content').innerHTML = post.content;

    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closePost() {
    const overlay = document.getElementById('post-overlay');
    overlay.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close overlay on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePost();
    }
});
