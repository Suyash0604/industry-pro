/**
 * gantt-chart.js - Handles Gantt chart visualization
 * Creates and updates the Gantt chart based on task data
 */

const GanttChart = (function() {
    // Private methods
    
    // Display Gantt chart
    function createGanttChart(tasks) {
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
    
    // Public API
    return {
        // Display Gantt chart
        displayGanttChart: function(tasks) {
            createGanttChart(tasks);
        }
    };
})();
