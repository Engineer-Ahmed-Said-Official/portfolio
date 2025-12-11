// Disable right-click on the iframe to prevent downloads
document.querySelectorAll('iframe').forEach(iframe => {
    iframe.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
});

// Track if animation is in progress
let isAnimating = false;

// Theme Toggle Functionality
// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
        console.warn('Theme toggle button not found');
        return; // Guard clause if button missing
    }

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';

    // Set initial theme
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
    }
    updateThemeIcon(savedTheme === 'dark');

    // Theme toggle function
    function toggleTheme(e) {
        // Prevent default behavior and stop propagation
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        console.log('Theme toggled from', currentTheme, 'to', newTheme);

        // Update theme
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark-theme');
        } else {
            document.documentElement.classList.remove('dark-theme');
        }
        localStorage.setItem('theme', newTheme);

        // Update icon
        updateThemeIcon(newTheme === 'dark');

        // Refresh particles theme immediately
        if (typeof updateParticlesTheme === 'function') {
            updateParticlesTheme(newTheme);
        }
    }

    // Add click event listener
    themeToggle.addEventListener('click', toggleTheme);

    // Add touchstart event listener for better mobile support
    themeToggle.addEventListener('touchstart', function (e) {
        // Only handle if it's a simple tap, not a scroll
        toggleTheme(e);
    }, { passive: false });

    console.log('Theme toggle initialized successfully');
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector('#themeToggle i');
    if (!icon) {
        console.warn('Theme toggle icon not found');
        return;
    }
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Function to handle Learn More About Me section
function handleLearnMoreSection() {
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    if (!learnMoreBtn) return;

    learnMoreBtn.addEventListener('click', function (e) {
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
            anchor.addEventListener('click', function (e) {
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

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    handleLearnMoreSection();
    initThemeToggle();

    // Add scroll event listener for fade-in animations
    window.addEventListener('scroll', function () {
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    });

    // Image Modal (Popup) logic for project images
    const modal = document.getElementById('imgModal');
    const modalImg = document.getElementById('imgModalImg');
    const closeBtn = document.querySelector('.img-modal-close');
    const prevBtn = document.getElementById('imgModalPrev');
    const nextBtn = document.getElementById('imgModalNext');
    let currentImages = [];
    let currentIndex = 0;

    // Gather all project images
    document.querySelectorAll('.project-images').forEach(imagesDiv => {
        const imgs = Array.from(imagesDiv.querySelectorAll('img'));
        imgs.forEach((img, idx) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function () {
                currentImages = imgs.map(i => i.src);
                currentIndex = idx;
                modalImg.src = currentImages[currentIndex];
                // جلب اسم ووصف المشروع
                const card = img.closest('.project-card');
                const title = card ? card.querySelector('h2')?.textContent : '';
                const desc = card ? card.querySelector('p')?.textContent : '';
                document.getElementById('imgModalTitle').textContent = title || '';
                document.getElementById('imgModalDesc').textContent = desc || '';
                modal.style.display = 'flex';
            });
        });
    });

    if (closeBtn) {
        closeBtn.onclick = function () {
            modal.style.display = 'none';
            modalImg.src = '';
        };
    }
    if (prevBtn) {
        prevBtn.onclick = function (e) {
            e.stopPropagation();
            if (!currentImages.length) return;
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            modalImg.src = currentImages[currentIndex];
        };
    }
    if (nextBtn) {
        nextBtn.onclick = function (e) {
            e.stopPropagation();
            if (!currentImages.length) return;
            currentIndex = (currentIndex + 1) % currentImages.length;
            modalImg.src = currentImages[currentIndex];
        };
    }
    // Close modal when clicking outside image
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                modalImg.src = '';
            }
        });
    }
});

