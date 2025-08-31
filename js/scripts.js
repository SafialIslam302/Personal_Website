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

    // Publications: dual-scope filtering (type + subject) with no-results message
    const filterButtons = document.querySelectorAll('.pub-filter');
    const noResultsEl = document.getElementById('pub-no-results');

    function applyFilters() {
        const activeType = document.querySelector('.pub-filter-type.active')?.getAttribute('data-filter') || 'all';
        const activeSubject = document.querySelector('.pub-filter-subject.active')?.getAttribute('data-filter') || 'all';

        let visibleCount = 0;
        document.querySelectorAll('.commit-item').forEach(item => {
            const itemType = item.getAttribute('data-type');
            const itemDomain = item.getAttribute('data-domain');

            const matchesType = activeType === 'all' || itemType === activeType;
            const matchesSubject = activeSubject === 'all' || itemDomain === activeSubject;

            if (matchesType && matchesSubject) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
            }
        });

        if (noResultsEl) noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const scope = this.getAttribute('data-scope');

            // Toggle active within the same scope only
            document.querySelectorAll(`.pub-filter-${scope}`).forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            applyFilters();
        });
    });

    // Apply once on load
    applyFilters();

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

// Interactive functionality
document.querySelectorAll('.experience-item').forEach(item => {
    item.addEventListener('click', function () {
        // Remove active class from all items and cards
        document.querySelectorAll('.experience-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.detail-card').forEach(c => c.classList.remove('active'));

        // Add active class to clicked item
        this.classList.add('active');

        // Show corresponding detail card
        const targetId = this.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});
