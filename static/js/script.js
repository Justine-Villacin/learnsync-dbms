// Login function
function handleLogin() {
    // Redirect to login page
    window.location.href = "/login";
}

// Carousel functionality
const cards = Array.from(document.querySelectorAll(".card"));
const positions = ["position-1", "position-2", "position-3", "position-4"];

function rotateNext() {
    positions.unshift(positions.pop()); // move last to first
    updatePositions();
}

function rotatePrev() {
    positions.push(positions.shift()); // move first to last
    updatePositions();
}

function updatePositions() {
    cards.forEach((card, index) => {
        card.className = "card " + positions[index];
    });
}

// Initialize carousel
updatePositions();

document.querySelector(".carousel-next").addEventListener("click", rotateNext);
document.querySelector(".carousel-prev").addEventListener("click", rotatePrev);

// Enhanced smooth scrolling with improved smoothness
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Use requestIdleCallback for non-urgent work
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    initiateSmoothScroll(targetElement);
                }, { timeout: 100 });
            } else {
                // Fallback for browsers that don't support requestIdleCallback
                requestAnimationFrame(() => {
                    initiateSmoothScroll(targetElement);
                });
            }
        }
    });
});

function initiateSmoothScroll(targetElement) {
    // Pre-calculate values for better performance
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
    
    const startPosition = window.pageYOffset;
    const targetPosition = elementTop - navbarHeight;
    const distance = targetPosition - startPosition;
    
    // Dynamic duration based on distance for consistent speed
    const duration = Math.min(Math.max(Math.abs(distance) * 0.5, 400), 1200);
    
    let startTime = null;
    
    // Use a high-performance easing function
    function easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Smoother easing with less aggressive acceleration
        const easeProgress = easeInOutQuart(progress);
        
        window.scrollTo({
            top: startPosition + distance * easeProgress,
            behavior: 'auto' // Use 'auto' to ensure our custom animation works
        });
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        } else {
            // Final position adjustment to ensure we land exactly on target
            window.scrollTo({
                top: targetPosition,
                behavior: 'auto'
            });
        }
    }
    
    // Start the animation on the next frame
    requestAnimationFrame(animation);
}

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactMessage = document.getElementById('contactMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch('/contact', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    contactMessage.className = 'success';
                    contactMessage.textContent = result.message;
                    
                    // Clear form
                    contactForm.reset();
                    
                    // Hide message after 5 seconds
                    setTimeout(() => {
                        contactMessage.style.display = 'none';
                    }, 5000);
                } else {
                    contactMessage.className = 'error';
                    contactMessage.textContent = result.error || 'Failed to send message. Please try again.';
                }
            } catch (error) {
                contactMessage.className = 'error';
                contactMessage.textContent = 'Network error. Please check your connection and try again.';
            }
        });
    }
});

// Optional: Add passive event listeners for better scrolling performance
document.addEventListener('DOMContentLoaded', function() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
        anchor.addEventListener('touchstart', null, { passive: true });
        anchor.addEventListener('touchmove', null, { passive: true });
    });
});

