let tasks = [];
let nextId = 1;
let geminiInitialized = false;

// Auto-initialize Gemini when the page loads
window.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, preparing to initialize Gemini...");

    // Try to initialize Gemini with the default API key
    setTimeout(() => {
        console.log("Attempting to initialize Gemini API...");
        try {
            if (!window.GeminiService) {
                console.error("GeminiService not found. Check if gemini-service.js is loaded correctly.");
                return;
            }

            const success = window.GeminiService.initGeminiAPI();
            if (success) {
                // Note: The actual initialization happens asynchronously in the service
                // The UI will be updated by the service when initialization completes
                geminiInitialized = true;
                console.log("Gemini API initialization started...");
            } else {
                console.error("Failed to initialize Gemini API");
            }
        } catch (error) {
            console.error("Error during Gemini initialization:", error);
        }
    }, 1500); // Increased delay to ensure all scripts are loaded
});

window.addTask = function() {
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

window.generateAISchedule = function() {
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

function displayGanttChart(tasks) {
    const ganttChart = document.getElementById("ganttChart");
    ganttChart.innerHTML = tasks.map(task => `
        <div class="gantt-task">
            <div><strong>${task.name}</strong> - <i>Team: ${task.teamAssigned}</i></div>
            <div>${task.startDate.toDateString()} - ${task.endDate.toDateString()}</div>
            <div>Duration: ${task.duration} days</div>
        </div>`).join("\n");
}

window.generateAISuggestions = async function() {
    if (tasks.length === 0) {
        alert("No tasks available for AI recommendations!");
        return;
    }

    const aiSuggestionsDiv = document.getElementById("aiSuggestions");
    aiSuggestionsDiv.innerHTML = "<p>Generating AI suggestions...</p>";

    // If Gemini is initialized, use it for more intelligent suggestions
    if (geminiInitialized) {
        try {
            const priorityScores = await window.GeminiService.generateTaskPriorities(tasks);

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

// Initialize Gemini API with the provided API key
// Make sure it's in the global scope
window.initializeGemini = function() {
    console.log("initializeGemini function called");
    const apiKeyInput = document.getElementById("geminiApiKey");
    const apiKey = apiKeyInput.value.trim();
    const statusElement = document.getElementById("geminiStatus");
    const optimizeButton = document.getElementById("geminiOptimizeBtn");
    const ganttButton = document.getElementById("geminiGanttBtn");

    if (!apiKey) {
        alert("Please enter a valid Gemini API key");
        return;
    }

    // Initialize the Gemini API
    const success = window.GeminiService.initGeminiAPI(apiKey);

    if (success) {
        geminiInitialized = true;
        statusElement.textContent = "Gemini AI: Initializing...";
        // The actual status update will happen in the service
        apiKeyInput.value = "";
        // Note: The buttons will be enabled by the service when initialization completes
    } else {
        statusElement.textContent = "Gemini AI: Initialization failed";
        statusElement.classList.remove("initialized");
        optimizeButton.disabled = true;
        ganttButton.disabled = true;
        alert("Failed to initialize Gemini AI. Please check your API key and try again.");
    }
}

// Generate optimizations using Gemini AI
window.generateGeminiOptimizations = async function() {
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
        const result = await window.GeminiService.generateTaskOptimizations(tasks, projectName);

        if (result.success) {
            aiSuggestionsDiv.innerHTML = `
                <div class="gemini-optimization">
                    <h3>Gemini AI Optimization Suggestions (PMI/PRINCE2)</h3>
                    ${result.suggestions}
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
window.generateGeminiGanttChart = async function() {
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
        const result = await window.GeminiService.generateGanttChartSuggestions(tasks, projectName);

        if (result.success) {
            aiSuggestionsDiv.innerHTML = `
                <div class="gemini-optimization">
                    <h3>Gemini AI Gantt Chart Suggestions</h3>
                    ${result.suggestions}
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