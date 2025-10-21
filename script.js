// Modern Portfolio JavaScript with Dark Theme Animations
document.addEventListener('DOMContentLoaded', function () {

    // Initialize all components
    initializeLoadingScreen();
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormValidation();
    initializeBackToTop();
    initializeParticleEffects();
    initializeTypingAnimation();
    initializeSkillBars();
    initializeProjectCards();
    initializeContactForm();
    initializeMobileMenu();

    console.log('🚀 Portfolio loaded successfully!');
});

// Loading Screen Management
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');

    if (loadingScreen) {
        // Simulate loading progress
        let progress = 0;
        const progressBar = loadingScreen.querySelector('.loading-progress');

        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progressBar) {
                progressBar.style.width = Math.min(progress, 100) + '%';
            }

            if (progress >= 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    loadingScreen.style.visibility = 'hidden';
                    document.body.style.overflow = 'auto';
                }, 500);
            }
        }, 100);
    }
}

// Navigation Management
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                smoothScrollTo(targetSection, 1000);
                updateActiveNavLink(this);
            }
        });
    });

    // Update active navigation on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Header background on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        if (scrolled > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Smooth Scroll Function
function smoothScrollTo(element, duration) {
    const start = window.pageYOffset;
    const target = element.offsetTop - 100;
    const distance = target - start;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutCubic(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutCubic(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    }

    requestAnimationFrame(animation);
}

// Update Active Navigation Link
function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

// Scroll Animations with Intersection Observer
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Special animations for different elements
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBar(entry.target);
                }

                if (entry.target.classList.contains('project-card')) {
                    animateProjectCard(entry.target);
                }

                if (entry.target.classList.contains('stat')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToObserve = document.querySelectorAll('section, .project-card, .skill-item, .stat, .contact-item');
    elementsToObserve.forEach(el => {
        observer.observe(el);
    });
}

// Animate Skill Bars
function animateSkillBar(skillElement) {
    const progressBar = skillElement.querySelector('.skill-progress');
    const level = skillElement.dataset.level;

    if (progressBar && level) {
        setTimeout(() => {
            progressBar.style.width = level + '%';
        }, 200);
    }
}

// Animate Project Cards
function animateProjectCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';

    setTimeout(() => {
        card.style.transition = 'all 0.6s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100);
}

// Animate Counters
function animateCounter(statElement) {
    const numberElement = statElement.querySelector('.stat-number');
    if (!numberElement) return;

    const target = parseInt(numberElement.textContent);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            numberElement.textContent = target + (numberElement.textContent.includes('+') ? '+' : '');
            clearInterval(counter);
        } else {
            numberElement.textContent = Math.floor(current) + (numberElement.textContent.includes('+') ? '+' : '');
        }
    }, 16);
}

// Form Validation
function initializeFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        clearAllErrors();

        // Validate form
        const isValid = validateForm();

        if (isValid) {
            showSuccessMessage();
            form.reset();
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

// Validate Form
function validateForm() {
    const form = document.querySelector('.contact-form');
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

// Validate Individual Field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = `${getFieldLabel(fieldName)} is required`;
        isValid = false;
    }

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }

    // Name validation
    if (fieldName === 'name' && value && value.length < 2) {
        errorMessage = 'Name must be at least 2 characters long';
        isValid = false;
    }

    // Message validation
    if (fieldName === 'message' && value && value.length < 10) {
        errorMessage = 'Message must be at least 10 characters long';
        isValid = false;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }

    return isValid;
}

// Show Field Error
function showFieldError(field, message) {
    clearFieldError(field);

    field.style.borderColor = '#ff6b6b';
    field.style.animation = 'shake 0.5s ease-in-out';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.color = '#ff6b6b';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.style.animation = 'fadeInUp 0.3s ease-out';

    field.parentNode.appendChild(errorDiv);
}

// Clear Field Error
function clearFieldError(field) {
    field.style.borderColor = 'rgba(0, 212, 255, 0.2)';
    field.style.animation = '';

    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            errorMessage.remove();
        }, 300);
    }
}

// Clear All Errors
function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });

    document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(field => {
        field.style.borderColor = 'rgba(0, 212, 255, 0.2)';
        field.style.animation = '';
    });
}

// Get Field Label
function getFieldLabel(fieldName) {
    const labels = {
        'name': 'Name',
        'email': 'Email',
        'subject': 'Subject',
        'message': 'Message'
    };
    return labels[fieldName] || fieldName;
}

// Show Success Message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #51cf66, #40c057);
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 12px;
            text-align: center;
            font-weight: 600;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: successPop 0.5s ease-out;
            max-width: 300px;
        ">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">✅</div>
            <div>Message sent successfully!</div>
            <div style="font-size: 0.9rem; opacity: 0.9; margin-top: 0.5rem;">
                I'll get back to you soon!
            </div>
        </div>
    `;

    document.body.appendChild(successDiv);

    setTimeout(() => {
        successDiv.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            successDiv.remove();
        }, 300);
    }, 3000);
}

// Back to Top Button
function initializeBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            smoothScrollTo(document.body, 1000);
        });
    }
}

// Particle Effects
function initializeParticleEffects() {
    let mouseTrail = [];
    const maxTrailLength = 15;

    document.addEventListener('mousemove', (e) => {
        // Create particle trail
        if (Math.random() > 0.7) {
            createParticle(e.clientX, e.clientY);
        }
    });
}

// Create Particle
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.8), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: particleFade 0.8s ease-out forwards;
    `;
    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 800);
}

// Typing Animation
function initializeTypingAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';

    let i = 0;
    const typeWriter = () => {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };

    setTimeout(typeWriter, 1000);
}

// Initialize Skill Bars
function initializeSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const progressBar = item.querySelector('.skill-progress');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    });
}

// Initialize Project Cards
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';

        // Stagger animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Initialize Contact Form
function initializeContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // Add form enhancements
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentNode.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentNode.classList.remove('focused');
            }
        });
    });
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');

    if (mobileToggle && nav) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            nav.classList.toggle('mobile-open');
            mobileToggle.classList.toggle('active');
        });

        // Close menu when clicking on links
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('mobile-open');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes successPop {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
    
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease-out both;
    }
    
    .nav-link.active {
        color: #00d4ff;
        background: rgba(0, 212, 255, 0.1);
    }
    
    .mobile-menu-toggle.active .hamburger:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active .hamburger:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active .hamburger:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        nav {
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: rgba(10, 10, 10, 0.98);
            backdrop-filter: blur(20px);
            padding: 2rem;
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        }
        
        nav.mobile-open {
            transform: translateY(0);
        }
        
        .nav-list {
            flex-direction: column;
            gap: 1rem;
        }
        
        .nav-link {
            display: block;
            padding: 1rem;
            text-align: center;
            border-radius: 8px;
        }
    }
    
    .form-group.focused .form-label {
        color: #00d4ff;
        transform: translateY(-2px);
    }
    
    .success-message {
        animation: successPop 0.5s ease-out;
    }
`;
document.head.appendChild(style);

// Performance optimization
let ticking = false;

function updateOnScroll() {
    // Throttle scroll events for better performance
    if (!ticking) {
        requestAnimationFrame(() => {
            // Scroll-based animations here
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', updateOnScroll);

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        // Add any critical image URLs here
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize preloading
preloadResources();

// Error handling
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js');
    });
}