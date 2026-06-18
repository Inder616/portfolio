// ==========================================
// 1. Mobile Navbar Toggle
// ==========================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle menu on click
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ==========================================
// 2. Navbar Scroll Effect & Active States
// ==========================================
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    // Add shadow/shrink navbar on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Highlight active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 250) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current) && current !== '') {
            link.classList.add('active');
        }
    });
});

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
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// 4. Scroll Reveal Animations (Intersection Observer)
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Stop observing once revealed
        }
    });
}, observerOptions);

// Apply initial styles and observe elements
const animatedElements = document.querySelectorAll('.section-header, .about-text, .image-frame, .skill-card, .project-card, .contact-method, .contact-form');

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    fadeObserver.observe(el);
});

// ==========================================
// 5. Hero Section Typing Effect
// ==========================================
const typingText = document.querySelector('.gradient-text');
if (typingText) {
    const textToType = typingText.textContent;
    typingText.textContent = ''; // Clear initial text
    let charIndex = 0;
    
    function typeEffect() {
        if (charIndex < textToType.length) {
            typingText.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeEffect, 100); // Speed of typing
        }
    }
    
    // Start typing effect slightly after page loads
    setTimeout(typeEffect, 800);
}

// ==========================================
// 6. Floating Cards Parallax Effect (Desktop only)
// ==========================================
if (window.innerWidth > 1024) {
    window.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.floating-card');
        const x = (window.innerWidth - e.pageX * 2) / 90;
        const y = (window.innerHeight - e.pageY * 2) / 90;

        cards.forEach((card, index) => {
            // Give each card a slightly different movement speed
            const speed = index + 1; 
            card.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
}

// ==========================================
// 7. Formspree Submission Handling
// ==========================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const button = contactForm.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        // Change button state to show it's sending
        button.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        button.style.opacity = '0.8';
        button.style.cursor = 'not-allowed';
        
        // The actual submission will be handled by Formspree, 
        // this just gives immediate visual feedback to the user.
        setTimeout(() => {
            // Restore button after 2 seconds (assuming redirect or refresh happens)
            button.innerHTML = originalText;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }, 2000);
    });
}

console.log('Portfolio scripts loaded successfully! 🚀');
