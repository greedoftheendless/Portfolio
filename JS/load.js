const welcomeTextElement = document.getElementById("welcome-text");

const textToType = "Welcome";
let charIndex = 0;
let isTyping = false;

// The main function that creates the typewriter effect
const typeWriter = () => {
  if (charIndex < textToType.length) {
    // Add one character at a time
    welcomeTextElement.textContent += textToType.charAt(charIndex);
    charIndex++;

    setTimeout(typeWriter, 100);
  } else {
    // Apply the fade-out animation
    welcomeTextElement.classList.add("fade-out");

    // Redirect to the main page after the animation completes
    setTimeout(() => {
      window.location.href = "main.html";
    }, 1000); // Matches the 1s animation duration

    isTyping = false;
  }
};

window.onload = () => {
  if (!isTyping) {
    isTyping = true;
    typeWriter();
  }
};
