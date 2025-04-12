/**
 * main.js - Entry point for the AI Project Scheduler application
 * Handles initialization and coordinates between modules
 */

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing application...");

    // Initialize UI event listeners
    UIController.initEventListeners();

    // Initialize date calculator
    DateCalculator.init();

    // Try to initialize Gemini with the default API key
    setTimeout(() => {
        AIService.initGeminiAPI();
    }, 1000);
});