/* Project Filtering */
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filter === 'all' || cardCategory === filter) {
                    card.style.display = 'block'; // Or your preferred display type (e.g., flex, grid)
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// Review Section Functionality
function initializeReviewSection() {
    const helpfulButtons = document.querySelectorAll('.helpful-votes button');
    const shareButtons = document.querySelectorAll('.share-buttons button');

    // Handle helpful votes
    helpfulButtons.forEach(button => {
        button.addEventListener('click', function () {
            const voteCount = this.nextElementSibling;
            let count = parseInt(voteCount.textContent);
            voteCount.textContent = count + 1;
            this.disabled = true;
            this.classList.add('voted');
        });
    });

    // Handle share buttons
    shareButtons.forEach(button => {
        button.addEventListener('click', function () {
            const platform = this.getAttribute('title').toLowerCase();
            const reviewText = document.querySelector('.comment-text').textContent;
            const shareUrl = encodeURIComponent(window.location.href);
            const shareText = encodeURIComponent(reviewText);

            let shareLink = '';
            switch (platform) {
                case 'share on linkedin':
                    shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
                    break;
                case 'share on twitter':
                    shareLink = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
                    break;
            }

            if (shareLink) {
                window.open(shareLink, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Update total reviews count and average rating
function updateReviewStats(reviews) {
    const totalReviewsElement = document.getElementById('totalReviews');
    const averageRatingElement = document.getElementById('averageRating');

    if (!reviews || Object.keys(reviews).length === 0) {
        if (totalReviewsElement) totalReviewsElement.textContent = '0';
        if (averageRatingElement) averageRatingElement.textContent = '0.0';
        return;
    }

    // Calculate total reviews
    const totalReviews = Object.keys(reviews).length;
    if (totalReviewsElement) totalReviewsElement.textContent = totalReviews;

    // Calculate average rating
    const totalRating = Object.values(reviews).reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating / totalReviews).toFixed(1);
    if (averageRatingElement) averageRatingElement.textContent = averageRating;
}

// Function to load reviews - Called by firebase-config.js or manually
window.loadReviewsData = function () {
    if (window.FirebaseDB && window.FirebaseDB.isInitialized) {
        const { database, ref, onValue } = window.FirebaseDB;
        const reviewsRef = ref(database, 'reviews');
        onValue(reviewsRef, (snapshot) => {
            const reviews = snapshot.val();
            updateReviewStats(reviews);
            if (typeof displayTopReview === 'function') {
                displayTopReview(reviews);
            }
        });
    } else {
        // Retry if not initialized yet
        setTimeout(window.loadReviewsData, 500);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initializeReviewSection();
    // Start trying to load reviews
    if (window.loadReviewsData) window.loadReviewsData();
});

// List of projects and their folder names
const projects = [
    { key: 'cashier', count: 0 },
    { key: 'fridges', count: 0 },
    { key: 'playstation', count: 0 },
    { key: 'restaurant-pos', count: 0 }
];

// Helper to fetch image count for each project (since JS can't read folders directly, you must set the count manually)
// Example: set the number of images for each project below
projects[0].count = 5;  // cashier
projects[1].count = 0;  // fridges (not found)
projects[2].count = 8;  // playstation
projects[3].count = 11; // restaurant-pos

// You MUST update the counts above to match your actual images!

document.addEventListener('DOMContentLoaded', () => {
    projects.forEach(project => {
        const carousel = document.querySelector(`.carousel[data-project="${project.key}"]`);
        if (!carousel || project.count === 0) return;

        let current = 0;
        const images = [];
        for (let i = 1; i <= project.count; i++) {
            const exts = ['png', 'PNG', 'jpg', 'jpeg'];
            let found = false;
            for (const ext of exts) {
                const path = `images/desktop-apps/${project.key}/${i}.${ext}`;
                const xhr = new XMLHttpRequest();
                xhr.open('HEAD', path, false);
                xhr.send();
                if (xhr.status === 200) {
                    images.push(path);
                    found = true;
                    break;
                }
            }
            if (!found) {
                // If no image found, push a placeholder or skip
                images.push('https://via.placeholder.com/260x170?text=No+Image');
            }
        }

        // Create image element
        const img = document.createElement('img');
        img.src = images[0];
        carousel.appendChild(img);

        // Controls
        const controls = document.createElement('div');
        controls.className = 'carousel-controls';
        const prevBtn = document.createElement('button');
        prevBtn.className = 'carousel-btn';
        prevBtn.innerHTML = '&#8592;';
        const nextBtn = document.createElement('button');
        nextBtn.className = 'carousel-btn';
        nextBtn.innerHTML = '&#8594;';
        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);
        carousel.appendChild(controls);

        function show(idx) {
            img.style.opacity = 0;
            setTimeout(() => {
                img.src = images[idx];
                img.style.opacity = 1;
            }, 200);
        }

        prevBtn.onclick = (e) => {
            e.stopPropagation();
            current = (current - 1 + images.length) % images.length;
            show(current);
        };
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            current = (current + 1) % images.length;
            show(current);
        };
    });
});

// Popup image viewer for projects
const popup = document.getElementById('imagePopup');
const popupImg = document.getElementById('popupImg');
const closePopup = document.querySelector('.close-popup');
const popupPrev = document.getElementById('popupPrev');
const popupNext = document.getElementById('popupNext');
let popupImages = [];
let popupIndex = 0;

function showPopupImages(images, startIdx = 0) {
    if (!popup || !popupImg) return;
    popupImages = images;
    popupIndex = startIdx;
    popupImg.src = popupImages[popupIndex];
    popup.style.display = 'flex';
}

if (closePopup) {
    closePopup.onclick = function () {
        if (popup) popup.style.display = 'none';
        if (popupImg) popupImg.src = '';
    };
}
if (popupPrev) {
    popupPrev.onclick = function () {
        popupIndex = (popupIndex - 1 + popupImages.length) % popupImages.length;
        if (popupImg) popupImg.src = popupImages[popupIndex];
    };
}
if (popupNext) {
    popupNext.onclick = function () {
        popupIndex = (popupIndex + 1) % popupImages.length;
        if (popupImg) popupImg.src = popupImages[popupIndex];
    };
}

// Close popup on background click
if (popup) {
    popup.addEventListener('click', function (e) {
        if (e.target === popup) {
            popup.style.display = 'none';
            if (popupImg) popupImg.src = '';
        }
    });
}

// Prepare images for each project
const projectImages = {
    cashier: [],
    fridges: [],
    playstation: [],
    'restaurant-pos': []
};
const exts = ['png', 'PNG', 'jpg', 'jpeg'];
projects.forEach((project, idx) => {
    for (let i = 1; i <= project.count; i++) {
        let found = false;
        for (const ext of exts) {
            const path = `images/desktop-apps/${project.key}/${i}.${ext}`;
            const xhr = new XMLHttpRequest();
            xhr.open('HEAD', path, false);
            xhr.send();
            if (xhr.status === 200) {
                projectImages[project.key].push(path);
                found = true;
                break;
            }
        }
        if (!found) {
            projectImages[project.key].push('https://via.placeholder.com/600x400?text=No+Image');
        }
    }
});

// Attach event listeners to all view buttons
setTimeout(() => {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.onclick = function () {
            const key = btn.getAttribute('data-project');
            if (projectImages[key] && projectImages[key].length > 0) {
                showPopupImages(projectImages[key], 0);
            }
        };
    });
}, 200);

// Function to create star rating HTML
function createStarRating(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<i class="${i <= rating ? 'fas' : 'far'} fa-star"></i>`;
    }
    return starsHtml;
}

// Function to animate numbers
function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const isFloat = end % 1 !== 0;

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;

        if (isFloat) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }

    requestAnimationFrame(updateNumber);
}

// Function to format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to display top review
function displayTopReview(reviews) {
    const topReviewCard = document.getElementById('topReviewCard');
    const reviewsStats = document.getElementById('reviewsStats');
    const reviewsNavigation = document.getElementById('reviewsNavigation');
    const shareReviewBtn = document.getElementById('shareReviewBtn');

    // Guard clause: if mandatory elements don't exist, exit safely
    if (!topReviewCard || !reviewsStats) {
        // console.log('Top review elements not found on this page'); // Debug
        return;
    }

    if (!reviews || Object.keys(reviews).length === 0) {
        topReviewCard.innerHTML = `
            <div class="comment-content">
                <p class="comment-text">Be the first to leave a review and share your experience working with me!</p>
            </div>
            <div class="comment-author">
                <div class="author-info">
                    <h4>No Reviews Yet</h4>
                    <p>Be the first to share your experience!</p>
                </div>
            </div>
            <div class="view-all-comments">
                <a href="reviews.html" class="btn btn-outline-primary">
                    <i class="fas fa-comments me-2"></i>Leave a Review
                </a>
                <button type="button" class="share-btn" id="shareReviewBtn" onclick="shareReview('No Reviews', 'Be the first to share your experience!', 0)">
                    <i class="fas fa-share-alt"></i>
                    Share
                </button>
            </div>
        `;

        // Hide stats and navigation when no reviews, but keep share button visible
        if (reviewsStats) reviewsStats.style.display = 'none';
        if (reviewsNavigation) reviewsNavigation.style.display = 'none';

        // After setting innerHTML, get the new share button and make it visible
        setTimeout(() => {
            const newShareBtn = document.getElementById('shareReviewBtn');
            if (newShareBtn) {
                newShareBtn.style.display = 'inline-flex';
            }
        }, 0);
        return;
    }

    // Calculate stats
    const reviewEntries = Object.entries(reviews);
    const totalReviews = reviewEntries.length;
    const totalRating = reviewEntries.reduce((sum, [key, review]) => sum + review.rating, 0);
    const avgRating = (totalRating / totalReviews).toFixed(1);
    const topRating = Math.max(...reviewEntries.map(([key, review]) => review.rating));

    // Update stats with animation
    const totalReviewsEl = document.getElementById('totalReviews');
    const avgRatingEl = document.getElementById('avgRating');
    const topRatingEl = document.getElementById('topRating');

    // Animate stats numbers if elements exist
    if (totalReviewsEl && avgRatingEl && topRatingEl) {
        animateNumber(totalReviewsEl, 0, totalReviews, 1000);
        animateNumber(avgRatingEl, 0, parseFloat(avgRating), 1000);
        animateNumber(topRatingEl, 0, topRating, 1000);
    }

    // Show stats with animation
    reviewsStats.style.display = 'flex';

    // Add animation classes to stats
    const statItems = reviewsStats.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('stat-item-appear');
    });

    // Find the highest rated review
    let topReview = null;
    let highestRating = 0;

    reviewEntries.forEach(([key, review]) => {
        if (review.rating > highestRating) {
            highestRating = review.rating;
            topReview = review;
        }
    });

    if (topReview) {
        // Store all reviews for navigation
        window.allReviews = reviewEntries;
        window.currentReviewIndex = 0;

        // Show navigation if more than one review
        if (totalReviews > 1 && reviewsNavigation) {
            reviewsNavigation.style.display = 'flex';
            if (typeof updateReviewCounter === 'function') updateReviewCounter();
        } else if (reviewsNavigation) {
            reviewsNavigation.style.display = 'none';
        }

        // Show share button
        if (shareReviewBtn) shareReviewBtn.style.display = 'inline-flex';

        // Display the review
        if (typeof displayReview === 'function') displayReview(topReview);
    }
}

// Function to display a specific review
function displayReview(review) {
    const topReviewCard = document.getElementById('topReviewCard');

    // Add slide out animation first
    topReviewCard.classList.add('review-slide-out');

    // Wait for slide out animation to complete, then update content
    setTimeout(() => {
        topReviewCard.innerHTML = `
            <div class="rating-stars">
                ${createStarRating(review.rating)}
            </div>
            <div class="comment-content">
                <p class="comment-text">${review.comment}</p>
            </div>
            <div class="comment-author">
                <div class="author-info">
                    <h4>${review.name}</h4>
                    <p>${review.company}</p>
                    <small>${formatDate(review.timestamp)}</small>
                </div>
            </div>
            <div class="view-all-comments">
                <a href="reviews.html" class="btn btn-outline-primary">
                    <i class="fas fa-comments me-2"></i>View All Reviews
                </a>
                <button type="button" class="share-btn" id="shareReviewBtn" onclick="shareReview('${review.name}', '${review.comment}', ${review.rating})">
                    <i class="fas fa-share-alt"></i>
                    Share
                </button>
            </div>
        `;

        // Remove slide out class and add slide in animation
        topReviewCard.classList.remove('review-slide-out');
        topReviewCard.classList.add('review-slide-in');

        // Remove animation class after animation completes
        setTimeout(() => {
            topReviewCard.classList.remove('review-slide-in');
        }, 600);

    }, 400); // Original delay values
}

// Function to update review counter
function updateReviewCounter() {
    const counter = document.getElementById('reviewCounter');
    const currentIndex = window.currentReviewIndex + 1;
    const totalReviews = window.allReviews.length;

    // Add pulse animation
    counter.classList.remove('counter-pulse');
    void counter.offsetWidth; // Trigger reflow
    counter.classList.add('counter-pulse');

    counter.textContent = `${currentIndex} of ${totalReviews}`;
}

// Function to navigate to next review
function nextReview() {
    if (window.currentReviewIndex < window.allReviews.length - 1) {
        window.currentReviewIndex++;
        const [key, review] = window.allReviews[window.currentReviewIndex];
        displayReview(review);
        updateReviewCounter();
        updateNavigationButtons();
    }
}

// Function to navigate to previous review
function prevReview() {
    if (window.currentReviewIndex > 0) {
        window.currentReviewIndex--;
        const [key, review] = window.allReviews[window.currentReviewIndex];
        displayReview(review);
        updateReviewCounter();
        updateNavigationButtons();
    }
}

// Function to update navigation buttons state
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevReviewBtn');
    const nextBtn = document.getElementById('nextReviewBtn');

    prevBtn.disabled = window.currentReviewIndex === 0;
    nextBtn.disabled = window.currentReviewIndex === window.allReviews.length - 1;
}

// Function to share review
function shareReview(name, comment, rating) {
    const text = `Check out this amazing review from ${name}: "${comment}" - ${rating}/5 stars!`;
    const url = window.location.href;

    console.log('Sharing review:', { name, comment, rating, text, url });

    // Show share options dropdown
    showShareOptions(text, url);
}

// Function to show share options dropdown
function showShareOptions(text, url) {
    // Remove existing dropdown if any
    const existingDropdown = document.querySelector('.share-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'share-dropdown';
    dropdown.innerHTML = `
        <!-- X -->
        <div class="share-option" data-action="twitter" data-text="${text}" data-url="${url}">
            <i class="fab fa-twitter"></i>
            <span>X</span>
        </div>
        <!-- Facebook -->
        <div class="share-option" data-action="facebook" data-text="${text}" data-url="${url}">
            <i class="fab fa-facebook"></i>
            <span>Facebook</span>
        </div>
        <!-- LinkedIn -->
        <div class="share-option" data-action="linkedin" data-text="${text}" data-url="${url}">
            <i class="fab fa-linkedin"></i>
            <span>LinkedIn</span>
        </div>
        <!-- WhatsApp -->
        <div class="share-option" data-action="whatsapp" data-text="${text}" data-url="${url}">
            <i class="fab fa-whatsapp"></i>
            <span>WhatsApp</span>
        </div>
        <!-- Telegram -->
        <div class="share-option" data-action="telegram" data-text="${text}" data-url="${url}">
            <i class="fab fa-telegram"></i>
            <span>Telegram</span>
        </div>
        <!-- Copy to Clipboard -->
        <div class="share-option" data-action="copy" data-text="${text}" data-url="${url}">
            <i class="fas fa-copy"></i>
            <span>Copy Link</span>
        </div>
        <!-- Email -->
        <div class="share-option" data-action="email" data-text="${text}" data-url="${url}">
            <i class="fas fa-envelope"></i>
            <span>Email</span>
        </div>
    `;

    // Position dropdown near the share button
    const shareBtn = document.getElementById('shareReviewBtn');
    if (shareBtn) {
        const rect = shareBtn.getBoundingClientRect();

        // Check if mobile device
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            // Center dropdown on mobile
            dropdown.style.position = 'fixed';
            dropdown.style.top = '50%';
            dropdown.style.left = '50%';
            dropdown.style.transform = 'translate(-50%, -50%)';
            dropdown.style.width = '90vw';
            dropdown.style.maxWidth = '300px';
            dropdown.style.zIndex = '10000';
            dropdown.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            dropdown.style.backdropFilter = 'blur(20px)';
            dropdown.style.webkitBackdropFilter = 'blur(20px)';
        } else {
            // Desktop positioning
            dropdown.style.position = 'absolute';
            dropdown.style.top = (rect.bottom + 5) + 'px';
            dropdown.style.left = rect.left + 'px';
            dropdown.style.zIndex = '1000';
        }

        // Add to body
        document.body.appendChild(dropdown);

        // Add click event listeners to share options
        const shareOptions = dropdown.querySelectorAll('.share-option');
        shareOptions.forEach(option => {
            option.addEventListener('click', function () {
                const action = this.getAttribute('data-action');
                const text = this.getAttribute('data-text');
                const url = this.getAttribute('data-url');

                switch (action) {
                    case 'twitter':
                        shareToTwitter(text, url);
                        break;
                    case 'facebook':
                        shareToFacebook(text, url);
                        break;
                    case 'linkedin':
                        shareToLinkedIn(text, url);
                        break;
                    case 'whatsapp':
                        shareToWhatsApp(text, url);
                        break;
                    case 'telegram':
                        shareToTelegram(text, url);
                        break;
                    case 'copy':
                        copyToClipboard(text + ' ' + url);
                        break;
                    case 'email':
                        shareViaEmail(text, url);
                        break;
                }

                // Close dropdown after action
                dropdown.remove();
            });
        });

        // Close dropdown when clicking outside
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!dropdown.contains(e.target) && e.target !== shareBtn) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 100);

        // Close dropdown on escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                dropdown.remove();
                document.removeEventListener('keydown', arguments.callee);
            }
        });
    }
}

// Share to X
function shareToTwitter(text, url) {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    closeShareDropdown();
}

// Share to Facebook
function shareToFacebook(text, url) {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    closeShareDropdown();
}

// Share to LinkedIn
function shareToLinkedIn(text, url) {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    closeShareDropdown();
}

// Share to WhatsApp
function shareToWhatsApp(text, url) {
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
    closeShareDropdown();
}

// Share to Telegram
function shareToTelegram(text, url) {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
    closeShareDropdown();
}

// Share via Email
function shareViaEmail(text, url) {
    const subject = 'Check out this amazing review!';
    const body = `${text}\n\n${url}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    closeShareDropdown();
}

// Close share dropdown
function closeShareDropdown() {
    const dropdown = document.querySelector('.share-dropdown');
    if (dropdown) {
        dropdown.remove();
    }
}

// Copy to clipboard function
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Review text copied to clipboard!', 'success');
        }).catch(() => {
            // If clipboard fails, show the text
            prompt('Copy this text:', text);
        });
    } else {
        // Fallback for older browsers
        prompt('Copy this text:', text);
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Load top review from Firebase
function loadTopReview() {
    // Check if Firebase is initialized
    if (!window.FirebaseDB || !window.FirebaseDB.isInitialized) {
        console.log('Firebase not yet initialized, retrying in 1 second...');
        setTimeout(loadTopReview, 1000);
        return;
    }

    try {
        const { ref, onValue } = window.FirebaseDB;
        const reviewsRef = ref(database, 'reviews');

        onValue(reviewsRef, (snapshot) => {
            const reviews = snapshot.val();
            console.log('Reviews loaded:', reviews);
            displayTopReview(reviews);
        }, (error) => {
            console.error('Error loading reviews:', error);
            // Show fallback message
            displayTopReview(null);
        });

    } catch (error) {
        console.error('Error in loadTopReview:', error);
        // Show fallback message
        displayTopReview(null);
    }
}

// Initialize reviews functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Try to load reviews
    loadTopReview();

    // Initialize Theme Toggle
    initThemeToggle();

    // Add navigation event listeners
    document.addEventListener('click', function (e) {
        if (e.target.id === 'nextReviewBtn') {
            nextReview();
        } else if (e.target.id === 'prevReviewBtn') {
            prevReview();
        }
    });
});

