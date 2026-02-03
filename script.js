// Mood Tracker Application
class MoodTracker {
    constructor() {
        this.moods = this.loadMoods();
        this.init();
    }

    init() {
        this.displayCurrentDate();
        this.setupEventListeners();
        this.renderMoodHistory();
    }

    displayCurrentDate() {
        const dateElement = document.getElementById('currentDate');
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }

    setupEventListeners() {
        // Color button clicks
        const colorButtons = document.querySelectorAll('.color-btn');
        colorButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleColorSelection(e));
        });

        // Clear history button
        const clearButton = document.getElementById('clearHistory');
        clearButton.addEventListener('click', () => this.clearHistory());
    }

    handleColorSelection(event) {
        const button = event.target;
        const color = button.dataset.color;
        const moodName = button.dataset.mood;

        // Visual feedback
        this.highlightSelectedButton(button);
        
        // Save mood
        this.saveMood(color, moodName);
        
        // Update display
        this.showSelectedMood(color, moodName);
        this.renderMoodHistory();
    }

    highlightSelectedButton(selectedButton) {
        // Remove previous selection
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Add selection to clicked button
        selectedButton.classList.add('selected');
        
        // Remove selection after animation
        setTimeout(() => {
            selectedButton.classList.remove('selected');
        }, 1000);
    }

    showSelectedMood(color, moodName) {
        const selectedMoodDiv = document.getElementById('selectedMood');
        selectedMoodDiv.innerHTML = `
            <span style="color: ${color}; font-weight: bold;">✓</span> 
            Mood saved: ${moodName}
        `;
        
        // Clear message after 3 seconds
        setTimeout(() => {
            selectedMoodDiv.innerHTML = '';
        }, 3000);
    }

    saveMood(color, moodName) {
        const today = new Date();
        const dateKey = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        
        const mood = {
            color: color,
            name: moodName,
            date: dateKey,
            timestamp: today.getTime()
        };

        // Check if mood for today already exists
        const existingIndex = this.moods.findIndex(m => m.date === dateKey);
        
        if (existingIndex !== -1) {
            // Update existing mood for today
            this.moods[existingIndex] = mood;
        } else {
            // Add new mood
            this.moods.unshift(mood);
        }

        // Save to localStorage
        this.storeMoods();
    }

    renderMoodHistory() {
        const timeline = document.getElementById('moodTimeline');
        
        if (this.moods.length === 0) {
            timeline.innerHTML = '<p class="empty-state">No moods tracked yet. Select a color above to start!</p>';
            return;
        }

        timeline.innerHTML = '';
        
        this.moods.forEach(mood => {
            const entry = this.createMoodEntry(mood);
            timeline.appendChild(entry);
        });
    }

    createMoodEntry(mood) {
        const entry = document.createElement('div');
        entry.className = 'mood-entry';
        
        const formattedDate = this.formatDate(mood.date);
        const isToday = mood.date === new Date().toISOString().split('T')[0];
        const dateLabel = isToday ? 'Today' : formattedDate;
        
        entry.innerHTML = `
            <div class="mood-color" style="background-color: ${mood.color};"></div>
            <div class="mood-details">
                <div class="mood-name">${mood.name}</div>
                <div class="mood-date">${dateLabel}</div>
            </div>
        `;
        
        return entry;
    }

    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    loadMoods() {
        const stored = localStorage.getItem('moodHistory');
        return stored ? JSON.parse(stored) : [];
    }

    storeMoods() {
        localStorage.setItem('moodHistory', JSON.stringify(this.moods));
    }

    clearHistory() {
        if (this.moods.length === 0) {
            alert('No history to clear!');
            return;
        }

        if (confirm('Are you sure you want to clear all your mood history?')) {
            this.moods = [];
            this.storeMoods();
            this.renderMoodHistory();
            
            const selectedMoodDiv = document.getElementById('selectedMood');
            selectedMoodDiv.innerHTML = 'History cleared!';
            setTimeout(() => {
                selectedMoodDiv.innerHTML = '';
            }, 2000);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MoodTracker();
});
