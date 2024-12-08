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
let simulationActive = false;
let simulationStopped = false;
let path1History = [];
let path2History = [];
let path1Stats = { ...INITIAL_STATS };
let path2Stats = { ...INITIAL_STATS };

// Generate rich, darker color
function getRandomRichColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 40%, 25%)`; // Darker, richer colors
}

// Get contrasting text color
function getContrastColor(bgColor) {
    // Create a soft light color that complements the background
    const hue = parseInt(bgColor.split(',')[0].split('(')[1]);
    return `hsl(${hue}, 30%, 85%)`; // Light, slightly desaturated text
}

// Update stats display with proper formatting and animations
function updateStatsDisplay(stats, cardId, changes = null) {
    try {
        const formatValue = (stat, value) => {
            const emoji = STAT_EMOJIS[stat] || '';
            switch(stat) {
                case 'age':
                    return `${value} ${emoji}`;
                default:
                    return `${value}/100 ${emoji}`;
            }
        };

        Object.entries(stats).forEach(([stat, value]) => {
            if (stat === 'alive') return; // Skip alive status
            const element = document.querySelector(`#${cardId} .stat-${stat}`);
            if (element) {
                const oldValue = element.textContent;
                const newValue = formatValue(stat, value);
                element.textContent = newValue;

                // If there are changes and this stat changed
                if (changes && changes[stat]) {
                    const change = parseInt(changes[stat]);
                    const color = change > 0 ? '#86efac' : '#fca5a5'; // Lighter colors for better visibility
                    
                    // Create and position the change indicator
                    const indicator = document.createElement('div');
                    indicator.textContent = change > 0 ? `+${change}` : change;
                    indicator.style.position = 'absolute';
                    indicator.style.color = color;
                    indicator.style.fontSize = '0.875rem';
                    indicator.style.fontWeight = 'bold';
                    indicator.style.opacity = '0';
                    indicator.style.pointerEvents = 'none';
                    indicator.style.textShadow = '0 1px 2px rgba(0,0,0,0.2)';
                    element.style.position = 'relative';
                    element.appendChild(indicator);

                    // Animate the change
                    anime({
                        targets: element,
                        scale: [1, 1.2, 1],
                        duration: 600,
                        easing: 'easeOutElastic(1, .8)'
                    });

                    // Animate the indicator
                    anime({
                        targets: indicator,
                        translateY: [-20, -30],
                        opacity: [0, 1, 0],
                        duration: 1000,
                        easing: 'easeOutCubic',
                        complete: () => indicator.remove()
                    });
                }
            }
        });
    } catch (error) {
        console.error('Error updating stats display:', error);
    }
}

// Display transition message
function displayTransitionMessage(message, pathId) {
    const transitionElement = document.createElement('div');
    transitionElement.innerHTML = `
        <div class="text-center">
            <div class="text-2xl mb-2">🌍 Cultural Journey Complete 🌍</div>
            <p class="text-sm">${message}</p>
        </div>
    `;

    const card = document.querySelector(`#${pathId}`);
    if (!card) return;

    // Insert at the top of the card
    card.insertBefore(transitionElement, card.firstChild);

    // Animate the transition message
    anime({
        targets: transitionElement,
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 1000,
        easing: 'easeOutExpo'
    });

    // Add subtle floating animation
    anime({
        targets: transitionElement.querySelector('.text-2xl'),
        translateY: [-2, 2],
        direction: 'alternate',
        loop: true,
        duration: 2000,
        easing: 'easeInOutQuad'
    });
}

// Add story to path card
function addStoryToPath(story, pathId, age) {
    const storiesContainer = document.querySelector(`#${pathId} .stories-list`);
    if (!storiesContainer) return;

    // Show container if hidden
    const storyContainer = document.querySelector(`#${pathId} .story-container`);
    storyContainer.classList.remove('hidden');
    
    const storyElement = document.createElement('div');
    const backgroundColor = getRandomRichColor();
    const textColor = getContrastColor(backgroundColor);
    
    storyElement.className = 'story-entry mb-2 p-3 rounded-lg';
    storyElement.style.backgroundColor = backgroundColor;
    storyElement.style.color = textColor;
    storyElement.style.boxShadow = '0 4px 6px rgba(0,0,0,0.2)';
    storyElement.style.transform = 'translateY(-20px)';
    storyElement.style.opacity = '0';
    
    // Truncate story if too long
    const truncatedStory = story.length > 100 ? 
        story.substring(0, 100) + '...' : story;
    
    storyElement.innerHTML = `
        <div class="flex items-center gap-2 mb-2">
            <span class="badge badge-sm" 
                  style="background-color: ${backgroundColor}; 
                         color: ${textColor}; 
                         border: 1px solid ${textColor}; 
                         opacity: 0.9;">
                Age ${age}
            </span>
        </div>
        <p class="text-sm" style="line-height: 1.5;">${truncatedStory}</p>
        ${story.length > 100 ? 
            `<button class="btn btn-xs mt-2 expand-story" 
                     style="background-color: ${backgroundColor}; 
                            color: ${textColor}; 
                            border: 1px solid ${textColor}; 
                            opacity: 0.9;">
                Read More
            </button>` : 
            ''}
    `;
    
    if (story.length > 100) {
        storyElement.querySelector('.expand-story').addEventListener('click', () => {
            storyElement.querySelector('p').textContent = story;
            storyElement.querySelector('.expand-story').style.display = 'none';
            
            // Subtle pulse animation when expanding
            anime({
                targets: storyElement,
                scale: [1, 1.02, 1],
                duration: 300,
                easing: 'easeOutCubic'
            });
        });
    }
    
    // Add new story at the beginning
    if (storiesContainer.firstChild) {
        storiesContainer.insertBefore(storyElement, storiesContainer.firstChild);
    } else {
        storiesContainer.appendChild(storyElement);
    }
    
    // Animate new story entry
    anime({
        targets: storyElement,
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutElastic(1, .8)'
    });

    // Add hover effect with slight lightening of background
    storyElement.addEventListener('mouseenter', () => {
        anime({
            targets: storyElement,
            scale: 1.02,
            duration: 300,
            easing: 'easeOutCubic',
            update: function(anim) {
                // Slightly lighten the background color on hover
                const progress = anim.progress / 100;
                const lightenAmount = 5 * progress;
                storyElement.style.backgroundColor = backgroundColor.replace('25%', `${25 + lightenAmount}%`);
            }
        });
    });

    storyElement.addEventListener('mouseleave', () => {
        anime({
            targets: storyElement,
            scale: 1,
            duration: 300,
            easing: 'easeOutCubic',
            update: function(anim) {
                // Return to original color
                const progress = 1 - (anim.progress / 100);
                const lightenAmount = 5 * progress;
                storyElement.style.backgroundColor = backgroundColor.replace('25%', `${25 + lightenAmount}%`);
            }
        });
    });
}

