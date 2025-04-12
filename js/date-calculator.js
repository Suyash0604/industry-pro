/**
 * date-calculator.js - Handles date calculations for tasks and project timeline
 * Manages auto-calculation of end dates based on durations
 */

const DateCalculator = (function() {
    // Private methods
    
    // Calculate end date based on start date and duration
    function calculateEndDate(startDate, durationDays) {
        if (!startDate || isNaN(durationDays)) {
            return null;
        }
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + parseInt(durationDays));
        return endDate;
    }
    
    // Format date for input fields (YYYY-MM-DD)
    function formatDateForInput(date) {
        if (!date) return '';
        
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        
        return [year, month, day].join('-');
    }
    
    // Initialize event listeners for date calculations
    function initEventListeners() {
        // Set today as default for project start date and task start date
        const today = new Date();
        const todayFormatted = formatDateForInput(today);
        
        // Set default project start date to today
        const projectStartDateInput = document.getElementById('projectStartDate');
        if (projectStartDateInput && !projectStartDateInput.value) {
            projectStartDateInput.value = todayFormatted;
            updateProjectEndDate();
        }
        
        // Set default task start date to today
        const taskStartDateInput = document.getElementById('startDate');
        if (taskStartDateInput && !taskStartDateInput.value) {
            taskStartDateInput.value = todayFormatted;
            updateTaskEndDate();
        }
        
        // Project timeline calculation
        const projectDurationSlider = document.getElementById('projectDuration');
        const projectStartDate = document.getElementById('projectStartDate');
        
        if (projectDurationSlider) {
            projectDurationSlider.addEventListener('input', function() {
                document.getElementById('projectDurationValue').textContent = this.value;
                updateProjectEndDate();
            });
            
            // Trigger initial update
            document.getElementById('projectDurationValue').textContent = projectDurationSlider.value;
            updateProjectEndDate();
        }
        
        if (projectStartDate) {
            projectStartDate.addEventListener('change', updateProjectEndDate);
        }
        
        // Task duration and start date change handlers
        const taskDurationInput = document.getElementById('duration');
        const taskStartDate = document.getElementById('startDate');
        
        if (taskDurationInput) {
            taskDurationInput.addEventListener('input', updateTaskEndDate);
        }
        
        if (taskStartDate) {
            taskStartDate.addEventListener('change', updateTaskEndDate);
        }
    }
    
    // Update project end date based on start date and duration
    function updateProjectEndDate() {
        const startDateInput = document.getElementById('projectStartDate');
        const durationInput = document.getElementById('projectDuration');
        const endDateInput = document.getElementById('projectEndDate');
        
        if (!startDateInput || !durationInput || !endDateInput) {
            return;
        }
        
        const startDate = new Date(startDateInput.value);
        const duration = parseInt(durationInput.value);
        
        if (isNaN(startDate.getTime()) || isNaN(duration)) {
            return;
        }
        
        const endDate = calculateEndDate(startDate, duration);
        endDateInput.value = formatDateForInput(endDate);
    }
    
    // Update task end date based on start date and duration
    function updateTaskEndDate() {
        const startDateInput = document.getElementById('startDate');
        const durationInput = document.getElementById('duration');
        const endDateInput = document.getElementById('endDate');
        
        if (!startDateInput || !durationInput || !endDateInput) {
            return;
        }
        
        const startDate = new Date(startDateInput.value);
        const duration = parseInt(durationInput.value);
        
        if (isNaN(startDate.getTime()) || isNaN(duration)) {
            return;
        }
        
        const endDate = calculateEndDate(startDate, duration);
        endDateInput.value = formatDateForInput(endDate);
    }
    
    // Public API
    return {
        // Initialize date calculator
        init: function() {
            initEventListeners();
        },
        
        // Calculate end date (exposed for other modules)
        calculateEndDate: calculateEndDate,
        
        // Format date for input fields (exposed for other modules)
        formatDateForInput: formatDateForInput,
        
        // Update task end date (exposed for other modules)
        updateTaskEndDate: updateTaskEndDate
    };
})();
