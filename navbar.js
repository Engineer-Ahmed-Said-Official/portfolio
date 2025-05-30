// Navbar scroll effect and animations
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarBrand = document.querySelector('.navbar-brand');
    
    // Add scrolled class to navbar on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbarBrand.style.transform = 'translateY(-2px)';
        } else {
            navbar.classList.remove('scrolled');
            navbarBrand.style.transform = 'translateY(0)';
        }
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

    // Mobile menu animations
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navbarToggler.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        if (!isExpanded) {
            // Opening animation
            navbarCollapse.style.display = 'block';
            setTimeout(() => {
                navbarCollapse.classList.add('show');
            }, 10);
        } else {
            // Closing animation
            navbarCollapse.classList.remove('show');
            setTimeout(() => {
                navbarCollapse.style.display = 'none';
            }, 400);
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const isClickInside = navbar.contains(e.target);
        const isMenuOpen = navbarCollapse.classList.contains('show');
        
        if (!isClickInside && isMenuOpen) {
            navbarToggler.click();
        }
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