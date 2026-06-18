// ==========================================
// 1. Mobile Menu & Scroll Lock
// ==========================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu and lock body scroll on mobile
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent background scrolling when mobile menu is open
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close menu when a link is clicked and unlock scroll
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ==========================================
// 2. Advanced Navbar Scroll Effect
// ==========================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true }); // passive: true improves scrolling performance on mobile

// ==========================================
// 3. Smooth Scrolling for Anchor Links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            // Adjust scroll position to account for sticky navbar
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// ==========================================
// 4. Staggered Scroll Reveal Animations
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add a slight delay based on the index for a cascading effect
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100); // 100ms delay between each item
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const animatedElements = document.querySelectorAll('.section-header, .about-text, .image-frame, .skill-card, .project-card, .cert-card, .contact-method, .contact-form');

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s cubic-bezier(0.165, 0.84, 0.44, 1), transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)';
    fadeObserver.observe(el);
});

// ==========================================
// 5. Advanced Typewriter Effect
// ==========================================
const typingText = document.querySelector('.gradient-text');
if (typingText) {
    const words = ["Data Analyst", "Business Strategist", "Problem Solver"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Remove characters
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            // Add characters
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        // Dynamic typing speeds
        let typeSpeed = isDeleting ? 50 : 100;
        
        // If word is completely typed
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at the end of the word
            isDeleting = true;
        } 
        // If word is completely deleted
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length; // Move to next word
            typeSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    // Start effect
    typingText.textContent = '';
    setTimeout(typeEffect, 1000);
}

// ==========================================
// 6. Buttery Smooth Parallax (Lerp Engine)
// ==========================================
// Only run on desktop to save battery/performance on mobile
if (window.matchMedia("(min-width: 1024px)").matches) {
    const cards = document.querySelectorAll('.floating-card');
    
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    
    window.addEventListener('mousemove', (e) => {
        // Calculate target positions based on mouse center
        targetX = (window.innerWidth / 2 - e.pageX) / 40;
        targetY = (window.innerHeight / 2 - e.pageY) / 40;
    });

    function animateParallax() {
        // Lerp formula for smooth gliding
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        cards.forEach((card, index) => {
            const speed = (index + 1) * 0.8;
            card.style.transform = `translate(${currentX * speed}px, ${currentY * speed}px)`;
        });

        requestAnimationFrame(animateParallax);
    }
    
    animateParallax();
}

// ==========================================
// 7. Form Submission Feedback
// ==========================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const button = contactForm.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin" style="margin-left: 10px;"></i>';
        button.style.opacity = '0.7';
        button.style.pointerEvents = 'none';
        
        setTimeout(() => {
            button.innerHTML = '<span>Message Sent!</span><i class="fas fa-check" style="margin-left: 10px;"></i>';
            button.style.background = '#2e7d32'; // Success green
            button.style.borderColor = '#2e7d32';
            button.style.color = '#ffffff';
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.opacity = '1';
                button.style.pointerEvents = 'auto';
                button.style.background = ''; // Reset to original
                button.style.borderColor = '';
                button.style.color = '';
                contactForm.reset(); // Clear form
            }, 3000);
        }, 1500); // Simulate network delay
    });
}

// Active State Observer for Navbar
const sections = document.querySelectorAll('section');
const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            let id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                // Ensure ID exists before checking
                if (id && link.getAttribute('href').includes(id)) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.3, rootMargin: "-100px 0px 0px 0px" });

sections.forEach(section => activeObserver.observe(section));

console.log('Premium UI Engine Loaded! 🚀');
