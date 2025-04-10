// Gemini AI Service for Project Scheduler
// This service handles interactions with the Google Gemini API using direct REST calls

// Create a global GeminiService object to avoid conflicts
window.GeminiService = {};

// Default API key (for demonstration purposes only)
const DEFAULT_API_KEY = "AIzaSyD76aus2cXj_hyqg-uBKB12xiJJHyAmn4Q";
let currentApiKey = null;
let isInitialized = false;

// Base URL for Gemini API
const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Initialize the Gemini API
function initGeminiAPI(apiKey = null) {
    try {
        // Use provided API key or fall back to default
        currentApiKey = apiKey || DEFAULT_API_KEY;

        if (!currentApiKey) {
            console.error("No API key provided for Gemini API");
            return false;
        }

        // Test the API with a simple request
        testApiConnection().then(success => {
            isInitialized = success;
            if (success) {
                console.log("Gemini API initialized successfully");
                // Update UI if needed
                const statusElement = document.getElementById("geminiStatus");
                const optimizeButton = document.getElementById("geminiOptimizeBtn");
                const ganttButton = document.getElementById("geminiGanttBtn");

                if (statusElement) {
                    statusElement.textContent = "Gemini AI: Initialized";
                    statusElement.classList.add("initialized");
                }
                if (optimizeButton) {
                    optimizeButton.disabled = false;
                }
                if (ganttButton) {
                    ganttButton.disabled = false;
                }
            } else {
                console.error("Failed to initialize Gemini API");
            }
        });

        return true; // Return true initially, actual status will be updated asynchronously
    } catch (error) {
        console.error("Error initializing Gemini API:", error);
        return false;
    }
}

// Test the API connection with a simple request
async function testApiConnection() {
    try {
        const response = await fetch(`${GEMINI_API_BASE_URL}/gemini-2.0-flash:generateContent?key=${currentApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Hello, are you working?" }]
                }]
            })
        });

        if (!response.ok) {
            console.error("API test failed:", await response.text());
            return false;
        }

        const data = await response.json();
        return data && data.candidates && data.candidates.length > 0;
    } catch (error) {
        console.error("Error testing API connection:", error);
        return false;
    }
}

// Generate task optimization suggestions based on the current tasks
async function generateTaskOptimizations(tasks, projectName) {
    if (!isInitialized) {
        console.error("Gemini API not initialized");
        return { success: false, message: "AI service not available" };
    }

    try {
        // Create a prompt for Gemini to analyze the tasks
        const prompt = `
        I have a project named "${projectName || 'Unnamed Project'}" with the following tasks:
        ${tasks.map(task => `
            - Task: ${task.name}
            - Duration: ${task.duration} days
            - Team: ${task.teamAssigned}
            - Team Size: ${task.teamSize}
            - Dependencies: ${task.dependency || 'None'}
        `).join('\n')}

        Based on this information, please provide:
        1. Optimal task sequencing to minimize project duration according to PMI and PRINCE2 methodologies
        2. Resource allocation suggestions following best project management practices
        3. Potential bottlenecks or risks and mitigation strategies
        4. Task optimizations to improve efficiency
        5. Critical path analysis

        Format your response in clear sections with bullet points. Include specific PMI/PRINCE2 terminology and best practices where relevant.
        `;

        // Generate content from Gemini using direct API call
        const response = await fetch(`${GEMINI_API_BASE_URL}/gemini-2.0-flash:generateContent?key=${currentApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API error:", errorText);
            return {
                success: false,
                message: `API error: ${response.status} ${response.statusText}`
            };
        }

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            const textContent = data.candidates[0].content.parts[0].text;
            return {
                success: true,
                suggestions: textContent
            };
        } else {
            return {
                success: false,
                message: "No response generated from AI"
            };
        }
    } catch (error) {
        console.error("Error generating task optimizations:", error);
        return {
            success: false,
            message: "Failed to generate AI suggestions. Please try again later."
        };
    }
}

