document.addEventListener('DOMContentLoaded', function() {
    const textExamples = [
        "Machine Learning Fundamentals",
        "History of Ancient Egypt",
        "Quantum Physics Basics",
        "Creative Writing Techniques",
        "Web Development with JavaScript"
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
});