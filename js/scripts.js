window.addEventListener('DOMContentLoaded', event => {
    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Theme toggle (persist in localStorage, but fallback gracefully)
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const toggleText = document.querySelector('#themeToggle .toggle-text');

    // Try to get stored theme, fallback to light if localStorage not available
    let storedTheme = 'light';
    try {
        storedTheme = localStorage.getItem('theme') || 'light';
    } catch (e) {
        console.log('localStorage not available, using default theme');
    }

    html.setAttribute('data-theme', storedTheme);
    updateToggleText();

    themeToggle?.addEventListener('click', () => {
        const current = html.getAttribute('data-theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        try {
            localStorage.setItem('theme', next);
        } catch (e) {
            console.log('Cannot save theme preference');
        }
        updateToggleText();
    });

    function updateToggleText() {
        const current = html.getAttribute('data-theme') || 'light';
        if (toggleText) toggleText.textContent = current === 'light' ? 'Dark' : 'Light';
    }

    // Publications: sort by year desc on load, then filter
    const filterButtons = document.querySelectorAll('.pub-filter');
    const grid = document.querySelector('.pub-grid');
    const pubs = Array.from(document.querySelectorAll('.pub-card'));

    // Helper to parse year from meta like "Dec 2022 · Conference" or "2025 · Poster"
    const getYear = (el) => {
        const meta = el.querySelector('.pub-meta')?.textContent || '';
        const m = meta.match(/(20\d{2})/);
        return m ? parseInt(m[1], 10) : 0;
    };

    // Sort DOM nodes by year desc
    pubs.sort((a, b) => getYear(b) - getYear(a)).forEach(el => grid?.appendChild(el));

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const type = btn.getAttribute('data-filter');
            pubs.forEach(item => {
                const t = item.getAttribute('data-type');
                item.style.display = (type === 'all' || t === type) ? '' : 'none';
            });
        });
    });

    // Contact form submission
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);

        // Update button and show loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Sending...';
        statusEl.textContent = '';

        try {
            const response = await fetch('https://formspree.io/f/xrbaegal', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                statusEl.textContent = '✓ Message sent successfully!';
                statusEl.className = 'small text-success';
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            statusEl.textContent = '✗ Failed to send. Please try again.';
            statusEl.className = 'small text-danger';
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-1"></i>Send Message';

            // Clear status after 5 seconds
            setTimeout(() => {
                statusEl.textContent = '';
                statusEl.className = 'small text-muted';
            }, 5000);
        }
    });

    // Footer year and back to top
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();

    document.getElementById('backToTop')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});