// Disable right-click on the iframe to prevent downloads
document.querySelectorAll('iframe').forEach(iframe => {
    iframe.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
});

// Track if animation is in progress
let isAnimating = false;

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
    } else {
        document.documentElement.classList.remove('dark-theme');
    }
    updateThemeIcon(savedTheme === 'dark');

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.contains('dark-theme');
        const newTheme = isDark ? 'light' : 'dark';

        // Update theme
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark-theme');
        } else {
            document.documentElement.classList.remove('dark-theme');
        }
        localStorage.setItem('theme', newTheme);

        // Update icon
        updateThemeIcon(newTheme === 'dark');

        // Force a reflow to ensure the theme change is applied
        document.body.style.display = 'none';
        document.body.offsetHeight; // Force reflow
        document.body.style.display = '';
    });
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector('#themeToggle i');
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

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    handleLearnMoreSection();
    initThemeToggle();
    
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
            img.addEventListener('click', function() {
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

    closeBtn.onclick = function() {
        modal.style.display = 'none';
        modalImg.src = '';
    };
    prevBtn.onclick = function(e) {
        e.stopPropagation();
        if (!currentImages.length) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        modalImg.src = currentImages[currentIndex];
    };
    nextBtn.onclick = function(e) {
        e.stopPropagation();
        if (!currentImages.length) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        modalImg.src = currentImages[currentIndex];
    };
    // Close modal when clicking outside image
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            modalImg.src = '';
        }
    });
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
        button.addEventListener('click', function() {
            const voteCount = this.nextElementSibling;
            let count = parseInt(voteCount.textContent);
            voteCount.textContent = count + 1;
            this.disabled = true;
            this.classList.add('voted');
        });
    });
    
    // Handle share buttons
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.getAttribute('title').toLowerCase();
            const reviewText = document.querySelector('.comment-text').textContent;
            const shareUrl = encodeURIComponent(window.location.href);
            const shareText = encodeURIComponent(reviewText);
            
            let shareLink = '';
            switch(platform) {
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

// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "AIzaSyBGJy-QhZVVGRDSyNCL3Q0dJ38BYIYGCE8",
    authDomain: "portfolio-reviews-61da7.firebaseapp.com",
    databaseURL: "https://portfolio-reviews-61da7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "portfolio-reviews-61da7",
    storageBucket: "portfolio-reviews-61da7.firebasestorage.app",
    messagingSenderId: "223840413523",
    appId: "1:223840413523:web:ad07b66a10f982332f23a6",
    measurementId: "G-3MVPQ248VF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Function to create star rating HTML
function createStarRating(rating) {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        starsHtml += `<i class="${i <= rating ? 'fas' : 'far'} fa-star"></i>`;
    }
    return starsHtml;
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
    
    if (!reviews || Object.keys(reviews).length === 0) {
        topReviewCard.innerHTML = `
            <div class="comment-content">
                <p class="comment-text">Be the first to leave a review and share your experience working with me!</p>
            </div>
            <div class="view-all-comments">
                <a href="reviews.html" class="btn btn-outline-primary">
                    <i class="fas fa-comments me-2"></i>Leave a Review
                </a>
            </div>
        `;
        return;
    }

    // Find the highest rated review
    let topReview = null;
    let highestRating = 0;

    Object.entries(reviews).forEach(([key, review]) => {
        if (review.rating > highestRating) {
            highestRating = review.rating;
            topReview = review;
        }
    });

    if (topReview) {
        topReviewCard.innerHTML = `
            <div class="rating-stars">
                ${createStarRating(topReview.rating)}
            </div>
            <div class="comment-content">
                <p class="comment-text">${topReview.comment}</p>
                <div class="comment-author">
                    <div class="author-info">
                        <h4>${topReview.name}</h4>
                        <p>${topReview.company}</p>
                        <small>${formatDate(topReview.timestamp)}</small>
                    </div>
                </div>
            </div>
            <div class="view-all-comments">
                <a href="reviews.html" class="btn btn-outline-primary">
                    <i class="fas fa-comments me-2"></i>View All Reviews
                </a>
            </div>
        `;
    }
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeReviewSection();
    
    // Load reviews from Firebase and update stats
    const reviewsRef = ref(database, 'reviews');
    onValue(reviewsRef, (snapshot) => {
        const reviews = snapshot.val();
        updateReviewStats(reviews);
        displayTopReview(reviews);
    });
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
  popupImages = images;
  popupIndex = startIdx;
  popupImg.src = popupImages[popupIndex];
  popup.style.display = 'flex';
}

closePopup.onclick = function() {
  popup.style.display = 'none';
  popupImg.src = '';
};
popupPrev.onclick = function() {
  popupIndex = (popupIndex - 1 + popupImages.length) % popupImages.length;
  popupImg.src = popupImages[popupIndex];
};
popupNext.onclick = function() {
  popupIndex = (popupIndex + 1) % popupImages.length;
  popupImg.src = popupImages[popupIndex];
};

// Close popup on background click
popup.addEventListener('click', function(e) {
  if (e.target === popup) {
    popup.style.display = 'none';
    popupImg.src = '';
  }
});

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
    btn.onclick = function() {
      const key = btn.getAttribute('data-project');
      if (projectImages[key] && projectImages[key].length > 0) {
        showPopupImages(projectImages[key], 0);
      }
    };
  });
}, 200);

