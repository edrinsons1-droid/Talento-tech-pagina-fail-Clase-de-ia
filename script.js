/**
 * Talento Tech Clone - Interaction Script
 */

document.addEventListener('DOMContentLoaded', async () => {

    /* --- 1. Init AOS (Animate On Scroll) --- */
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,        // Animation duration
            easing: 'ease-in-out', // Easing function
            once: true,           // Whether animation should happen only once
            offset: 100           // Offset from original trigger point
        });
    }

    /* --- 2. Sticky Navbar --- */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- 3. Mobile Menu Toggle --- */
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Toggle icon between bars and times
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    /* --- 4. Active Link Highlight on Scroll --- */
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    /* --- 5. Custom Formspree Submission (AJAX) --- */
    // This provides a better user experience without reloading the page.
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Loading state
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    submitBtn.classList.remove('primary-btn');
                    submitBtn.style.backgroundColor = '#28a745';
                    submitBtn.style.color = 'white';
                    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Mensaje Enviado';
                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.classList.add('primary-btn');
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.color = '';
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 4000);
                } else {
                    alert('Hubo un problema al enviar tu mensaje. Intenta de nuevo.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                alert('Error de conexión. Revisa tu internet y vuelve a intentar.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    /* ==========================================================
       6. CHATBASE INTEGRATION (Client Code)
       ========================================================== */

    // --- CLIENT CODE ---
    const token = await getUserToken(); // Get the token from your server
    window.chatbase('identify', { token }); // identify the user with Chatbase
});
