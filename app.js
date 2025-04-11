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
    const humanCount = parseInt(document.getElementById("humanCount").value) || 0;
    const botCount = parseInt(document.getElementById("botCount").value) || 0;

    if (!name || isNaN(duration) || duration <= 0 || !startDate || !endDate) {
        alert("Please enter valid Task Name, Duration, Start Date, and End Date!");
        return;
    }

    if (tasks.some(task => task.name === name)) {
        alert("Task name must be unique!");
        return;
    }

    if (humanCount <= 0 && botCount <= 0) {
        alert("Please assign at least one human or bot to the task!");
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
        humanCount,
        botCount,
        color: getRandomColor(), // Add a random color for the Gantt chart
        resourceAllocation: null // Will be filled by AI resource scheduler
    });

    displayTasks();
}

// Generate a random color for Gantt chart bars
function getRandomColor() {
    const colors = [
        '#4285F4', // Google Blue
        '#EA4335', // Google Red
        '#FBBC05', // Google Yellow
        '#34A853', // Google Green
        '#5E35B1', // Deep Purple
        '#00ACC1', // Cyan
        '#F57C00', // Orange
        '#C2185B', // Pink
        '#7CB342', // Light Green
        '#546E7A'  // Blue Grey
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Display tasks in the task list
function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = tasks.map(task => {
        // Create resource allocation display
        let resourceHTML = '';
        if (task.humanCount > 0 || task.botCount > 0) {
            resourceHTML = `<div class="task-resources">`;

            if (task.humanCount > 0) {
                resourceHTML += `
                <div class="human-indicator">
                    <span class="human-icon"></span>
                    <span>${task.humanCount} Human${task.humanCount > 1 ? 's' : ''}</span>
                </div>`;
            }

            if (task.botCount > 0) {
                resourceHTML += `
                <div class="bot-indicator">
                    <span class="bot-icon"></span>
                    <span>${task.botCount} Bot${task.botCount > 1 ? 's' : ''}</span>
                </div>`;
            }

            resourceHTML += `</div>`;
        }

        // Add resource allocation if available
        let allocationHTML = '';
        if (task.resourceAllocation) {
            allocationHTML = `<div class="resource-allocation">
                <strong>AI Allocation:</strong> ${task.resourceAllocation}
            </div>`;
        }

        return `
        <li style="border-left-color: ${task.color || '#A7C7E7'}">
            <strong>${task.name}</strong> - ${task.duration} days
            ${task.dependency ? `(Depends on: ${task.dependency})` : ""}
            <br><i>Team: ${task.teamAssigned}</i>
            <br><i>Start: ${task.startDate.toDateString()}, End: ${task.endDate.toDateString()}</i>
            ${resourceHTML}
            ${allocationHTML}
        </li>`;
    }).join("\n");
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

        // After calculating the schedule, allocate resources
        allocateResources(sortedTasks);

        displayGanttChart(sortedTasks);
        displayTasks(); // Update the task list to show allocations
    } catch (error) {
        console.error("Error generating schedule:", error);
        alert("Error generating schedule. Please check the console for details.");
    }
}

