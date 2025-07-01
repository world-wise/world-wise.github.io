/*
 * ===========================================
 * WORLDWISE LANDING PAGE - MODULAR SCRIPT SYSTEM
 * ===========================================
 * 
 * This script provides a modular, responsive system for the WorldWise landing page.
 * It includes the following modules:
 * 
 * 1. NEWSLETTER SUBSCRIPTION - Handles form submission and user notifications
 * 2. NOTIFICATION SYSTEM - Shows success/error messages to users
 * 3. TYPING ANIMATION - Dynamic text animation for the search input
 * 4. SCROLL INTERACTION SYSTEM - Manages scroll-to-section and scroll indicators
 * 5. SCROLL ANIMATION SYSTEM - GSAP-powered scroll-triggered animations
 * 
 * Key Features:
 * - Fully responsive design (desktop, tablet, mobile, extra-small)
 * - Forward-only scroll animations (no reverse on scroll-up)
 * - Dynamic font resizing for search text
 * - Modular class-based animation controller
 * - Clean separation of concerns
 * 
 * Dependencies:
 * - GSAP (GreenSock Animation Platform)
 * - ScrollTrigger plugin
 */

// ===========================================
// NEWSLETTER SUBSCRIPTION
// ===========================================

document.forms["newsletter-form"].addEventListener("submit", async (event) => {
    event.preventDefault();
    const resp = await fetch(event.target.action, {
      method: "POST",
      body: new URLSearchParams(new FormData(event.target)),
    });
    const body = await resp.json();
    console.log(body);
    
    // Show notification on successful subscription
    if (body && body.msg === "subscribed") {
      showNotification("Success! You've been added to our waitlist.");
    }
});

// ===========================================
// NOTIFICATION SYSTEM
// ===========================================

function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // Add to the DOM
  document.body.appendChild(notification);
  
  // Trigger animation by adding the active class after a small delay
  setTimeout(() => {
    notification.classList.add('active');
  }, 10);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('active');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300); // wait for fade-out animation to complete
  }, 3000);
}

// ===========================================
// TYPING ANIMATION FOR FAKE SEARCH
// ===========================================

function initializeTypingAnimation() {
    const textExamples = [
        "The Pharaohs of Ancient Egypt",
        "Philosophy Schools of Thought",
        "Renaissance Architecture",
        "The Periodic Table of Elements",
        "World War II: Key Battles"
    ];
    const typedTextElement = document.getElementById('typedText');
    const fakeSearchElement = document.querySelector('.fake-search');
    let currentExample = 0;
    let isTyping = true;
    let i = 0;
    let currentText = '';
    
    // Function to adjust font size based on text length
    function adjustFontSize() {
        if (!typedTextElement || !fakeSearchElement) return;
        
        const containerWidth = fakeSearchElement.offsetWidth - 60; // Account for padding and cursor
        const textWidth = typedTextElement.scrollWidth;
        
        if (textWidth > containerWidth) {
            const scaleFactor = containerWidth / textWidth;
            const newFontSize = Math.max(1.5 * scaleFactor, 0.8); // Minimum font size of 0.8rem
            fakeSearchElement.style.fontSize = `${newFontSize}rem`;
        } else {
            fakeSearchElement.style.fontSize = '1.5rem'; // Reset to default
        }
    }
    
    function typeEffect() {
        const maxLength = textExamples[currentExample].length;
        
        if (isTyping) {
            // Typing effect
            if (i < maxLength) {
                currentText += textExamples[currentExample].charAt(i);
                typedTextElement.textContent = currentText;
                adjustFontSize(); // Adjust font size as text is typed
                i++;
                setTimeout(typeEffect, 80); // Speed of typing
            } else {
                // Finished typing, wait before erasing
                isTyping = false;
                setTimeout(typeEffect, 2000); // Pause when fully typed
            }
        } else {
            // Erasing effect
            if (i > 0) {
                i--;
                currentText = textExamples[currentExample].substring(0, i);
                typedTextElement.textContent = currentText;
                adjustFontSize(); // Adjust font size as text is erased
                setTimeout(typeEffect, 40); // Speed of erasing (a bit faster than typing)
            } else {
                // Finished erasing, move to next example
                isTyping = true;
                currentExample = (currentExample + 1) % textExamples.length;
                currentText = '';
                fakeSearchElement.style.fontSize = '1.5rem'; // Reset font size
                setTimeout(typeEffect, 500); // Pause before typing next example
            }
        }
    }
    
    // Start the typing animation
    typeEffect();
}

