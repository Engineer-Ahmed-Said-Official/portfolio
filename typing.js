/* =========================================
   Typing Effect Script
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const textElement = document.querySelector(".typing-text");
    if (!textElement) {
        console.warn("Typing Effect: Element .typing-text not found.");
        return;
    }

    const words = ["AI Manager", "Python Developer", "Problem Solver", "Tech Enthusiast"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, charIndex--);
            typeSpeed = 50;
        } else {
            textElement.textContent = currentWord.substring(0, charIndex++);
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length + 1) {
            isDeleting = true;
            typeSpeed = 2000; // Pause after typing
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    console.log("Typing Effect: Started");
    type();
});