// Make functions globally available
window.createStarRating = createStarRating;
window.animateNumber = animateNumber;
window.formatDate = formatDate;
window.displayTopReview = displayTopReview;
window.displayReview = displayReview;
window.updateReviewCounter = updateReviewCounter;
window.nextReview = nextReview;
window.prevReview = prevReview;
window.updateNavigationButtons = updateNavigationButtons;
window.shareReview = shareReview;
window.fallbackShare = fallbackShare;
window.copyToClipboard = copyToClipboard;
window.loadTopReview = loadTopReview;

/* =========================================
   New Enhancements Scripts
   ========================================= */

// Typing Effect is now handled by typing.js to ensure isolation

document.addEventListener("DOMContentLoaded", function () {
    // Initialize Skills Chart

    // Initialize Skills Chart
    const ctx = document.getElementById('skillsChart');
    if (ctx) {
        // Check if Chart is defined (library loaded)
        if (typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Python', 'Java', 'Machine Learning', 'Problem Solving', 'Web Dev', 'Leadership'],
                    datasets: [{
                        label: 'Skill Proficiency',
                        data: [95, 85, 90, 90, 85, 85],
                        fill: true,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgb(54, 162, 235)',
                        pointBackgroundColor: 'rgb(54, 162, 235)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(54, 162, 235)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    elements: {
                        line: {
                            borderWidth: 3
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                display: true
                            },
                            suggestedMin: 0,
                            suggestedMax: 100,
                            ticks: {
                                stepSize: 20,
                                backdropColor: 'transparent' // Hide default backdrop
                            },
                            pointLabels: {
                                font: {
                                    size: 14
                                }
                            }
                        }
                    }
                }
            });
        }
    }
});

