/**
 * task-manager.js - Handles task data and operations
 * Manages task creation, dependencies, and scheduling
 */

const TaskManager = (function() {
    // Private variables
    let tasks = [];
    let nextId = 1;

    // Private methods
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

    // Public API
    return {
        // Get all tasks
        getTasks: function() {
            return tasks;
        },

        // Add a new task
        addTask: function(taskData) {
            const {
                name,
                description,
                duration,
                startDate,
                endDate,
                dependencyName,
                teamAssigned,
                priority,
                category,
                cost,
                humanCount,
                botCount
            } = taskData;

            // Validation
            if (!name || isNaN(duration) || duration <= 0 || !startDate || !endDate) {
                alert("Please enter valid Task Name, Duration, Start Date, and End Date!");
                return false;
            }

            if (tasks.some(task => task.name === name)) {
                alert("Task name must be unique!");
                return false;
            }

            if (humanCount <= 0 && botCount <= 0) {
                alert("Please assign at least one human or bot to the task!");
                return false;
            }

            // Check dependency
            let dependency = null;
            if (dependencyName) {
                const dependencyTask = tasks.find(task => task.name === dependencyName);
                if (!dependencyTask) {
                    alert("Dependency task not found!");
                    return false;
                }
                dependency = dependencyName;
            }

            // Calculate end date based on start date and duration
            const calculatedEndDate = DateCalculator.calculateEndDate(new Date(startDate), duration);

            // Create and add the task
            tasks.push({
                id: nextId++,
                name,
                description: description || "",
                duration,
                startDate: new Date(startDate),
                endDate: calculatedEndDate || new Date(endDate), // Use calculated end date or provided end date as fallback
                dependency,
                teamAssigned,
                priority: priority || "Medium",
                category: category || "",
                cost: cost || 0,
                humanCount,
                botCount,
                color: getRandomColor(),
                resourceAllocation: null, // Will be filled by AI resource scheduler
                completion: 0 // Task completion percentage
            });

            // Update project stats
            this.updateProjectStats();

            return true;
        },

        // Update task completion percentage
        updateTaskCompletion: function(taskId, completionPercentage) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completion = Math.min(100, Math.max(0, completionPercentage));
                this.updateProjectStats();
                return true;
            }
            return false;
        },

        // Update project statistics
        updateProjectStats: function() {
            if (tasks.length === 0) {
                document.getElementById('totalTasksCount').textContent = '0';
                document.getElementById('completedTasksCount').textContent = '0';
                document.getElementById('totalCost').textContent = '₹ 0';
                document.getElementById('projectProgress').style.width = '0%';
                document.getElementById('projectProgressPercentage').textContent = '0%';
                return;
            }

            // Calculate project stats
            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.completion === 100).length;
            const totalCompletion = tasks.reduce((sum, task) => sum + task.completion, 0);
            const averageCompletion = Math.round(totalCompletion / totalTasks);
            const totalCost = tasks.reduce((sum, task) => sum + (task.cost || 0), 0);

            // Update UI
            document.getElementById('totalTasksCount').textContent = totalTasks;
            document.getElementById('completedTasksCount').textContent = completedTasks;
            document.getElementById('totalCost').textContent = '₹ ' + totalCost;
            document.getElementById('projectProgress').style.width = averageCompletion + '%';
            document.getElementById('projectProgressPercentage').textContent = averageCompletion + '%';
        },

        // Filter tasks by criteria
        filterTasks: function(criteria) {
            let filteredTasks = [...tasks];

            if (criteria.priority && criteria.priority !== '') {
                filteredTasks = filteredTasks.filter(task => task.priority === criteria.priority);
            }

            if (criteria.team && criteria.team !== '') {
                filteredTasks = filteredTasks.filter(task => task.teamAssigned === criteria.team);
            }

            return filteredTasks;
        },

        // Generate AI schedule
        generateSchedule: function() {
            if (tasks.length === 0) {
                alert("Please add tasks first!");
                return null;
            }

            try {
                const sortedTasks = topologicalSort();
                if (!sortedTasks) return null;

                calculateSchedule(sortedTasks);

                // After calculating the schedule, allocate resources
                allocateResources(sortedTasks);

                return sortedTasks;
            } catch (error) {
                console.error("Error generating schedule:", error);
                alert("Error generating schedule. Please check the console for details.");
                return null;
            }
        },

        // Generate resource allocation without changing schedule
        generateResourceAllocation: function() {
            if (tasks.length === 0) {
                alert("Please add tasks first!");
                return null;
            }

            try {
                // Use existing tasks without re-sorting or re-scheduling
                allocateResources(tasks);
                return tasks;
            } catch (error) {
                console.error("Error generating resource allocation:", error);
                alert("Error generating resource allocation. Please check the console for details.");
                return null;
            }
        }
    };
})();
