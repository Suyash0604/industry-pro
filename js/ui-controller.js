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
    function displayTasks(filteredTasks = null) {
        const tasks = filteredTasks || TaskManager.getTasks();
        const taskList = document.getElementById("taskList");

        if (tasks.length === 0) {
            taskList.innerHTML = '<div class="empty-state">No tasks found. Add a task to get started.</div>';
            return;
        }

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

            // Create task description HTML
            let descriptionHTML = '';
            if (task.description) {
                descriptionHTML = `<div class="task-description">${task.description}</div>`;
            }

            // Create task category HTML
            let categoryHTML = '';
            if (task.category) {
                categoryHTML = `<div class="task-category">${task.category}</div>`;
            }

            // Create task completion slider
            const completionHTML = `
            <div class="task-completion" data-task-id="${task.id}">
                <input type="range" class="completion-range" min="0" max="100" value="${task.completion || 0}"
                    oninput="UIController.updateTaskCompletion(${task.id}, this.value)">
                <div class="completion-slider">
                    <div class="completion-fill" style="width: ${task.completion || 0}%"></div>
                </div>
                <div class="completion-percentage">${task.completion || 0}%</div>
            </div>`;

            // Create task actions
            const actionsHTML = `
            <div class="task-actions">
                <button class="task-action-btn secondary-btn" onclick="UIController.editTask(${task.id})">Edit</button>
                <button class="task-action-btn danger-btn" onclick="UIController.deleteTask(${task.id})">Delete</button>
            </div>`;

            return `
            <li style="border-left-color: ${task.color || '#A7C7E7'}">
                <div class="task-header">
                    <h3 class="task-title">${task.name}</h3>
                    <span class="task-priority priority-${task.priority.toLowerCase()}">${task.priority}</span>
                </div>
                ${descriptionHTML}
                <div class="task-details">
                    <span class="task-detail"><i>⏱️</i> ${task.duration} days</span>
                    <span class="task-detail"><i>🗓️</i> ${task.startDate.toDateString()} - ${task.endDate.toDateString()}</span>
                    <span class="task-detail"><i>👥</i> ${task.teamAssigned}</span>
                    ${task.dependency ? `<span class="task-detail"><i>🔄</i> Depends on: ${task.dependency}</span>` : ""}
                    ${task.cost ? `<span class="task-detail"><i>💰</i> ₹ ${task.cost}</span>` : ""}
                </div>
                ${categoryHTML}
                ${resourceHTML}
                ${allocationHTML}
                ${completionHTML}
                ${actionsHTML}
            </li>`;
        }).join("\n");

        // Add event listeners for completion sliders
        document.querySelectorAll('.completion-range').forEach(slider => {
            slider.addEventListener('change', function() {
                const taskId = parseInt(this.closest('.task-completion').dataset.taskId);
                UIController.updateTaskCompletion(taskId, this.value);
            });
        });
    }

    // Public API
    return {
        // Initialize event listeners
        initEventListeners: function() {
            // Add task button
            document.querySelector('button[onclick="addTask()"]').addEventListener('click', function() {
                const taskData = {
                    name: document.getElementById("taskName").value.trim(),
                    description: document.getElementById("taskDescription").value.trim(),
                    duration: parseInt(document.getElementById("duration").value),
                    startDate: document.getElementById("startDate").value,
                    endDate: document.getElementById("endDate").value,
                    dependencyName: document.getElementById("dependency").value.trim(),
                    teamAssigned: document.getElementById("teamAssigned").value,
                    priority: document.getElementById("taskPriority").value,
                    category: document.getElementById("taskCategory").value.trim(),
                    cost: parseFloat(document.getElementById("taskCost").value) || 0,
                    humanCount: parseInt(document.getElementById("humanCount").value) || 0,
                    botCount: parseInt(document.getElementById("botCount").value) || 0
                };

                if (TaskManager.addTask(taskData)) {
                    // Clear form fields
                    document.getElementById("taskName").value = "";
                    document.getElementById("taskDescription").value = "";
                    document.getElementById("duration").value = "1";
                    document.getElementById("dependency").value = "";
                    document.getElementById("taskCategory").value = "";
                    document.getElementById("taskCost").value = "";

                    // Update task list
                    displayTasks();
                }
            });

            // Filter tasks
            document.getElementById('filterPriority').addEventListener('change', function() {
                applyFilters();
            });

            document.getElementById('filterTeam').addEventListener('change', function() {
                applyFilters();
            });

            // Clear filters
            document.getElementById('clearFiltersBtn').addEventListener('click', function() {
                document.getElementById('filterPriority').value = '';
                document.getElementById('filterTeam').value = '';
                displayTasks();
            });

            // Save project
            document.getElementById('saveProjectBtn').addEventListener('click', function() {
                saveProject();
            });

            // Load project
            document.getElementById('loadProjectBtn').addEventListener('click', function() {
                loadProject();
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
        displayTasks: displayTasks,

        // Update task completion
        updateTaskCompletion: function(taskId, percentage) {
            const numPercentage = parseInt(percentage);
            if (TaskManager.updateTaskCompletion(taskId, numPercentage)) {
                // Update the UI for this specific task without redrawing the entire list
                const taskElement = document.querySelector(`.task-completion[data-task-id="${taskId}"]`);
                if (taskElement) {
                    taskElement.querySelector('.completion-fill').style.width = numPercentage + '%';
                    taskElement.querySelector('.completion-percentage').textContent = numPercentage + '%';
                    taskElement.querySelector('.completion-range').value = numPercentage;
                }
            }
        },

        // Edit task
        editTask: function(taskId) {
            const tasks = TaskManager.getTasks();
            const task = tasks.find(t => t.id === taskId);

            if (!task) return;

            // Populate form with task data
            document.getElementById("taskName").value = task.name;
            document.getElementById("taskDescription").value = task.description || '';
            document.getElementById("duration").value = task.duration;
            document.getElementById("startDate").value = DateCalculator.formatDateForInput(task.startDate);
            document.getElementById("endDate").value = DateCalculator.formatDateForInput(task.endDate);
            document.getElementById("dependency").value = task.dependency || '';
            document.getElementById("teamAssigned").value = task.teamAssigned || '';
            document.getElementById("taskPriority").value = task.priority || 'Medium';
            document.getElementById("taskCategory").value = task.category || '';
            document.getElementById("taskCost").value = task.cost || '';
            document.getElementById("humanCount").value = task.humanCount || 0;
            document.getElementById("botCount").value = task.botCount || 0;

            // Update end date based on duration and start date
            DateCalculator.updateTaskEndDate();

            // Scroll to form
            document.querySelector('.task-form').scrollIntoView({ behavior: 'smooth' });
        },

        // Delete task
        deleteTask: function(taskId) {
            if (confirm('Are you sure you want to delete this task?')) {
                const tasks = TaskManager.getTasks();
                const taskIndex = tasks.findIndex(t => t.id === taskId);

                if (taskIndex !== -1) {
                    tasks.splice(taskIndex, 1);
                    TaskManager.updateProjectStats();
                    displayTasks();
                }
            }
        }
    };

    // Helper functions for the UIController
    function applyFilters() {
        const priorityFilter = document.getElementById('filterPriority').value;
        const teamFilter = document.getElementById('filterTeam').value;

        const filteredTasks = TaskManager.filterTasks({
            priority: priorityFilter,
            team: teamFilter
        });

        displayTasks(filteredTasks);
    }

    function saveProject() {
        const projectName = document.getElementById('projectName').value.trim() || 'MyProject';
        const projectData = {
            name: projectName,
            organization: document.getElementById('organizationName').value.trim(),
            description: document.getElementById('projectDescription').value.trim(),
            budget: parseFloat(document.getElementById('projectBudget').value) || 0,
            tasks: TaskManager.getTasks()
        };

        try {
            const projectJson = JSON.stringify(projectData);
            localStorage.setItem('aiProjectScheduler_' + projectName, projectJson);
            alert(`Project "${projectName}" saved successfully!`);
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project. Please try again.');
        }
    }

    function loadProject() {
        const projectName = document.getElementById('projectName').value.trim();

        if (!projectName) {
            alert('Please enter a project name to load.');
            return;
        }

        try {
            const projectJson = localStorage.getItem('aiProjectScheduler_' + projectName);

            if (!projectJson) {
                alert(`Project "${projectName}" not found.`);
                return;
            }

            const projectData = JSON.parse(projectJson);

            // Load project details
            document.getElementById('projectName').value = projectData.name || '';
            document.getElementById('organizationName').value = projectData.organization || '';
            document.getElementById('projectDescription').value = projectData.description || '';
            document.getElementById('projectBudget').value = projectData.budget || '';

            // Load tasks
            window.tasks = projectData.tasks.map(task => {
                // Convert string dates back to Date objects
                task.startDate = new Date(task.startDate);
                task.endDate = new Date(task.endDate);
                return task;
            });

            TaskManager.updateProjectStats();
            displayTasks();

            alert(`Project "${projectName}" loaded successfully!`);
        } catch (error) {
            console.error('Error loading project:', error);
            alert('Failed to load project. Please try again.');
        }
    }
})();