/* Scroll Progress Bar */
window.onscroll = function () {
    updateProgressBar();
};

function updateProgressBar() {
    const scrollProgress = document.getElementById("scroll-progress");
    if (!scrollProgress) return;

    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + "%";
}

/* Vanilla Tilt Initialization */
document.addEventListener("DOMContentLoaded", function () {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".service-card, .project-card, .skill-item, .testimonial-card"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.05
        });
    }
});

/* Advanced UI Features */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect to interactive elements
    const interactiveElements = 'a, button, input, textarea, .card, .service-card, .project-card, .skill-item';

    // Use event delegation for better performance and dynamic elements
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveElements)) {
            cursor.classList.add('hover');
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactiveElements)) {
            cursor.classList.remove('hover');
        }
    });

    // 2. Page Transitions
    document.body.classList.remove('fade-out'); // Ensure page is visible on load

    document.querySelectorAll('a').forEach(link => {
        // Filter external links and anchors
        if (link.hostname === window.location.hostname && !link.hash && link.target !== '_blank') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.href;
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = href;
                }, 500);
            });
        }
    });

    // handle back/forward navigation
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.body.classList.remove('fade-out');
        }
    });

    // 3. Theme Sync for Particles
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'data-bs-theme') {
                const theme = document.documentElement.getAttribute('data-bs-theme');
                updateParticlesTheme(theme);
            }
        });
    });
    observer.observe(document.documentElement, { attributes: true });

});

