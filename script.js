let tasks = [];
let nextId = 1;

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

async function generateAISuggestions() {
    if (tasks.length === 0) {
        alert("No tasks available for AI recommendations!");
        return;
    }

    const aiSuggestionsDiv = document.getElementById("aiSuggestions");
    aiSuggestionsDiv.innerHTML = "<p>Generating AI suggestions...</p>";

    const sortedTasks = tasks.map((task, index) => ({
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
