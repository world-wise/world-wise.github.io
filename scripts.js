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

// Notification function
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

document.addEventListener('DOMContentLoaded', function() {
    const textExamples = [
        "The Pharaohs of Ancient Egypt",
        "Philosophy Schools of Thought",
        "Renaissance Architecture",
        "The Periodic Table of Elements",
        "World War II: Key Battles"
    ];
    const typedTextElement = document.getElementById('typedText');
    let currentExample = 0;
    let isTyping = true;
    let i = 0;
    let currentText = '';
    
    function typeEffect() {
        const maxLength = textExamples[currentExample].length;
        
        if (isTyping) {
            // Typing effect
            if (i < maxLength) {
                currentText += textExamples[currentExample].charAt(i);
                typedTextElement.textContent = currentText;
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
                setTimeout(typeEffect, 40); // Speed of erasing (a bit faster than typing)
            } else {
                // Finished erasing, move to next example
                isTyping = true;
                currentExample = (currentExample + 1) % textExamples.length;
                currentText = '';
                setTimeout(typeEffect, 500); // Pause before typing next example
            }
        }
    }
    
    // Start the typing animation
    typeEffect();
    
    // Add event listener to the contact button
    const contactButton = document.querySelector('.contact-button');
    if (contactButton) {
        contactButton.addEventListener('click', function() {
            window.location.href = 'mailto:arthur.queffelec@worldwise.fr';
        });
    }
});