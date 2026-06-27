document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Custom Mouse Cursor Follower
       ========================================================================== */
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // Only apply custom cursor on non-touch devices
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediately position the inner solid dot
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Frame update loop for the outline follower (adding easing delay)
        const updateCursorOutline = () => {
            // Easing formula: position += (target - position) * speed
            const ease = 0.15;
            outlineX += (mouseX - outlineX) * ease;
            outlineY += (mouseY - outlineY) * ease;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(updateCursorOutline);
        };
        requestAnimationFrame(updateCursorOutline);

        // Hover effect styles
        const hoverElements = document.querySelectorAll('a, button, .filter-btn, .social-link-btn, .overlay-btn, input, textarea');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('cursor-hover');
                cursorOutline.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('cursor-hover');
                cursorOutline.classList.remove('cursor-hover');
            });
        });
    } else {
        // Hide custom cursor elements on touch-screens
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorOutline) cursorOutline.style.display = 'none';
    }

    /* ==========================================================================
       Mobile Navigation Hamburger Menu
       ========================================================================== */
    const mobileToggle = document.getElementById('mobileToggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navbar) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Close menu drawer when any link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       Sticky Header and Navigation Scrollspy
       ========================================================================== */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        // Toggle sticky background header
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Section tracker Scrollspy
        let currentSectionId = 'hero';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120; // offset to trigger active state slightly early
            const secHeight = sec.offsetHeight;
            if (scrollY >= secTop && scrollY < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSectionId) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run immediately on load

    /* ==========================================================================
       Project Filtering System
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active style from all filter pills
            filterButtons.forEach(b => b.classList.remove('active'));
            // Apply active class to clicked pill
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                    // Trigger small fade/scale animate back in
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    /* ==========================================================================
       Scroll Triggered Reveal Animations (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll(
        '.reveal-fade, .reveal-fade-up, .reveal-fade-left, .reveal-fade-right, .reveal-fade-scale'
    );

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once animated in
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: '0px 0px -50px 0px' // Slightly inset trigger viewport boundary
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers: show elements immediately
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    /* ==========================================================================
       AJAX Contact Form Submission Handler
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formSubmitBtn = document.getElementById('formSubmitBtn');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Setup loading state
            const origBtnText = formSubmitBtn.innerHTML;
            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            
            // Clear status
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';

            // Gather inputs
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            try {
                // Post JSON payload to backend Flask route
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, subject, message })
                });

                const result = await response.json();

                if (response.ok && result.status === 'success') {
                    // Success state
                    formStatus.textContent = result.message;
                    formStatus.classList.add('success');
                    formStatus.style.display = 'block';
                    contactForm.reset();
                } else {
                    // Error response from flask validation
                    formStatus.textContent = result.message || 'An error occurred. Please try again.';
                    formStatus.classList.add('error');
                    formStatus.style.display = 'block';
                }
            } catch (error) {
                // Network or connection error
                console.error('Contact Form error:', error);
                formStatus.textContent = 'Failed to connect to server. Please check your network connection.';
                formStatus.classList.add('error');
                formStatus.style.display = 'block';
            } finally {
                // Restore button state
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = origBtnText;
            }
        });
    }
});
