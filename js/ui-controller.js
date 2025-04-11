/**
 * ui-controller.js - Handles UI updates and event handlers
 * Manages user interactions and display updates
 */

const UIController = (function() {
    // Private methods
    
    // Format Gemini suggestions for display
    function formatGeminiSuggestions(suggestions) {
        // Format the response with better styling and ensure point-by-point format
        let formattedSuggestions = suggestions
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
        
        return formattedHTML;
    }
    
    // Display tasks in the task list
    function displayTasks() {
        const tasks = TaskManager.getTasks();
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
    
    // Public API
    return {
        // Initialize event listeners
        initEventListeners: function() {
            // Add task button
            document.querySelector('button[onclick="addTask()"]').addEventListener('click', function() {
                const taskData = {
                    name: document.getElementById("taskName").value.trim(),
                    duration: parseInt(document.getElementById("duration").value),
                    startDate: document.getElementById("startDate").value,
                    endDate: document.getElementById("endDate").value,
                    dependencyName: document.getElementById("dependency").value.trim(),
                    teamAssigned: document.getElementById("teamAssigned").value,
                    humanCount: parseInt(document.getElementById("humanCount").value) || 0,
                    botCount: parseInt(document.getElementById("botCount").value) || 0
                };
                
                if (TaskManager.addTask(taskData)) {
                    displayTasks();
                }
            });
            
            // Initialize Gemini button
            document.querySelector('button[onclick="initializeGemini()"]').addEventListener('click', function() {
                const apiKeyInput = document.getElementById("geminiApiKey");
                const apiKey = apiKeyInput.value.trim();
                
                if (!apiKey) {
                    alert("Please enter a valid Gemini API key");
                    return;
                }
                
                // Initialize the Gemini API
                const success = AIService.initGeminiAPI(apiKey);
                
                if (success) {
                    document.getElementById("geminiStatus").textContent = "Gemini AI: Initializing...";
                    apiKeyInput.value = "";
                } else {
                    document.getElementById("geminiStatus").textContent = "Gemini AI: Initialization failed";
                    document.getElementById("geminiStatus").classList.remove("initialized");
                    alert("Failed to initialize Gemini AI. Please check your API key and try again.");
                }
            });
            
            // Generate AI Schedule button
            document.querySelector('button[onclick="generateAISchedule()"]').addEventListener('click', function() {
                const scheduledTasks = TaskManager.generateSchedule();
                if (scheduledTasks) {
                    displayTasks();
                    GanttChart.displayGanttChart(scheduledTasks);
                }
            });
            
            // Generate Resource Allocation button
            document.querySelector('button[onclick="generateResourceAllocation()"]').addEventListener('click', function() {
                const tasks = TaskManager.generateResourceAllocation();
                if (tasks) {
                    displayTasks();
                    GanttChart.displayGanttChart(tasks);
                    
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
                }
            });
            
            // Generate AI Suggestions button
            document.querySelector('button[onclick="generateAISuggestions()"]').addEventListener('click', async function() {
                const tasks = TaskManager.getTasks();
                if (tasks.length === 0) {
                    alert("No tasks available for AI recommendations!");
                    return;
                }
                
                const aiSuggestionsDiv = document.getElementById("aiSuggestions");
                aiSuggestionsDiv.innerHTML = "<p>Generating AI suggestions...</p>";
                
                // If Gemini is initialized, use it for more intelligent suggestions
                if (AIService.isGeminiInitialized()) {
                    try {
                        const priorityScores = await AIService.generateTaskPriorities(tasks);
                        
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
                                    <br><i>Recommended Team: ${task.teamAssigned}</i>
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
                        <br><i>Recommended Team: ${task.teamAssigned}</i>
                    </div>
                `).join("\n");
            });
            
            // Generate Gemini Optimizations button
            document.querySelector('button[onclick="generateGeminiOptimizations()"]').addEventListener('click', async function() {
                if (!AIService.isGeminiInitialized()) {
                    alert("Please initialize Gemini AI first");
                    return;
                }
                
                const tasks = TaskManager.getTasks();
                if (tasks.length === 0) {
                    alert("Please add tasks first!");
                    return;
                }
                
                const aiSuggestionsDiv = document.getElementById("aiSuggestions");
                aiSuggestionsDiv.innerHTML = "<p>Generating Gemini AI optimizations with PMI/PRINCE2 best practices...</p>";
                
                try {
                    const projectName = document.getElementById("projectName").value.trim() || "Unnamed Project";
                    const result = await AIService.generateTaskOptimizations(tasks, projectName);
                    
                    if (result.success) {
                        const formattedHTML = formatGeminiSuggestions(result.suggestions);
                        
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
            });
            
            // Generate Gemini Gantt Chart button
            document.querySelector('button[onclick="generateGeminiGanttChart()"]').addEventListener('click', async function() {
                if (!AIService.isGeminiInitialized()) {
                    alert("Please initialize Gemini AI first");
                    return;
                }
                
                const tasks = TaskManager.getTasks();
                if (tasks.length === 0) {
                    alert("Please add tasks first!");
                    return;
                }
                
                const aiSuggestionsDiv = document.getElementById("aiSuggestions");
                aiSuggestionsDiv.innerHTML = "<p>Generating Gemini AI Gantt chart suggestions...</p>";
                
                try {
                    const projectName = document.getElementById("projectName").value.trim() || "Unnamed Project";
                    const result = await AIService.generateGanttChartSuggestions(tasks, projectName);
                    
                    if (result.success) {
                        const formattedHTML = formatGeminiSuggestions(result.suggestions);
                        
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
            });
        },
        
        // Update Gemini status in the UI
        updateGeminiStatus: function(isInitialized) {
            const statusElement = document.getElementById("geminiStatus");
            const optimizeButton = document.getElementById("geminiOptimizeBtn");
            const ganttButton = document.getElementById("geminiGanttBtn");
            
            if (isInitialized) {
                statusElement.textContent = "Gemini AI: Initialized";
                statusElement.classList.add("initialized");
                optimizeButton.disabled = false;
                ganttButton.disabled = false;
            } else {
                statusElement.textContent = "Gemini AI: Not initialized";
                statusElement.classList.remove("initialized");
                optimizeButton.disabled = true;
                ganttButton.disabled = true;
            }
        },
        
        // Display tasks in the task list
        displayTasks: displayTasks
    };
})();
