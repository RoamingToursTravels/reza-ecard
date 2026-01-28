/**
 * E-Card JavaScript - Digital Business Card
 * Author: M S Kamran
 * Organization: Roaming BD
 * Description: Interactive functionality for digital business card
 */

// ===== CONFIGURATION CONSTANTS =====
// Animation Settings
const ANIMATION = {
    notificationDuration: 3000,
    transitionDelay: 100,
    iconRotationDelay: 150
};

// ===== CONTACT MANAGEMENT =====

/**
 * Generates and downloads a vCard (.vcf) file for the contact.
 */
function saveContact() {
    const name = "Md. Rezaul Awal";
    const mobile = "+8801737344555";
    const email1 = "reza@derbana.com";

    const vCard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${name}`,
        `N:${name};;;;`,
        `TITLE:Lead Auditor`,
        `TEL;TYPE=CELL:${mobile}`,
        `EMAIL;TYPE=WORK:${email1}`,
        "END:VCARD"
    ].join('\n');

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/ /g, '_')}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Contact saved successfully!', 'success');
}

/**
 * Initializes event listeners for address toggling.
 */
function initAddressToggle() {
    document.querySelectorAll('.ecard-address-toggle').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const details = this.nextElementSibling;
            if (details && details.classList.contains('ecard-address-details')) {
                details.style.display = details.style.display === 'none' ? 'block' : 'none';
            }
        });
    });
}


// ===== DARK MODE FUNCTIONALITY =====
/**
 * Initializes dark mode toggle functionality
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = darkModeToggle?.querySelector('i');
    
    if (!darkModeToggle || !icon) {
        console.error('Dark mode toggle elements not found');
        return;
    }
    
    // Check for saved dark mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply saved preference
    if (isDarkMode) {
        body.classList.add('dark-mode');
        updateDarkModeIcon(icon, true);
    }
    
    // Add click event listener
    darkModeToggle.addEventListener('click', function() {
        toggleDarkMode(body, icon, darkModeToggle);
    });
    
    // Add smooth transition to icon
    icon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
}

/**
 * Toggles between light and dark mode
 * @param {HTMLElement} body - Document body element
 * @param {HTMLElement} icon - Toggle button icon element
 * @param {HTMLElement} toggleButton - Toggle button element
 */
function toggleDarkMode(body, icon, toggleButton) {
    const bgPattern = document.querySelector('.ecard-bg-pattern');
    
    if (!bgPattern) return;
    
    // Add fade effect during transition
    bgPattern.style.opacity = '0.7';
    
    setTimeout(() => {
        // Toggle dark mode class
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        
        // Update icon with smooth rotation
        icon.style.transform = 'rotate(180deg)';
        
        setTimeout(() => {
            updateDarkModeIcon(icon, isDark);
            icon.style.transform = 'rotate(0deg)';
        }, ANIMATION.iconRotationDelay);
        
        // Save preference to localStorage
        localStorage.setItem('darkMode', isDark.toString());
        
        // Restore background opacity
        setTimeout(() => {
            bgPattern.style.opacity = '1';
        }, ANIMATION.transitionDelay);
        
    }, ANIMATION.transitionDelay);
    
    // Add button press animation
    toggleButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        toggleButton.style.transform = '';
    }, ANIMATION.iconRotationDelay);
}

/**
 * Updates dark mode toggle icon
 * @param {HTMLElement} icon - Icon element to update
 * @param {boolean} isDark - Whether dark mode is active
 */
function updateDarkModeIcon(icon, isDark) {
    if (isDark) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ===== NOTIFICATION SYSTEM =====
/**
 * Displays modern notification messages
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, danger, info, warning)
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const iconMap = {
        success: 'check-circle',
        danger: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    // Create notification element
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        border-radius: 10px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${iconMap[type] || iconMap.info} me-2"></i>
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after specified duration
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, ANIMATION.notificationDuration);
}

// ===== ANIMATION SYSTEM =====
/**
 * Initializes sequential animations for page elements
 */
function initAnimations() {
    const animateElements = document.querySelectorAll('.animate-element');
    
    animateElements.forEach(element => {
        const delay = parseInt(element.getAttribute('data-delay')) || 0;
        
        setTimeout(() => {
            element.classList.add('animate-in');
        }, delay);
    });
}



// ===== DYNAMIC CONTENT POPULATION =====
// No dynamic population needed - all data is hardcoded in HTML

// ===== INITIALIZATION =====
/**
 * Main initialization function
 * Runs when DOM content is loaded
 */
function initECard() {
    try {
        // Initialize core functionality
        initDarkMode();
        initAnimations();
        initAddressToggle();

        const saveContactBtn = document.getElementById('saveContactBtn');
        if (saveContactBtn) {
            saveContactBtn.addEventListener('click', saveContact);
        }
        
        console.log('E-Card initialized successfully');
    } catch (error) {
        console.error('Error initializing E-Card:', error);
        showNotification('Error loading page features. Please refresh.', 'warning');
    }
}

// ===== EVENT LISTENERS =====
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initECard);

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden - pause animations if needed
        console.log('Page hidden - optimizing performance');
    } else {
        // Page is visible - resume normal operation
        console.log('Page visible - resuming normal operation');
    }
});

// Export functions for global access (if needed)
if (typeof window !== 'undefined') {
    window.ECard = {
        showNotification,
        saveContact
    };
}