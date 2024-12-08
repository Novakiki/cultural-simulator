import { StatsDisplay } from './components/StatsDisplay.js';
import { EventLog } from './components/EventLog.js';
import { SimulationController } from './controllers/SimulationController.js';

// Initial stats for a 5-year-old child
const INITIAL_STATS = {
    age: 5,
    faith: 50,
    familyTies: 80,
    communityBonds: 60,
    education: 20,
    culturalKnowledge: 30,
    independence: 20,
    tradition: 50,
    exploration: 40,
    alive: true
};

// Format stat values with appropriate emoji
const STAT_EMOJIS = {
    age: '👤',
    faith: '🙏',
    familyTies: '👨‍👩‍👧‍👦',
    communityBonds: '🤝',
    education: '🎓',
    culturalKnowledge: '🌍',
    independence: '⭐',
    tradition: '📚',
    exploration: '🌟'
};

// State management
let path1History = [];
let path2History = [];
let path1Stats = { ...INITIAL_STATS };
let path2Stats = { ...INITIAL_STATS };

// Initialize components
const path1Display = new StatsDisplay('stats-card-1', STAT_EMOJIS);
const path2Display = new StatsDisplay('stats-card-2', STAT_EMOJIS);
const path1Events = new EventLog('stats-card-1');
const path2Events = new EventLog('stats-card-2');
const simulationController = new SimulationController(
    path1Display, path2Display,
    path1Events, path2Events
);

// Handle simulation start
async function handleStartSimulation() {
    const path1Choice = document.getElementById('path1-choice').value;
    const path2Choice = document.getElementById('path2-choice').value;

    if (!path1Choice || !path2Choice) {
        alert('Please select both cultural backgrounds before starting');
        return;
    }

    await simulationController.startSimulation(
        path1Choice, path2Choice,
        path1Stats, path2Stats,
        path1History, path2History
    );
}

// Initialize simulation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize stats display
    path1Display.updateStats(INITIAL_STATS);
    path2Display.updateStats(INITIAL_STATS);
    
    // Add button listeners
    const startButton = document.getElementById('start-simulation');
    const stopButton = document.getElementById('stop-simulation');
    
    if (startButton) {
        startButton.addEventListener('click', handleStartSimulation);
    }
    
    if (stopButton) {
        stopButton.addEventListener('click', () => simulationController.stopSimulation());
    }
}); 