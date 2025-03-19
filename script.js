// script.js
let tasks = [];
let nextId = 1;

function addTask() {
    const name = document.getElementById("taskName").value.trim();
    const duration = parseInt(document.getElementById("duration").value);
    const dependencyName = document.getElementById("dependency").value.trim();

    if (!name || isNaN(duration) || duration <= 0) {
        alert("Please enter valid Task Name and Duration (positive number)!");
        return;
    }

    if (tasks.some(task => task.name === name)) {
        alert("Task name must be unique!");
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
        dependency,
        aiDuration: null,
        startDate: null,
        endDate: null
    });

    document.getElementById("taskName").value = "";
    document.getElementById("duration").value = "";
    document.getElementById("dependency").value = "";

    displayTasks();
}

function displayTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${task.name}</strong> - ${task.duration} days 
            ${task.dependency ? `(Depends on: ${task.dependency})` : ""}`;
        taskList.appendChild(li);
    });
}

async function trainModel() {
    const model = tf.sequential();
    model.add(tf.layers.dense({
        inputShape: [3],
        units: 8,
        activation: "relu"
    }));
    model.add(tf.layers.dense({ units: 4, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1 }));

    model.compile({
        optimizer: tf.train.adam(0.1),
        loss: "meanSquaredError"
    });

    // Simulated training data (would be replaced with real historical data)
    const xs = tf.tensor([
        [1, 5, 0],  // Task ID, Original Duration, Has Dependency
        [2, 3, 1],
        [3, 7, 0]
    ]);
    const ys = tf.tensor([
        [6],  // Adjusted Duration
        [5],
        [7]
    ]);

    await model.fit(xs, ys, {
        epochs: 100,
        batchSize: 32,
        validationSplit: 0.2,
        verbose: 0
    });

    return model;
}

async function predictDurations(model) {
    const predictionData = tasks.map(task => [
        task.id,
        task.duration,
        task.dependency ? 1 : 0
    ]);

    const predictions = await model.predict(tf.tensor(predictionData)).data();
    
    tasks.forEach((task, index) => {
        task.aiDuration = Math.round(predictions[index]);
    });
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
    const startDate = new Date();
    const taskMap = new Map();

    sortedTasks.forEach(task => {
        let earliestStart = startDate;
        
        if (task.dependency) {
            const depTask = taskMap.get(task.dependency);
            if (depTask) earliestStart = new Date(depTask.endDate);
        }

        task.startDate = new Date(earliestStart);
        task.endDate = new Date(earliestStart);
        task.endDate.setDate(task.endDate.getDate() + (task.aiDuration || task.duration));
        
        taskMap.set(task.name, task);
    });

    return sortedTasks;
}

async function generateSchedule() {
    if (tasks.length === 0) {
        alert("Please add tasks first!");
        return;
    }

    try {
        const model = await trainModel();
        await predictDurations(model);
        
        const sortedTasks = topologicalSort();
        if (!sortedTasks) return;

        const scheduledTasks = calculateSchedule(sortedTasks);
        displayGanttChart(scheduledTasks);
        showRecommendations(scheduledTasks);
    } catch (error) {
        console.error("Error generating schedule:", error);
        alert("Error generating schedule. Please check console for details.");
    }
}

function displayGanttChart(tasks) {
    const ganttChart = document.getElementById("ganttChart");
    ganttChart.innerHTML = "";

    tasks.forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.className = "gantt-task";
        taskElement.innerHTML = `
            <div>${task.name}</div>
            <div>${task.startDate.toLocaleDateString()} - ${task.endDate.toLocaleDateString()}</div>
            <div>${task.aiDuration ? `AI: ${task.aiDuration}` : task.duration} days</div>
        `;
        ganttChart.appendChild(taskElement);
    });
}

function showRecommendations(tasks) {
    const recommendations = [];
    const aiSuggestions = document.getElementById("aiSuggestions");

    // Check for parallelization opportunities
    const independentTasks = tasks.filter(t => !t.dependency);
    if (independentTasks.length > 1) {
        recommendations.push("PMI Recommendation: Multiple independent tasks detected. Consider parallel execution.");
    }

    // Check for long durations
    tasks.filter(t => t.aiDuration > 10).forEach(task => {
        recommendations.push(`CMMI Suggestion: '${task.name}' has a long duration (${task.aiDuration} days). Consider breaking it into smaller tasks.`);
    });

    // Check for dependency chains
    const dependencyChain = tasks.filter(t => t.dependency).length;
    if (dependencyChain > tasks.length * 0.5) {
        recommendations.push("PRINCE2 Advice: Complex dependency chain detected. Consider creating milestone checkpoints.");
    }

    // Display recommendations
    aiSuggestions.innerHTML = `
        <h3>AI Recommendations</h3>
        ${recommendations.length ? `<ul>${recommendations.map(r => `<li>${r}</li>`).join("")}</ul>` : 
        "<p>No specific recommendations. Project structure looks good!</p>"}
    `;
}