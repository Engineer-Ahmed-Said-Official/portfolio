// Common JavaScript functionality

// Scroll Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Initialize scroll animations
function initScrollAnimations() {
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
}); 