function updateParticlesTheme(theme) {
    if (window.pJSDom && window.pJSDom[0]) {
        const pJS = window.pJSDom[0].pJS;
        const color = theme === 'dark' ? '#ffffff' : '#007bff'; // White for Dark, Blue for Light

        pJS.particles.color.value = color;
        pJS.particles.line_linked.color = color;

        // Refresh particles
        if (pJS.fn && pJS.fn.particlesRefresh) {
            pJS.fn.particlesRefresh();
        }
    }
}

/* Contact Form Simulation */
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Simulate API call
            setTimeout(() => {
                alert('Thank you! Your message has been sent successfully.');
                contactForm.reset();
                btn.innerText = originalText;
                btn.disabled = false;
            }, 1500);
        });
    }
});

/* =========================================
   Advanced UI Logic
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cinematic Preloader - Robust Logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const hidePreloader = () => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            // Fully remove after animation
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        };

        // Primary: Hide on window load
        window.addEventListener('load', () => {
            setTimeout(hidePreloader, 1000); // 1s delay for branding
        });

        // Safety Fallback: Hide after 4 seconds (worst case)
        setTimeout(hidePreloader, 4000);

        // Immediate check (if already loaded)
        if (document.readyState === 'complete') {
            setTimeout(hidePreloader, 1000);
        }
    }

    // 2. Scroll to Top Button - Robust Logic
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        const toggleScrollBtn = () => {
            // Cross-browser scroll position detection
            const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            if (scrollY >= 0) { // Always show
                scrollTopBtn.classList.add('visible');
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.visibility = 'visible';
            } else {
                // Never hide
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.visibility = 'visible';
            }
        };

        window.addEventListener('scroll', toggleScrollBtn);
        window.addEventListener('resize', toggleScrollBtn); // Re-check on resize
        toggleScrollBtn(); // Initial check

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 3. Navbar Glass Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 4. Scroll Reveal Animations
    const observerOptions = {
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});

