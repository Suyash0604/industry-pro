// Global variables
let tasks = [];
let nextId = 1;
let geminiInitialized = false;

// Default API key (for demonstration purposes only)
const DEFAULT_API_KEY = "AIzaSyD76aus2cXj_hyqg-uBKB12xiJJHyAmn4Q";
let currentApiKey = null;
let isInitialized = false;

// Base URL for Gemini API
const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing application...");

    // Try to initialize Gemini with the default API key
    setTimeout(() => {
        initGeminiAPI();
    }, 1000);
});

// Initialize Gemini API with the provided API key
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
            geminiInitialized = success;

            if (success) {
                console.log("Gemini API initialized successfully");
                // Update UI
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

// Initialize Gemini API with the provided API key from the UI
function initializeGemini() {
    console.log("initializeGemini function called");
    const apiKeyInput = document.getElementById("geminiApiKey");
    const apiKey = apiKeyInput.value.trim();
    const statusElement = document.getElementById("geminiStatus");

    if (!apiKey) {
        alert("Please enter a valid Gemini API key");
        return;
    }

    // Initialize the Gemini API
    const success = initGeminiAPI(apiKey);

    if (success) {
        statusElement.textContent = "Gemini AI: Initializing...";
        apiKeyInput.value = "";
    } else {
        statusElement.textContent = "Gemini AI: Initialization failed";
        statusElement.classList.remove("initialized");
        alert("Failed to initialize Gemini AI. Please check your API key and try again.");
    }
}

// Add a new task to the project
function addTask() {
    const name = document.getElementById("taskName").value.trim();
    const duration = parseInt(document.getElementById("duration").value);
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const dependencyName = document.getElementById("dependency").value.trim();
    const teamAssigned = document.getElementById("teamAssigned").value;
    const teamSize = parseInt(document.getElementById("teamSize").value);
    const teamMembersInput = document.getElementById("teamMembers").value.trim();

    if (!name || isNaN(duration) || duration <= 0 || !startDate || !endDate || isNaN(teamSize) || teamSize <= 0) {
        alert("Please enter valid Task Name, Duration, Start Date, End Date, and Team Size!");
        return;
    }

    if (tasks.some(task => task.name === name)) {
        alert("Task name must be unique!");
        return;
    }

    const teamMembers = teamMembersInput ? teamMembersInput.split(",").map(member => member.trim()) : [];
    if (teamMembers.length !== teamSize) {
        alert(`You entered ${teamMembers.length} members, but specified team size as ${teamSize}.`);
        return;
    }

    let dependency = null;
    if (dependencyName) {
        const dependencyTask = tasks.find(task => task.name === dependencyName);
        if (!dependencyTask) {
            alert("Dependency task not found!");
            return;
        }
        dependency = dependencyName;
    }

    tasks.push({
        id: nextId++,
        name,
        duration,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        dependency,
        teamAssigned,
        teamSize,
        teamMembers
    });

    displayTasks();
}

// Display tasks in the task list
function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = tasks.map(task => `
        <li>
            <strong>${task.name}</strong> - ${task.duration} days
            ${task.dependency ? `(Depends on: ${task.dependency})` : ""}
            <br><i>Team: ${task.teamAssigned} (${task.teamSize} members)</i>
            <br><i>Start: ${task.startDate.toDateString()}, End: ${task.endDate.toDateString()}</i>
        </li>`).join("\n");
}

// Generate AI schedule
function generateAISchedule() {
    if (tasks.length === 0) {
        alert("Please add tasks first!");
        return;
    }

    try {
        const sortedTasks = topologicalSort();
        if (!sortedTasks) return;

        calculateSchedule(sortedTasks);
        displayGanttChart(sortedTasks);
    } catch (error) {
        console.error("Error generating schedule:", error);
        alert("Error generating schedule. Please check the console for details.");
    }
}

// Topological sort for task dependencies
function topologicalSort() {
    const visited = new Set();
    const stack = [];
    const cycles = new Set();

    function visit(task, path) {
        if (cycles.has(task.name)) return;
        if (path.has(task.name)) {
            cycles.add(task.name);
            return;
        }
        if (visited.has(task.name)) return;

        path.add(task.name);
        if (task.dependency) {
            const dep = tasks.find(t => t.name === task.dependency);
            if (dep) visit(dep, new Set(path));
        }
        visited.add(task.name);
        stack.push(task);
    }

    tasks.forEach(task => {
        if (!visited.has(task.name)) visit(task, new Set());
    });

    if (cycles.size > 0) {
        alert(`Circular dependency detected: ${Array.from(cycles).join(", ")}`);
        return null;
    }

    return stack.reverse();
}

// Calculate schedule based on dependencies
function calculateSchedule(sortedTasks) {
    sortedTasks.forEach(task => {
        let earliestStart = new Date(task.startDate);

        if (task.dependency) {
            const depTask = sortedTasks.find(t => t.name === task.dependency);
            if (depTask) earliestStart = new Date(depTask.endDate);
        }

        task.startDate = new Date(earliestStart);
        task.endDate = new Date(earliestStart);
        task.endDate.setDate(task.endDate.getDate() + task.duration);
    });
}

// Display Gantt chart
function displayGanttChart(tasks) {
    const ganttChart = document.getElementById("ganttChart");
    ganttChart.innerHTML = tasks.map(task => `
        <div class="gantt-task">
            <div><strong>${task.name}</strong> - <i>Team: ${task.teamAssigned}</i></div>
            <div>${task.startDate.toDateString()} - ${task.endDate.toDateString()}</div>
            <div>Duration: ${task.duration} days</div>
        </div>`).join("\n");
}

