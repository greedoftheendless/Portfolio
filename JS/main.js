// DOM Content Loaded Event Listener
document.addEventListener("DOMContentLoaded", function () {
  initializePortfolio();
  initializeRippleEffect();
});

// Initialize all portfolio functionality
function initializePortfolio() {
  setupSmoothScrolling();
  setupFormValidation();
  setupAnimations();
  setupNavigationHighlight();
  addTerminalEffect();
}

// Initialize Ripple Effect
function initializeRippleEffect() {
  const rippleContainer = document.getElementById("ripple-container");
  if (!rippleContainer) return;

  let lastMouseX = 0;
  let lastMouseY = 0;
  let isCreatingRipple = false;

  function createWaveRipple(e) {
    if (isCreatingRipple) return;
    isCreatingRipple = true;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Calculate movement vector
    const deltaX = mouseX - lastMouseX;
    const deltaY = mouseY - lastMouseY;
    const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Only create waves if there's significant movement (reduced threshold for subtlety)
    if (movement > 3) {
      const ripple = document.createElement("div");
      ripple.className = "water-ripple";

      // Create wave rings with varying sizes based on movement (reduced for subtlety)
      const numRings = Math.min(2, Math.max(1, Math.floor(movement / 20)));

      for (let i = 0; i < numRings; i++) {
        const ring = document.createElement("div");
        ring.className = "wave-ring";

        // Calculate wave properties based on movement
        const angle = Math.atan2(deltaY, deltaX);
        const delay = i * 100;
        const scale = 1 + i * 0.2;

        ring.style.setProperty("--wave-angle", `${angle}rad`);
        ring.style.setProperty("--wave-scale", scale);
        ring.style.animationDelay = `${delay}ms`;

        ripple.appendChild(ring);
      }

      // Position the ripple (smaller size for subtlety)
      const size = 60 + movement * 0.2;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${mouseX - size / 2}px`;
      ripple.style.top = `${mouseY - size / 2}px`;

      rippleContainer.appendChild(ripple);

      // Cleanup
      setTimeout(() => {
        if (ripple && ripple.parentElement) {
          ripple.style.opacity = "0";
          setTimeout(() => ripple.remove(), 500);
        }
      }, 1200);
    }

    // Update last position
    lastMouseX = mouseX;
    lastMouseY = mouseY;

    setTimeout(() => {
      isCreatingRipple = false;
    }, 80);
  }

  // Add mousemove event listener with throttling (increased for subtlety)
  let lastMove = 0;
  const moveThrottle = 60;

  document.addEventListener(
    "mousemove",
    (e) => {
      const now = Date.now();
      if (now - lastMove >= moveThrottle) {
        createWaveRipple(e);
        lastMove = now;
      }
    },
    { passive: true },
  );

  // Initialize last position on mouse enter
  document.addEventListener("mouseenter", (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  // Cleanup ripples when leaving the page
  window.addEventListener("beforeunload", () => {
    if (rippleContainer) {
      rippleContainer.innerHTML = "";
    }
  });
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Form validation and submission
function setupFormValidation() {
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  if (!form) return;

  // Real-time validation
  nameInput.addEventListener("blur", () => validateField(nameInput, "name"));
  emailInput.addEventListener("blur", () => validateField(emailInput, "email"));
  messageInput.addEventListener("blur", () =>
    validateField(messageInput, "message"),
  );

  // Form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {
      submitForm();
    }
  });
}

// Validate individual field
function validateField(field, type) {
  const value = field.value.trim();
  let isValid = false;

  switch (type) {
    case "name":
      isValid = value.length >= 2;
      break;
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
      break;
    case "message":
      isValid = value.length >= 10;
      break;
  }

  // Update field styling
  field.classList.remove("form-error", "form-success");
  if (value.length > 0) {
    field.classList.add(isValid ? "form-success" : "form-error");
  }

  return isValid;
}

// Validate entire form
function validateForm() {
  const nameValid = validateField(document.getElementById("name"), "name");
  const emailValid = validateField(document.getElementById("email"), "email");
  const messageValid = validateField(
    document.getElementById("message"),
    "message",
  );

  return nameValid && emailValid && messageValid;
}

// Submit form (simulated)
function submitForm() {
  const submitButton = document.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  // Show loading state
  submitButton.innerHTML = '<span class="spinner"></span> Sending...';
  submitButton.disabled = true;

  // Simulate form submission
  setTimeout(() => {
    // Reset form
    document.getElementById("contactForm").reset();

    // Show success message
    submitButton.innerHTML = "✓ Message Sent!";
    submitButton.classList.add("bg-green-500");

    // Reset button after delay
    setTimeout(() => {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
      submitButton.classList.remove("bg-green-500");

      // Remove validation classes
      document
        .querySelectorAll(".form-success, .form-error")
        .forEach((field) => {
          field.classList.remove("form-success", "form-error");
        });
    }, 3000);
  }, 2000);
}

// Setup scroll animations
function setupAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
      }
    });
  }, observerOptions);

  // Observe blog cards and sections
  const animateElements = document.querySelectorAll(".bg-gray-800, section");
  animateElements.forEach((el) => observer.observe(el));
}

// Navigation highlight on scroll
function setupNavigationHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("text-green-400", "text-sky-400");
      const href = link.getAttribute("href").substring(1);

      if (href === current) {
        if (link.textContent.includes("Blog")) {
          link.classList.add("text-sky-400");
        } else {
          link.classList.add("text-green-400");
        }
      }
    });
  });
}

// Add terminal typing effect
function addTerminalEffect() {
  const terminalElement = document.querySelector("pre");
  if (!terminalElement) return;

  // Store original content and clear
  const originalHtml = terminalElement.innerHTML.trim();
  terminalElement.innerHTML = "";

  let currentIndex = 0;
  const typeSpeed = 80;

  function typeNextCharacter() {
    if (currentIndex < originalHtml.length) {
      // Get current character or tag
      let char = originalHtml[currentIndex];

      // If it's the start of an HTML tag, get the whole tag
      if (char === "<") {
        const tagEnd = originalHtml.indexOf(">", currentIndex);
        if (tagEnd !== -1) {
          char = originalHtml.substring(currentIndex, tagEnd + 1);
          currentIndex = tagEnd + 1;
        } else {
          currentIndex++;
        }
      } else {
        currentIndex++;
      }

      // Add the character/tag and temporary cursor
      const currentText = originalHtml.substring(0, currentIndex);
      terminalElement.innerHTML =
        currentText + '<span class="blinking-cursor">|</span>';

      setTimeout(typeNextCharacter, typeSpeed);
    } else {
      // Typing complete - add permanent cursor
      terminalElement.innerHTML =
        originalHtml + '<span class="blinking-cursor">|</span>';
    }
  }

  // Start typing after delay
  setTimeout(typeNextCharacter, 1000);
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add scroll-to-top functionality
function addScrollToTop() {
  const scrollButton = document.createElement("button");
  scrollButton.innerHTML = "↑";
  scrollButton.className =
    "fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-green-400 to-sky-400 text-white rounded-full shadow-lg opacity-0 transition-opacity duration-300 hover:scale-110 z-50";
  scrollButton.style.display = "none";

  document.body.appendChild(scrollButton);

  // Show/hide button based on scroll position
  const toggleScrollButton = debounce(() => {
    if (window.scrollY > 300) {
      scrollButton.style.display = "block";
      setTimeout(() => scrollButton.classList.add("opacity-100"), 10);
    } else {
      scrollButton.classList.remove("opacity-100");
      setTimeout(() => (scrollButton.style.display = "none"), 300);
    }
  }, 100);

  window.addEventListener("scroll", toggleScrollButton);

  // Scroll to top functionality
  scrollButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Initialize scroll-to-top after DOM load
document.addEventListener("DOMContentLoaded", addScrollToTop);

// Handle mobile menu (if needed in future)
function setupMobileMenu() {
  // Mobile menu implementation can be added here
  console.log("Mobile menu setup ready for implementation");
}

// Performance optimization: Lazy load images
function setupLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("opacity-0");
        img.classList.add("opacity-100");
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Console easter egg for developers
(function () {
  const asciiArt = `
%c██████╗ ██████╗ ███████╗███████╗██████╗
██╔════╝ ██╔══██╗██╔════╝██╔════╝██╔══██╗
██║  ███╗██████╔╝█████╗  █████╗  ██║  ██║
██║   ██║██╔══██╗██╔══╝  ██╔══╝  ██║  ██║
╚██████╔╝██║  ██║███████╗███████╗██████╔╝
 ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝

Welcome to the matrix, developer! 🚀
Found something interesting? Let's connect!`;

  console.log(
    asciiArt,
    "color: #10b981; font-family: monospace; font-size: 12px;",
  );
})();