// ===========================================
// SCROLL INTERACTION SYSTEM
// ===========================================

function initializeScrollInteractions() {
    // Add event listener to the fake search button
    const fakeButton = document.querySelector('.fake-button');
    if (fakeButton) {
        fakeButton.addEventListener('click', function() {
            const scrollWrapper = document.querySelector('.scroll-wrapper');
            if (scrollWrapper) {
                scrollWrapper.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // Scroll indicator functionality
    const scrollIndicator = document.getElementById('scroll-indicator');
    const scrollWrapper = document.querySelector('.scroll-wrapper');
    let showIndicatorTimeout;
    let hasReachedScrollWrapper = false;

    // Show scroll indicator after 5 seconds if user hasn't scrolled to scroll-wrapper
    function showScrollIndicator() {
        if (!hasReachedScrollWrapper && scrollIndicator) {
            showIndicatorTimeout = setTimeout(() => {
                scrollIndicator.classList.add('show');
            }, 5000); // Show after 5 seconds
        }
    }

    // Hide scroll indicator
    function hideScrollIndicator() {
        if (scrollIndicator) {
            scrollIndicator.classList.remove('show');
        }
        if (showIndicatorTimeout) {
            clearTimeout(showIndicatorTimeout);
        }
    }

    // Check if user has reached the scroll-wrapper
    function checkScrollPosition() {
        if (scrollWrapper) {
            const rect = scrollWrapper.getBoundingClientRect();
            // If scroll-wrapper top is at or above viewport top
            if (rect.top <= 0) {
                hasReachedScrollWrapper = true;
                hideScrollIndicator();
            }
        }
    }

    // Add click event to scroll indicator
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            if (scrollWrapper) {
                scrollWrapper.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                hideScrollIndicator();
            }
        });
    }

    // Start the timer to show scroll indicator
    showScrollIndicator();

    // Listen for scroll events to check position
    window.addEventListener('scroll', checkScrollPosition);

    // Check initial position
    checkScrollPosition();
    
    // Add event listener to the contact button
    const contactButton = document.querySelector('.contact-button');
    if (contactButton) {
        contactButton.addEventListener('click', function() {
            window.location.href = 'mailto:arthur.queffelec@worldwise.fr';
        });
    }
}

// ===========================================
// SCROLL ANIMATION SYSTEM
// ===========================================

class ScrollAnimationController {
    constructor() {
        this.maxProgress = 0;
        this.animationLocked = false;
        this.scrollTriggerInstance = null;
        this.timeline = null;
        
        // Initialize GSAP plugins
        if (typeof gsap !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
    }

    // Device detection utilities
    isMobile() {
        return window.matchMedia("(max-width: 768px)").matches;
    }

    isTablet() {
        return window.matchMedia("(max-width: 1024px)").matches && !this.isMobile();
    }

    // Initialize the scroll-triggered animation
    initializeScrollAnimation() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded, skipping scroll animations');
            return;
        }

        const knowledgePath = document.querySelector("#knowledge-path-svg");
        if (!knowledgePath) {
            console.warn('Knowledge path SVG not found');
            return;
        }

        // Set up initial visibility
        gsap.set("#text-top-left", { opacity: 1 });

        // Create timeline
        this.timeline = gsap.timeline({ paused: true });

        // Set up SVG path animation
        const pathLength = knowledgePath.getTotalLength();
        knowledgePath.style.strokeDasharray = pathLength;
        knowledgePath.style.strokeDashoffset = pathLength;

        // Build device-specific animations
        this.buildAnimationTimeline(knowledgePath);

        // Create ScrollTrigger
        this.createScrollTrigger();

        // Handle window resize
        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
        });
    }

    // Create the ScrollTrigger instance with custom progress handling
    createScrollTrigger() {
        this.scrollTriggerInstance = ScrollTrigger.create({
            trigger: ".scroll-wrapper",
            start: "top top",
            end: this.isMobile() ? "+=500vh" : "+=600vh",
            pin: true,
            onUpdate: (self) => {
                if (!this.animationLocked) {
                    // Allow normal progression
                    if (self.progress >= this.maxProgress) {
                        this.maxProgress = self.progress;
                        this.timeline.progress(self.progress);
                    } else if (this.maxProgress > 0.1) {
                        // Lock animation if we've progressed significantly and user scrolls back
                        this.animationLocked = true;
                        this.timeline.progress(this.maxProgress);
                    } else {
                        // Allow small backward movements early in animation
                        this.timeline.progress(self.progress);
                    }
                }
                // If locked, keep timeline at max progress
                if (this.animationLocked) {
                    this.timeline.progress(this.maxProgress);
                }
            }
        });
    }

    // Build animation timeline based on device type
    buildAnimationTimeline(knowledgePath) {
        if (this.isMobile()) {
            this.buildMobileAnimation(knowledgePath);
        } else if (this.isTablet()) {
            this.buildTabletAnimation(knowledgePath);
        } else {
            this.buildDesktopAnimation(knowledgePath);
        }
    }

    // Mobile-specific animations
    buildMobileAnimation(knowledgePath) {
        this.timeline
            .to(knowledgePath, { strokeDashoffset: 0, duration: 1.5, ease: "power1.inOut" }, 0.2)
            .to("#knowledge-path", { opacity: 1, duration: 0.1, ease: "power1.inOut" }, 0.1)
            .to("#text-top-right", { opacity: 1, duration: 0.3 }, 0.8)
            .to("#knowledge-path-svg", { scale: 1, duration: 1, ease: "power1.inOut", opacity: 1 }, 1.0)
            .to("#text-bottom-right", { opacity: 1, duration: 0.3 }, 1.5)
            .fromTo("#guiding-star",
                { opacity: 0, scale: 0.5 },
                { opacity: 1, scale: 1, duration: 1.5, ease: "power1.inOut" }, 2.0)
            .to("#text-bottom-left", { opacity: 1, duration: 0.3 }, 3.0);
    }

    // Tablet-specific animations
    buildTabletAnimation(knowledgePath) {
        this.timeline
            .to(knowledgePath, { strokeDashoffset: 0, duration: 2.0, ease: "power1.inOut" }, 0.2)
            .to("#knowledge-path", { opacity: 1, duration: 0.1, ease: "power1.inOut" }, 0.1)
            .to("#text-top-right", { opacity: 1, duration: 0.3 }, 1.2)
            .to("#knowledge-path-svg", { scale: 1, duration: 1.5, ease: "power1.inOut", opacity: 1 }, 1.5)
            .to("#text-bottom-right", { opacity: 1, duration: 0.3 }, 2.0)
            .fromTo("#guiding-star",
                { x: "-5vw", opacity: 0, scale: 0.8 },
                { x: "-35vw", opacity: 1, scale: 1, duration: 2.0, ease: "power1.inOut" }, 3.0)
            .to("#text-bottom-left", { opacity: 1, duration: 0.3 }, 4.5);
    }

    // Desktop-specific animations
    buildDesktopAnimation(knowledgePath) {
        this.timeline
            .to(knowledgePath, { strokeDashoffset: 0, duration: 2.5, ease: "power1.inOut" }, 0.2)
            .to("#knowledge-path", { opacity: 1, duration: 0.1, ease: "power1.inOut" }, 0.1)
            .to("#text-top-right", { opacity: 1, duration: 0.3 }, 1.5)
            .to("#knowledge-path-svg", { scale: 1, duration: 2, ease: "power1.inOut", opacity: 1 }, 2.0)
            .to("#text-bottom-right", { opacity: 1, duration: 0.3 }, 2.5)
            .fromTo("#guiding-star",
                { x: "-10vw", opacity: 0, scale: 1 },
                { x: "-50vw", opacity: 1, scale: 1, duration: 2.5, ease: "power1.inOut" }, 3.5)
            .to("#text-bottom-left", { opacity: 1, duration: 0.5 }, 6);
    }

    // Clean up method
    destroy() {
        if (this.scrollTriggerInstance) {
            this.scrollTriggerInstance.kill();
        }
        if (this.timeline) {
            this.timeline.kill();
        }
    }
}

// Global instance
let scrollAnimationController = null;

function initializeScrollAnimations() {
    scrollAnimationController = new ScrollAnimationController();
    scrollAnimationController.initializeScrollAnimation();
}

// ===========================================
// INITIALIZATION
// ===========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initializeTypingAnimation();
    initializeScrollInteractions();
    initializeScrollAnimations();
});