// Generate AI suggestions
async function generateAISuggestions() {
    if (tasks.length === 0) {
        alert("No tasks available for AI recommendations!");
        return;
    }

    const aiSuggestionsDiv = document.getElementById("aiSuggestions");
    aiSuggestionsDiv.innerHTML = "<p>Generating AI suggestions...</p>";

    // If Gemini is initialized, use it for more intelligent suggestions
    if (geminiInitialized) {
        try {
            const priorityScores = await generateTaskPriorities(tasks);

            if (priorityScores) {
                // Apply the Gemini-generated priority scores to tasks
                const enhancedTasks = tasks.map(task => ({
                    ...task,
                    aiScore: priorityScores[task.name] || 5 // Default to 5 if not found
                })).sort((a, b) => b.aiScore - a.aiScore);

                aiSuggestionsDiv.innerHTML = enhancedTasks.map(task => `
                    <div class="ai-task">
                        <strong>${task.name}</strong> - Gemini Priority Score: ${task.aiScore.toFixed(1)}
                        <br><i>Suggested Start: ${task.startDate.toDateString()}, End: ${task.endDate.toDateString()}</i>
                        <br><i>Recommended Team: ${task.teamAssigned} (${task.teamSize} members)</i>
                    </div>
                `).join("\n");
                return;
            }
        } catch (error) {
            console.error("Error using Gemini for suggestions:", error);
            // Fall back to basic algorithm if Gemini fails
        }
    }

    // Basic algorithm as fallback
    const sortedTasks = tasks.map(task => ({
        ...task,
        aiScore: task.duration / (task.dependency ? 2 : 1)
    })).sort((a, b) => b.aiScore - a.aiScore);

    aiSuggestionsDiv.innerHTML = sortedTasks.map(task => `
        <div class="ai-task">
            <strong>${task.name}</strong> - Priority Score: ${task.aiScore.toFixed(2)}
            <br><i>Suggested Start: ${task.startDate.toDateString()}, End: ${task.endDate.toDateString()}</i>
            <br><i>Recommended Team: ${task.teamAssigned} (${task.teamSize} members)</i>
        </div>
    `).join("\n");
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

        Based on this information, provide a VERY CONCISE analysis (maximum 300 words total) with:
        1. Critical path identification (just list the tasks in order)
        2. Top 3 optimization recommendations using PMI/PRINCE2 terminology
        3. Top 2 potential risks and brief mitigation strategies

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

        Based on this information, provide a VERY CONCISE analysis (maximum 250 words total) with:
        1. Key milestones (maximum 3)
        2. Parallel tasks that can be executed simultaneously (just list them)
        3. One sentence about resource leveling

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

// Generate optimizations using Gemini AI
async function generateGeminiOptimizations() {
    if (!geminiInitialized) {
        alert("Please initialize Gemini AI first");
        return;
    }

    if (tasks.length === 0) {
        alert("Please add tasks first!");
        return;
    }

    const aiSuggestionsDiv = document.getElementById("aiSuggestions");
    aiSuggestionsDiv.innerHTML = "<p>Generating Gemini AI optimizations with PMI/PRINCE2 best practices...</p>";

    try {
        const projectName = document.getElementById("projectName").value.trim() || "Unnamed Project";
        const result = await generateTaskOptimizations(tasks, projectName);

        if (result.success) {
            // Format the response with better styling
            const formattedSuggestions = result.suggestions
                .replace(/\*\*/g, '') // Remove any markdown bold
                .replace(/\n\n/g, '\n') // Remove extra line breaks
                .replace(/\n- /g, '\n• ') // Replace hyphens with bullet points
                .replace(/\n\d+\. /g, '\n• '); // Replace numbered lists with bullet points

            aiSuggestionsDiv.innerHTML = `
                <div class="gemini-optimization">
                    <h3>Gemini AI Optimization Suggestions</h3>
                    <div class="gemini-content">${formattedSuggestions}</div>
                </div>
            `;
        } else {
            aiSuggestionsDiv.innerHTML = `<p>Error: ${result.message}</p>`;
        }
    } catch (error) {
        console.error("Error generating Gemini optimizations:", error);
        aiSuggestionsDiv.innerHTML = "<p>An error occurred while generating Gemini AI optimizations.</p>";
    }
}

// Generate Gantt chart suggestions using Gemini AI
async function generateGeminiGanttChart() {
    if (!geminiInitialized) {
        alert("Please initialize Gemini AI first");
        return;
    }

    if (tasks.length === 0) {
        alert("Please add tasks first!");
        return;
    }

    const aiSuggestionsDiv = document.getElementById("aiSuggestions");
    aiSuggestionsDiv.innerHTML = "<p>Generating Gemini AI Gantt chart suggestions...</p>";

    try {
        const projectName = document.getElementById("projectName").value.trim() || "Unnamed Project";
        const result = await generateGanttChartSuggestions(tasks, projectName);

        if (result.success) {
            // Format the response with better styling
            const formattedSuggestions = result.suggestions
                .replace(/\*\*/g, '') // Remove any markdown bold
                .replace(/\n\n/g, '\n') // Remove extra line breaks
                .replace(/\n- /g, '\n• ') // Replace hyphens with bullet points
                .replace(/\n\d+\. /g, '\n• '); // Replace numbered lists with bullet points

            aiSuggestionsDiv.innerHTML = `
                <div class="gemini-optimization">
                    <h3>Gemini AI Gantt Chart Analysis</h3>
                    <div class="gemini-content">${formattedSuggestions}</div>
                </div>
            `;
        } else {
            aiSuggestionsDiv.innerHTML = `<p>Error: ${result.message}</p>`;
        }
    } catch (error) {
        console.error("Error generating Gemini Gantt chart suggestions:", error);
        aiSuggestionsDiv.innerHTML = "<p>An error occurred while generating Gemini AI Gantt chart suggestions.</p>";
    }
}
