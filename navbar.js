// Navbar scroll effect and animations
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarBrand = document.querySelector('.navbar-brand');
    let isAnimating = false;
    let lastScrollTop = 0;

    // Function to handle menu toggle
    function toggleMenu() {
        if (isAnimating) return;
        isAnimating = true;

        navbarToggler.classList.toggle('collapsed');
        navbarCollapse.classList.toggle('show');

        // Reset animation flag after transition
        setTimeout(() => {
            isAnimating = false;
        }, 300);
    }

    // Handle scroll events
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class to navbar
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
            navbarBrand.style.transform = 'translateY(-2px)';
        } else {
            navbar.classList.remove('scrolled');
            navbarBrand.style.transform = 'translateY(0)';
        }

        // Close menu on scroll
        if (navbarCollapse.classList.contains('show')) {
            toggleMenu();
        }

        lastScrollTop = scrollTop;
    });

    // Event listener for menu button
    navbarToggler.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
            if (navbarCollapse.classList.contains('show')) {
                toggleMenu();
            }
        }
    });

    // Close menu when clicking on a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                toggleMenu();
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991) {
            navbarCollapse.classList.remove('show');
            navbarToggler.classList.add('collapsed');
        }
    });

    // Prevent body scroll when menu is open
    navbarToggler.addEventListener('click', function() {
        document.body.style.overflow = navbarCollapse.classList.contains('show') ? 'auto' : 'hidden';
    });

    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Add hover effect to nav links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add ripple effect to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            
            ripple.classList.add('active');
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}); 