/**
 * ai-service.js - Handles AI integration with Gemini API
 * Manages API initialization and AI-powered suggestions
 */

const AIService = (function() {
    // Private variables
    const DEFAULT_API_KEY = "AIzaSyD76aus2cXj_hyqg-uBKB12xiJJHyAmn4Q";
    const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
    
    let currentApiKey = null;
    let isInitialized = false;
    
    // Private methods
    
    // Test the API connection with a simple request
    async function testApiConnection() {
        try {
            console.log("Testing API connection with key:", currentApiKey.substring(0, 5) + "...");
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
    
    // Public API
    return {
        // Check if Gemini is initialized
        isGeminiInitialized: function() {
            return isInitialized;
        },
        
        // Initialize Gemini API with the provided API key
        initGeminiAPI: function(apiKey = null) {
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
                        // Update UI
                        UIController.updateGeminiStatus(true);
                    } else {
                        console.error("Failed to initialize Gemini API");
                        UIController.updateGeminiStatus(false);
                    }
                });

                return true; // Return true initially, actual status will be updated asynchronously
            } catch (error) {
                console.error("Error initializing Gemini API:", error);
                return false;
            }
        },
        
        // Generate task optimization suggestions
        generateTaskOptimizations: async function(tasks, projectName) {
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
                    - Humans: ${task.humanCount || 0}
                    - Bots: ${task.botCount || 0}
                    - Dependencies: ${task.dependency || 'None'}
                    ${task.resourceAllocation ? `- AI Allocation: ${task.resourceAllocation}` : ''}
                `).join('\n')}

                Based on this information, provide a VERY CONCISE analysis (maximum 300 words total) with:
                1. Critical path identification (just list the tasks in order)
                2. Top 3 optimization recommendations using PMI/PRINCE2 terminology
                3. Top 2 potential risks and brief mitigation strategies
                4. One suggestion for improving human/bot allocation

                Format your response in short bullet points only. Be extremely concise.
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
        },
        
        // Generate priority scores for tasks
        generateTaskPriorities: async function(tasks) {
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
                    - Dependencies: ${task.dependency || 'None'}
                `).join('\n')}

                Analyze these tasks and assign a priority score to each task on a scale of 1-10,
                where 10 is highest priority. Consider critical path, resource constraints, and PMI best practices.

                Return ONLY a JSON object with task names as keys and priority scores as values.
                Example format: { "Task1": 8.5, "Task2": 6.2 }
                Do not include any explanations or additional text, just the JSON object.
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
        },
        
        // Generate Gantt chart suggestions
        generateGanttChartSuggestions: async function(tasks, projectName) {
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
                    - Humans: ${task.humanCount || 0}
                    - Bots: ${task.botCount || 0}
                    - Dependencies: ${task.dependency || 'None'}
                    - Start Date: ${task.startDate.toDateString()}
                    - End Date: ${task.endDate.toDateString()}
                    ${task.resourceAllocation ? `- AI Allocation: ${task.resourceAllocation}` : ''}
                `).join('\n')}

                Based on this information, provide a VERY CONCISE analysis (maximum 250 words total) with:
                1. Key milestones (maximum 3)
                2. Parallel tasks that can be executed simultaneously (just list them)
                3. One sentence about human/bot resource optimization

                Format your response in short bullet points only. Be extremely concise.
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
    };
})();
