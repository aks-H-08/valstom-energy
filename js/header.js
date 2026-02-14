// Navbar Functionality with Retry Logic
class VANavbar {
    constructor() {
        this.initAttempts = 0;
        this.maxAttempts = 20; // Try for 10 seconds (20 x 500ms)
        this.retryInterval = null;
        
        // Try to initialize immediately
        this.attemptInit();
    }

    attemptInit() {
        this.initAttempts++;
        
        // Try to find the navbar elements
        const menuToggle = document.querySelector('.ve-menu-toggle');
        const nav = document.querySelector('.ve-nav');
        const header = document.querySelector('.ve-header');
        
        if (menuToggle && nav && header) {
            // Elements found! Initialize properly
            console.log(`✅ Navbar elements found on attempt ${this.initAttempts}`);
            this.init();
            
            // Clear retry interval if it's running
            if (this.retryInterval) {
                clearInterval(this.retryInterval);
            }
        } else {
            // Elements not found yet
            if (this.initAttempts === 1) {
                console.log('⏳ Navbar elements not found yet, will retry...');
                console.log('Elements found:', { menuToggle: !!menuToggle, nav: !!nav, header: !!header });
            }
            
            if (this.initAttempts < this.maxAttempts) {
                // Retry after 500ms
                if (!this.retryInterval) {
                    this.retryInterval = setInterval(() => {
                        this.attemptInit();
                    }, 500);
                }
            } else {
                console.error('❌ Navbar elements not found after', this.maxAttempts * 500, 'ms');
                console.error('The .ve-header, .ve-nav, and .ve-menu-toggle elements do not exist in the DOM');
            }
        }
    }

    init() {
        // Elements
        this.menuToggle = document.querySelector('.ve-menu-toggle');
        this.nav = document.querySelector('.ve-nav');
        this.dropdowns = document.querySelectorAll('.ve-dropdown');
        this.header = document.querySelector('.ve-header');
        
        // Debug logging
        console.log('Navbar Init Complete:', {
            menuToggle: !!this.menuToggle,
            nav: !!this.nav,
            header: !!this.header,
            dropdowns: this.dropdowns.length,
            windowWidth: window.innerWidth
        });
        
        // State
        this.isMobile = window.innerWidth <= 768;
        this.scrollThreshold = 100;
        this.lastScrollY = window.scrollY;
        
        // Initialize
        this.setupEventListeners();
        this.updateHeaderOnScroll();
    }

    setupEventListeners() {
        // Mobile menu toggle - with safety check
        if (this.menuToggle) {
            console.log('✅ Attaching click listener to hamburger menu');
            this.menuToggle.addEventListener('click', (e) => {
                console.log('🔔 Hamburger menu clicked!');
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        } else {
            console.warn('⚠️ menuToggle not found, skipping event listener');
        }
        
        // Dropdown functionality
        this.dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.ve-drop-toggle');
            
            // Desktop hover
            dropdown.addEventListener('mouseenter', () => {
                if (!this.isMobile) {
                    this.closeAllDropdowns();
                    dropdown.classList.add('open');
                }
            });
            
            dropdown.addEventListener('mouseleave', () => {
                if (!this.isMobile) {
                    setTimeout(() => {
                        if (!dropdown.matches(':hover')) {
                            dropdown.classList.remove('open');
                        }
                    }, 300);
                }
            });
            
            // Mobile click
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    if (this.isMobile) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.toggleDropdown(dropdown);
                    }
                });
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.ve-dropdown') && !e.target.closest('.ve-menu-toggle')) {
                this.closeAllDropdowns();
            }
            
            // Close mobile menu when clicking a regular link
            if (this.isMobile && e.target.closest('.ve-nav-list a:not(.ve-drop-toggle)')) {
                this.closeMobileMenu();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
                this.closeAllDropdowns();
            }
        });
        
        // Window scroll
        window.addEventListener('scroll', () => this.updateHeaderOnScroll());
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    toggleMobileMenu() {
        if (!this.menuToggle || !this.nav) {
            console.warn('Cannot toggle menu: elements missing');
            return;
        }
        
        const isOpening = !this.menuToggle.classList.contains('open');
        
        this.menuToggle.classList.toggle('open');
        this.nav.classList.toggle('open');
        
        if (isOpening) {
            document.body.style.overflow = 'hidden';
            this.closeAllDropdowns();
            console.log('📖 Mobile menu opened');
        } else {
            document.body.style.overflow = '';
            console.log('📖 Mobile menu closed');
        }
    }

    closeMobileMenu() {
        if (!this.menuToggle || !this.nav) return;
        
        this.menuToggle.classList.remove('open');
        this.nav.classList.remove('open');
        document.body.style.overflow = '';
    }

    toggleDropdown(dropdown) {
        const isOpening = !dropdown.classList.contains('open');
        
        // Close all other dropdowns
        this.closeAllDropdowns();
        
        // Toggle the clicked dropdown
        if (isOpening) {
            dropdown.classList.add('open');
        }
    }

    closeAllDropdowns() {
        this.dropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    }

    updateHeaderOnScroll() {
        if (!this.header) return;
        
        const currentScrollY = window.scrollY;
        
        // Scroll effect
        if (currentScrollY > this.scrollThreshold) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
       
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // Only reset if crossing the mobile/desktop threshold
        if (wasMobile && !this.isMobile) {
            // Switching from mobile to desktop
            this.closeMobileMenu();
            this.closeAllDropdowns();
            document.body.style.overflow = '';
            if (this.header) {
                this.header.style.transform = 'translateY(0)';
            }
        }
    }
}

// Initialize when script loads
console.log('🚀 Navbar script loaded, attempting to initialize...');
new VANavbar();

// Also try on DOMContentLoaded as backup
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🔄 DOMContentLoaded event fired, checking navbar again...');
        // Check if navbar is already initialized, if not try again
        const menuToggle = document.querySelector('.ve-menu-toggle');
        if (menuToggle && !menuToggle.__navbarInitialized) {
            console.log('📋 Re-initializing navbar after DOMContentLoaded');
            new VANavbar();
        }
    });
}

// Helper functions
function setupAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    // Close mobile menu if open
                    const menuToggle = document.querySelector('.ve-menu-toggle');
                    if (menuToggle?.classList.contains('open')) {
                        menuToggle.click();
                    }
                    
                    // Smooth scroll
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function setupActiveLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.ve-nav-list a').forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath || 
            (currentPath === '' && linkPath === 'index.html') ||
            (currentPath === 'index.html' && linkPath === '')) {
            link.classList.add('active');
        }
    });
    
    // Add CSS for active state
    if (!document.querySelector('style[data-active-links]')) {
        const style = document.createElement('style');
        style.setAttribute('data-active-links', 'true');
        style.textContent = `
            .ve-nav-list a.active {
                background: rgba(255, 255, 255, 0.2);
                font-weight: 600;
            }
            
            .ve-nav-list a.active::after {
                width: calc(100% - 28px);
            }
            
            @media (max-width: 768px) {
                .ve-nav-list a.active {
                    background: rgba(255, 255, 255, 0.15);
                }
            }
        `;
        document.head.appendChild(style);
    }
}