// Generate priority scores for tasks using Gemini
async function generateTaskPriorities(tasks) {
    if (!isInitialized) {
        console.error("Gemini API not initialized");
        return null;
    }

    try {
        // Create a prompt for Gemini to analyze and prioritize tasks
        const prompt = `
        I have the following project tasks:
        ${tasks.map(task => `
            - Task: ${task.name}
            - Duration: ${task.duration} days
            - Team: ${task.teamAssigned}
            - Team Size: ${task.teamSize}
            - Dependencies: ${task.dependency || 'None'}
        `).join('\n')}

        Please analyze these tasks and assign a priority score to each task on a scale of 1-10,
        where 10 is highest priority. Consider factors like:
        - Critical path (dependencies)
        - Resource constraints
        - Task duration
        - Team workload
        - PMI and PRINCE2 best practices for project prioritization

        Return ONLY a JSON object with task names as keys and priority scores as values.
        Example format: { "Task1": 8.5, "Task2": 6.2 }
        `;

        // Generate content from Gemini using direct API call
        const response = await fetch(`${GEMINI_API_BASE_URL}/gemini-2.0-flash:generateContent?key=${currentApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            console.error("API error:", await response.text());
            return null;
        }

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            const textContent = data.candidates[0].content.parts[0].text;

            // Parse the JSON response
            try {
                // Extract JSON from the response (in case there's additional text)
                const jsonMatch = textContent.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const priorityScores = JSON.parse(jsonMatch[0]);
                    return priorityScores;
                } else {
                    console.error("Could not extract JSON from Gemini response");
                    return null;
                }
            } catch (jsonError) {
                console.error("Error parsing priority scores JSON:", jsonError);
                return null;
            }
        } else {
            console.error("No response generated from AI");
            return null;
        }
    } catch (error) {
        console.error("Error generating task priorities:", error);
        return null;
    }
}

// Generate Gantt chart suggestions using Gemini
async function generateGanttChartSuggestions(tasks, projectName) {
    if (!isInitialized) {
        console.error("Gemini API not initialized");
        return { success: false, message: "AI service not available" };
    }

    try {
        // Create a prompt for Gemini to generate Gantt chart suggestions
        const prompt = `
        I have a project named "${projectName || 'Unnamed Project'}" with the following tasks:
        ${tasks.map(task => `
            - Task: ${task.name}
            - Duration: ${task.duration} days
            - Team: ${task.teamAssigned}
            - Team Size: ${task.teamSize}
            - Dependencies: ${task.dependency || 'None'}
            - Start Date: ${task.startDate.toDateString()}
            - End Date: ${task.endDate.toDateString()}
        `).join('\n')}

        Based on this information, please provide:
        1. A textual representation of an optimized Gantt chart schedule
        2. Suggestions for parallel tasks that can be executed simultaneously
        3. Critical path identification
        4. Resource leveling recommendations
        5. Milestone suggestions based on PMI/PRINCE2 methodologies

        Format your response in clear sections with bullet points.
        `;

        // Generate content from Gemini using direct API call
        const response = await fetch(`${GEMINI_API_BASE_URL}/gemini-2.0-flash:generateContent?key=${currentApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API error:", errorText);
            return {
                success: false,
                message: `API error: ${response.status} ${response.statusText}`
            };
        }

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
            const textContent = data.candidates[0].content.parts[0].text;
            return {
                success: true,
                suggestions: textContent
            };
        } else {
            return {
                success: false,
                message: "No response generated from AI"
            };
        }
    } catch (error) {
        console.error("Error generating Gantt chart suggestions:", error);
        return {
            success: false,
            message: "Failed to generate Gantt chart suggestions. Please try again later."
        };
    }
}

// Export the functions
window.GeminiService = {
    initGeminiAPI,
    generateTaskOptimizations,
    generateTaskPriorities,
    generateGanttChartSuggestions
};
