// Disable right-click on the iframe to prevent downloads
document.querySelectorAll('iframe').forEach(iframe => {
    iframe.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
});

// Track if animation is in progress
let isAnimating = false;

// Function to handle Learn More About Me section
function handleLearnMoreSection() {
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    if (!learnMoreBtn) return;

    learnMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the about section
        const aboutSection = document.querySelector('#about');
        if (!aboutSection) return;

        // Get the navbar height
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;

        // Calculate the target position
        const targetPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;

        // Disable the button
        this.style.pointerEvents = 'none';
        this.style.opacity = '0.7';

        // Smooth scroll to the about section
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Re-enable the button after animation
        setTimeout(() => {
            this.style.pointerEvents = 'auto';
            this.style.opacity = '1';
        }, 1000);
    });
}

// Function to handle other anchor links
function handleOtherAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.id !== 'learnMoreBtn') {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Handle Learn More About Me section separately
    handleLearnMoreSection();
    
    // Handle other anchor links
    handleOtherAnchorLinks();
});

// Add scroll event listener for fade-in animations
window.addEventListener('scroll', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
});

