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

// Cultural backgrounds
const CULTURAL_BACKGROUNDS = [
    'Secular Household 🌎',
    'Mormon Family 🏠',
    'Buddhist Temple 🏮',
    'Islamic Community 🕌',
    'Jewish Heritage 🕍',
    'Hindu Traditions 🕉️',
    'Christian Home ✝️',
    'Atheist Family 🧬',
    'Indigenous Culture 🪶',
    'Multicultural Home 🌏'
];

// Initialize components
const path1Display = new StatsDisplay('stats-card-1');
const path2Display = new StatsDisplay('stats-card-2');
const path1Events = new EventLog('stats-card-1');
const path2Events = new EventLog('stats-card-2');
const simulationController = new SimulationController(
    path1Display, path2Display,
    path1Events, path2Events
);

// State management
let path1History = [];
let path2History = [];
let path1Stats = { ...INITIAL_STATS };
let path2Stats = { ...INITIAL_STATS };

// Populate dropdowns
function populateDropdowns() {
    const path1Select = document.getElementById('path1-choice');
    const path2Select = document.getElementById('path2-choice');
    
    // Get current selections
    const path1Current = path1Select.value;
    const path2Current = path2Select.value;
    
    // Clear existing options except the first two (default options)
    while (path1Select.options.length > 2) path1Select.remove(2);
    while (path2Select.options.length > 2) path2Select.remove(2);
    
    // Add other backgrounds
    CULTURAL_BACKGROUNDS.forEach(background => {
        // Skip Mormon and Secular as they're already added
        if (background === 'Mormon Family 🏠' || background === 'Secular Household 🌎') {
            return;
        }
        
        const option1 = new Option(background, background);
        const option2 = new Option(background, background);
        path1Select.add(option1);
        path2Select.add(option2);
    });
    
    // Restore selections if they were different from defaults
    if (path1Current && path1Current !== 'Secular Household 🌎') {
        path1Select.value = path1Current;
    }
    if (path2Current && path2Current !== 'Mormon Family 🏠') {
        path2Select.value = path2Current;
    }
}

// Handle simulation start
async function handleStartSimulation() {
    const path1Choice = document.getElementById('path1-choice').value;
    const path2Choice = document.getElementById('path2-choice').value;

    if (!path1Choice || !path2Choice) {
        alert('Please select both cultural backgrounds before starting');
        return;
    }

    try {
        // Reset histories and stats
        path1History = [];
        path2History = [];
        path1Stats = { ...INITIAL_STATS };
        path2Stats = { ...INITIAL_STATS };

        // Reset displays
        path1Display.updateStats(INITIAL_STATS);
        path2Display.updateStats(INITIAL_STATS);
        path1Events.clear();
        path2Events.clear();

        console.log('Starting simulation with:', { path1Choice, path2Choice });

        // Start simulation
        await simulationController.startSimulation(
            path1Choice, path2Choice,
            path1Stats, path2Stats,
            path1History, path2History
        );
    } catch (error) {
        console.error('Error in handleStartSimulation:', error);
        alert('Failed to start simulation. Please try again.');
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing application...');
    
    // Show disclaimer modal on first visit
    const hasSeenDisclaimer = localStorage.getItem('hasSeenDisclaimer');
    if (!hasSeenDisclaimer) {
        const modal = document.getElementById('disclaimer-modal');
        if (modal) {
            // Show modal with animation
            setTimeout(() => {
                modal.classList.add('opacity-100');
                modal.classList.remove('opacity-0', 'pointer-events-none');
                modal.querySelector('.bg-slate-900\\/90').classList.add('scale-100');
            }, 100);

            // Handle acknowledgment
            const acknowledgeBtn = document.getElementById('acknowledge-disclaimer');
            if (acknowledgeBtn) {
                acknowledgeBtn.addEventListener('click', () => {
                    modal.classList.remove('opacity-100');
                    modal.classList.add('opacity-0', 'pointer-events-none');
                    modal.querySelector('.bg-slate-900\\/90').classList.remove('scale-100');
                    localStorage.setItem('hasSeenDisclaimer', 'true');
                });
            }
        }
    }
    
    // Populate dropdowns
    populateDropdowns();
    
    // Initialize stats display
    path1Display.updateStats(INITIAL_STATS);
    path2Display.updateStats(INITIAL_STATS);

    // Initialize cultural context with default values
    simulationController.updateCulturalContext(1, 'Secular Household 🌎');
    simulationController.updateCulturalContext(2, 'Mormon Family 🏠');
    
    // Add dropdown change listeners
    const path1Select = document.getElementById('path1-choice');
    const path2Select = document.getElementById('path2-choice');
    
    if (path1Select) {
        path1Select.addEventListener('change', (e) => {
            simulationController.updateCulturalContext(1, e.target.value);
        });
    }
    
    if (path2Select) {
        path2Select.addEventListener('change', (e) => {
            simulationController.updateCulturalContext(2, e.target.value);
        });
    }
    
    // Add button listeners
    const startButton = document.getElementById('start-simulation');
    const stopButton = document.getElementById('stop-simulation');
    
    if (startButton) {
        console.log('Adding start button listener');
        startButton.addEventListener('click', handleStartSimulation);
    } else {
        console.error('Start button not found');
    }
    
    if (stopButton) {
        console.log('Adding stop button listener');
        stopButton.addEventListener('click', () => {
            console.log('Stopping simulation');
            simulationController.stopSimulation();
        });
    } else {
        console.error('Stop button not found');
    }
});