// Simulate a single year for a path
async function simulateYear(currentStats, choiceHistory, initialChoice) {
    try {
        const response = await fetch('/api/simulate_year', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                current_stats: currentStats,
                choice_history: choiceHistory,
                total_years: choiceHistory.length,
                initial_choice: initialChoice
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response;
    } catch (error) {
        console.error('Error in simulateYear:', error);
        throw error;
    }
}

// Start simulation
async function startSimulation() {
    if (simulationActive) return;
    
    const path1Choice = document.getElementById('path1-choice');
    const path2Choice = document.getElementById('path2-choice');
    const startButton = document.getElementById('start-simulation');
    const stopButton = document.getElementById('stop-simulation');
    
    if (!path1Choice || !path2Choice || 
        path1Choice.value === "Choose Path 1" || 
        path2Choice.value === "Choose Path 2") {
        alert('Please select both paths before starting the simulation');
        return;
    }
    
    simulationActive = true;
    simulationStopped = false;
    
    // Show stop button and update start button
    startButton.disabled = true;
    stopButton.classList.remove('hidden');
    const spinner = startButton.querySelector('.loading');
    spinner.classList.remove('hidden');
    
    // Disable dropdowns
    path1Choice.disabled = true;
    path2Choice.disabled = true;
    
    // Show loading animations
    document.querySelectorAll('.simulation-status').forEach(status => {
        status.classList.remove('hidden');
        anime({
            targets: status,
            opacity: [0, 1],
            duration: 500,
            easing: 'easeInOutQuad'
        });
    });
    
    try {
        // Simulate both paths simultaneously
        while (path1Stats.alive && path2Stats.alive && !simulationStopped) {
            const [path1Response, path2Response] = await Promise.all([
                simulateYear(path1Stats, path1History, path1Choice.value),
                simulateYear(path2Stats, path2History, path2Choice.value)
            ]);
            
            // Update path 1
            if (path1Response.ok) {
                const data = await path1Response.json();
                path1Stats = data.updated_stats;
                path1History.push({
                    year: path1Stats.age,
                    choice: path1Choice.value,
                    story: data.story,
                    stats_changes: data.stats_changes
                });
                updateStatsDisplay(path1Stats, 'stats-card-1', data.stats_changes);
                addStoryToPath(data.story, 'stats-card-1', path1Stats.age);
                
                if (!path1Stats.alive && data.transition_message) {
                    displayTransitionMessage(data.transition_message, 'stats-card-1');
                }
            }
            
            // Update path 2
            if (path2Response.ok) {
                const data = await path2Response.json();
                path2Stats = data.updated_stats;
                path2History.push({
                    year: path2Stats.age,
                    choice: path2Choice.value,
                    story: data.story,
                    stats_changes: data.stats_changes
                });
                updateStatsDisplay(path2Stats, 'stats-card-2', data.stats_changes);
                addStoryToPath(data.story, 'stats-card-2', path2Stats.age);
                
                if (!path2Stats.alive && data.transition_message) {
                    displayTransitionMessage(data.transition_message, 'stats-card-2');
                }
            }
            
            // Continue simulation if either path is still alive
            if (!path1Stats.alive && !path2Stats.alive) {
                break;
            }
            
            // Add delay between years for dramatic effect
            if (!simulationStopped) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    } catch (error) {
        console.error('Simulation error:', error);
        alert('An error occurred during simulation. Please try again.');
    } finally {
        // Hide loading animations
        document.querySelectorAll('.simulation-status').forEach(status => {
            anime({
                targets: status,
                opacity: 0,
                duration: 500,
                easing: 'easeInOutQuad',
                complete: () => status.classList.add('hidden')
            });
        });
        
        // Reset button states
        spinner.classList.add('hidden');
        startButton.disabled = false;
        stopButton.classList.add('hidden');
        simulationActive = false;
        simulationStopped = false;
    }
}

// Stop simulation
function stopSimulation() {
    simulationStopped = true;
}

// Initialize simulation
document.addEventListener('DOMContentLoaded', () => {
    // Initialize stats display
    updateStatsDisplay(INITIAL_STATS, 'stats-card-1');
    updateStatsDisplay(INITIAL_STATS, 'stats-card-2');
    
    // Add start simulation button listener
    const startButton = document.getElementById('start-simulation');
    const stopButton = document.getElementById('stop-simulation');
    
    if (startButton) {
        startButton.addEventListener('click', startSimulation);
    }
    
    if (stopButton) {
        stopButton.addEventListener('click', stopSimulation);
    }
}); 