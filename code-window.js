// Code examples for each language
const codeExamples = {
    python: `print("Hello, World!")`,
    
    java: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    
    javascript: `console.log("Hello, World!");`,
    
    nodejs: `const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World from Node.js!');
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});`,
    
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>`,

    css: `/* Hello World in CSS */
.hello-world {
    color: #00ff00;
    font-size: 24px;
    text-align: center;
    animation: glow 2s infinite;
}

@keyframes glow {
    0% { text-shadow: 0 0 5px #00ff00; }
    50% { text-shadow: 0 0 20px #00ff00; }
    100% { text-shadow: 0 0 5px #00ff00; }
}`
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const codeWindow = document.querySelector('.code-window');
    const codeWindowOverlay = document.querySelector('.code-window-overlay');
    const codeWindowClose = document.querySelector('.code-window-close');
    const codeContent = document.getElementById('code-content');
    const skillItems = document.querySelectorAll('.skill-item');

    // Debug check for elements
    console.log('Code Window:', codeWindow);
    console.log('Skill Items:', skillItems);

    // Function to highlight code syntax
    function highlightCode(code, language) {
        // Simple syntax highlighting
        return code
            .replace(/(\/\/.*|\#.*)/g, '<span class="comment">$1</span>')
            .replace(/(".*?"|'.*?')/g, '<span class="string">"$1"</span>')
            .replace(/\b(public|class|static|void|print|console|log|DOCTYPE|html|head|body|meta|title|h1)\b/g, '<span class="keyword">$1</span>')
            .replace(/\b(HelloWorld|main|println)\b/g, '<span class="function">$1</span>')
            .replace(/\b(String|System)\b/g, '<span class="class">$1</span>')
            .replace(/(&lt;!--.*?--&gt;)/g, '<span class="comment">$1</span>')
            .replace(/(&lt;\/?[a-z0-9]+(&gt;)?)/g, '<span class="keyword">$1</span>');
    }

    // Function to show code window
    function showCodeWindow(language) {
        console.log('Showing code window for:', language);
        const code = codeExamples[language];
        if (code) {
            codeContent.innerHTML = highlightCode(code, language);
            codeWindow.classList.add('active');
            codeWindowOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Function to hide code window
    function hideCodeWindow() {
        console.log('Hiding code window');
        codeWindow.classList.remove('active');
        codeWindowOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Add click event listeners
    skillItems.forEach(item => {
        item.addEventListener('click', (e) => {
            console.log('Skill item clicked:', item.dataset.language);
            const language = item.dataset.language;
            showCodeWindow(language);
        });
    });

    // Add close button listener
    if (codeWindowClose) {
        codeWindowClose.addEventListener('click', hideCodeWindow);
    }

    // Add overlay click listener
    if (codeWindowOverlay) {
        codeWindowOverlay.addEventListener('click', hideCodeWindow);
    }

    // Close window on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && codeWindow.classList.contains('active')) {
            hideCodeWindow();
        }
    });
}); 