// Generate resource allocation without changing schedule
function generateResourceAllocation() {
    if (tasks.length === 0) {
        alert("Please add tasks first!");
        return;
    }

    try {
        // Use existing tasks without re-sorting or re-scheduling
        allocateResources(tasks);
        displayGanttChart(tasks);
        displayTasks();

        // Show a message in the AI suggestions area
        const aiSuggestionsDiv = document.getElementById("aiSuggestions");
        aiSuggestionsDiv.innerHTML = `
            <div class="gemini-optimization">
                <h3>AI Resource Allocation</h3>
                <div class="gemini-content">
                    <ul>
                        <li>Analyzed ${tasks.length} tasks and optimized human/bot allocation</li>
                        <li>Allocated resources based on team type and task requirements</li>
                        <li>Development tasks: 40% human, 60% bot allocation</li>
                        <li>Design tasks: 70% human, 30% bot allocation</li>
                        <li>Testing tasks: 30% human, 70% bot allocation</li>
                        <li>Marketing tasks: 80% human, 20% bot allocation</li>
                        <li>Other tasks: 50% human, 50% bot allocation</li>
                    </ul>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error generating resource allocation:", error);
        alert("Error generating resource allocation. Please check the console for details.");
    }
}

// AI Resource Allocation
function allocateResources(sortedTasks) {
    // This function will allocate humans and bots to tasks based on various factors
    console.log("Allocating resources for tasks...");

    // For each task, determine the optimal allocation of humans vs bots
    sortedTasks.forEach(task => {
        if (task.humanCount <= 0 && task.botCount <= 0) {
            // Skip tasks with no resources
            return;
        }

        // Calculate the total work units required for this task
        // Assume 8 work hours per day per resource
        const totalWorkHours = task.duration * 8;

        // Determine allocation based on task characteristics
        let allocation = "";

        if (task.humanCount > 0 && task.botCount > 0) {
            // We have both humans and bots

            // Determine the optimal split based on task type and team
            let humanPercentage = 50; // Default to 50/50 split

            // Adjust based on team type
            if (task.teamAssigned === "Development") {
                // Development tasks can be more automated
                humanPercentage = 40;
            } else if (task.teamAssigned === "Design") {
                // Design tasks need more human input
                humanPercentage = 70;
            } else if (task.teamAssigned === "Testing") {
                // Testing can be heavily automated
                humanPercentage = 30;
            } else if (task.teamAssigned === "Marketing") {
                // Marketing needs more human creativity
                humanPercentage = 80;
            }

            // Calculate hours for each resource type
            const humanHours = Math.round((totalWorkHours * humanPercentage) / 100);
            const botHours = totalWorkHours - humanHours;

            // Calculate how many hours per human and bot
            const hoursPerHuman = Math.round(humanHours / task.humanCount);
            const hoursPerBot = Math.round(botHours / task.botCount);

            allocation = `${humanPercentage}% human (${hoursPerHuman}h each), ${100-humanPercentage}% bot (${hoursPerBot}h each)`;
        } else if (task.humanCount > 0) {
            // Only humans available
            const hoursPerHuman = Math.round(totalWorkHours / task.humanCount);
            allocation = `100% human (${hoursPerHuman}h each)`;
        } else if (task.botCount > 0) {
            // Only bots available
            const hoursPerBot = Math.round(totalWorkHours / task.botCount);
            allocation = `100% bot (${hoursPerBot}h each)`;
        }

        // Set the allocation
        task.resourceAllocation = allocation;
    });
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
    if (tasks.length === 0) return;

    const ganttChart = document.getElementById("ganttChart");
    ganttChart.innerHTML = '';

    // Find the earliest start date and latest end date
    const earliestDate = new Date(Math.min(...tasks.map(task => task.startDate.getTime())));
    const latestDate = new Date(Math.max(...tasks.map(task => task.endDate.getTime())));

    // Calculate the total project duration in days
    const totalDays = Math.ceil((latestDate - earliestDate) / (1000 * 60 * 60 * 24)) + 1;

    // Create the Gantt chart header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'gantt-header';

    // Add task name column
    const taskNameHeader = document.createElement('div');
    taskNameHeader.className = 'gantt-task-name';
    taskNameHeader.textContent = 'Task';
    headerDiv.appendChild(taskNameHeader);

    // Add timeline
    const timelineHeader = document.createElement('div');
    timelineHeader.className = 'gantt-timeline';

    // Create date markers
    const dateMarkers = document.createElement('div');
    dateMarkers.className = 'gantt-date-markers';

    // Add date labels (every 7 days or less for shorter projects)
    const interval = totalDays > 30 ? 7 : (totalDays > 14 ? 3 : 1);
    for (let i = 0; i <= totalDays; i += interval) {
        const date = new Date(earliestDate);
        date.setDate(date.getDate() + i);

        const marker = document.createElement('div');
        marker.className = 'gantt-date-marker';
        marker.textContent = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        marker.style.left = `${(i / totalDays) * 100}%`;
        dateMarkers.appendChild(marker);
    }

    timelineHeader.appendChild(dateMarkers);
    headerDiv.appendChild(timelineHeader);
    ganttChart.appendChild(headerDiv);

    // Create the Gantt chart body
    tasks.forEach(task => {
        const taskRow = document.createElement('div');
        taskRow.className = 'gantt-row';

        // Add task name and resources
        const taskName = document.createElement('div');
        taskName.className = 'gantt-task-name';

        // Create resource indicators
        let resourceHTML = '';
        if (task.humanCount > 0 || task.botCount > 0) {
            resourceHTML = `<div class="gantt-resources">`;

            if (task.humanCount > 0) {
                resourceHTML += `
                <div class="human-indicator">
                    <span class="human-icon"></span>
                    <span>${task.humanCount}</span>
                </div>`;
            }

            if (task.botCount > 0) {
                resourceHTML += `
                <div class="bot-indicator">
                    <span class="bot-icon"></span>
                    <span>${task.botCount}</span>
                </div>`;
            }

            resourceHTML += `</div>`;
        }

        taskName.innerHTML = `
            <div>${task.name}</div>
            <div class="gantt-team">${task.teamAssigned}</div>
            ${resourceHTML}
            ${task.resourceAllocation ? `<div class="gantt-allocation">${task.resourceAllocation}</div>` : ''}
        `;
        taskRow.appendChild(taskName);

        // Add task timeline
        const taskTimeline = document.createElement('div');
        taskTimeline.className = 'gantt-timeline';

        // Calculate position and width of task bar
        const taskStart = task.startDate.getTime();
        const taskEnd = task.endDate.getTime();
        const projectStart = earliestDate.getTime();
        const projectDuration = latestDate.getTime() - projectStart;

        const leftPosition = ((taskStart - projectStart) / projectDuration) * 100;
        const width = ((taskEnd - taskStart) / projectDuration) * 100;

        // Create task bar
        const taskBar = document.createElement('div');
        taskBar.className = 'gantt-task-bar';
        taskBar.style.left = `${leftPosition}%`;
        taskBar.style.width = `${width}%`;
        taskBar.style.backgroundColor = task.color || '#4285F4';

        // Add tooltip with task details
        taskBar.title = `${task.name}\nDuration: ${task.duration} days\nStart: ${task.startDate.toDateString()}\nEnd: ${task.endDate.toDateString()}`;

        // Add dependency arrow if applicable
        if (task.dependency) {
            taskBar.classList.add('has-dependency');
        }

        taskTimeline.appendChild(taskBar);
        taskRow.appendChild(taskTimeline);
        ganttChart.appendChild(taskRow);
    });

    // Add legend
    const legendDiv = document.createElement('div');
    legendDiv.className = 'gantt-legend';
    legendDiv.innerHTML = '<div class="legend-title">Teams:</div>';

    // Get unique teams
    const teams = [...new Set(tasks.map(task => task.teamAssigned))].filter(team => team);

    teams.forEach(team => {
        const teamColor = tasks.find(task => task.teamAssigned === team)?.color || getRandomColor();
        const teamItem = document.createElement('div');
        teamItem.className = 'legend-item';
        teamItem.innerHTML = `<span class="legend-color" style="background-color: ${teamColor}"></span>${team}`;
        legendDiv.appendChild(teamItem);
    });

    ganttChart.appendChild(legendDiv);
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
            // Format the response with better styling and ensure point-by-point format
            let formattedSuggestions = result.suggestions
                .replace(/\*\*/g, '') // Remove any markdown bold
                .replace(/\n\n/g, '\n') // Remove extra line breaks
                .replace(/\n- /g, '\n• ') // Replace hyphens with bullet points
                .replace(/\n\d+\. /g, '\n• '); // Replace numbered lists with bullet points

            // Split by sections if they exist
            const sections = formattedSuggestions.split(/\n(?=[A-Z][^\n:]+:)/g);

            let formattedHTML = '';

            if (sections.length > 1) {
                // Multiple sections detected
                formattedHTML = sections.map(section => {
                    const titleMatch = section.match(/^([A-Z][^\n:]+):/i);
                    if (titleMatch) {
                        const title = titleMatch[1];
                        const content = section.replace(/^[A-Z][^\n:]+:/i, '').trim();
                        return `<div class="gemini-section">
                            <h4>${title}</h4>
                            <ul>${content.split('\n').map(point =>
                                point.trim() ? `<li>${point.replace(/^•\s*/, '')}</li>` : ''
                            ).join('')}</ul>
                        </div>`;
                    }
                    return `<div class="gemini-section">
                        <ul>${section.split('\n').map(point =>
                            point.trim() ? `<li>${point.replace(/^•\s*/, '')}</li>` : ''
                        ).join('')}</ul>
                    </div>`;
                }).join('');
            } else {
                // No clear sections, format as a single list
                formattedHTML = `<ul>${formattedSuggestions.split('\n').map(point =>
                    point.trim() ? `<li>${point.replace(/^•\s*/, '')}</li>` : ''
                ).join('')}</ul>`;
            }

            aiSuggestionsDiv.innerHTML = `
                <div class="gemini-optimization">
                    <h3>Gemini AI Optimization Suggestions</h3>
                    <div class="gemini-content">${formattedHTML}</div>
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
            // Format the response with better styling and ensure point-by-point format
            let formattedSuggestions = result.suggestions
                .replace(/\*\*/g, '') // Remove any markdown bold
                .replace(/\n\n/g, '\n') // Remove extra line breaks
                .replace(/\n- /g, '\n• ') // Replace hyphens with bullet points
                .replace(/\n\d+\. /g, '\n• '); // Replace numbered lists with bullet points

            // Split by sections if they exist
            const sections = formattedSuggestions.split(/\n(?=[A-Z][^\n:]+:)/g);

            let formattedHTML = '';

            if (sections.length > 1) {
                // Multiple sections detected
                formattedHTML = sections.map(section => {
                    const titleMatch = section.match(/^([A-Z][^\n:]+):/i);
                    if (titleMatch) {
                        const title = titleMatch[1];
                        const content = section.replace(/^[A-Z][^\n:]+:/i, '').trim();
                        return `<div class="gemini-section">
                            <h4>${title}</h4>
                            <ul>${content.split('\n').map(point =>
                                point.trim() ? `<li>${point.replace(/^•\s*/, '')}</li>` : ''
                            ).join('')}</ul>
                        </div>`;
                    }
                    return `<div class="gemini-section">
                        <ul>${section.split('\n').map(point =>
                            point.trim() ? `<li>${point.replace(/^•\s*/, '')}</li>` : ''
                        ).join('')}</ul>
                    </div>`;
                }).join('');
            } else {
                // No clear sections, format as a single list
                formattedHTML = `<ul>${formattedSuggestions.split('\n').map(point =>
                    point.trim() ? `<li>${point.replace(/^•\s*/, '')}</li>` : ''
                ).join('')}</ul>`;
            }

            aiSuggestionsDiv.innerHTML = `
                <div class="gemini-optimization">
                    <h3>Gemini AI Gantt Chart Analysis</h3>
                    <div class="gemini-content">${formattedHTML}</div>
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
