import { JourneyAnalysis } from '../components/JourneyAnalysis.js';

// Cultural context definitions
const CULTURAL_CONTEXT = {
    'Secular Household 🌎': {
        values: 'Rationality, Science, Personal choice, Individual growth',
        traditions: 'Emphasis on education, Critical thinking, Open discussion',
        challenges: 'Navigating religious society, Finding meaning without faith'
    },
    'Mormon Family 🏠': {
        values: 'Faith, Family unity, Service, Eternal perspective',
        traditions: 'Family Home Evening, Church attendance, Temple visits',
        challenges: 'Balancing religious and secular life, Maintaining standards'
    },
    'Buddhist Temple 🏮': {
        values: 'Mindfulness, Compassion, Non-attachment, Inner peace',
        traditions: 'Meditation, Temple visits, Dharma teachings',
        challenges: 'Balance modern life with spiritual practice'
    },
    'Islamic Community 🕌': {
        values: 'Faith, Family unity, Community service, Modesty',
        traditions: 'Daily prayers, Ramadan, Religious studies',
        challenges: 'Maintaining traditions in secular society'
    },
    'Jewish Heritage 🕍': {
        values: 'Learning, Family bonds, Cultural preservation',
        traditions: 'Shabbat, Holiday celebrations, Torah study',
        challenges: 'Balancing tradition with modern life'
    },
    'Hindu Traditions 🕉️': {
        values: 'Dharma, Family duty, Spiritual growth',
        traditions: 'Pujas, Festivals, Sacred texts study',
        challenges: 'Preserving traditions across generations'
    },
    'Christian Home ✝️': {
        values: 'Faith, Service, Family values, Community',
        traditions: 'Church attendance, Prayer, Bible study',
        challenges: 'Living faith in secular world'
    },
    'Atheist Family 🧬': {
        values: 'Scientific thinking, Humanism, Self-determination',
        traditions: 'Intellectual discourse, Evidence-based decisions',
        challenges: 'Finding community, Defining personal ethics'
    },
    'Indigenous Culture 🪶': {
        values: 'Connection to land, Community, Ancestral wisdom',
        traditions: 'Ceremonies, Oral histories, Cultural practices',
        challenges: 'Preserving heritage in modern world'
    },
    'Multicultural Home 🌏': {
        values: 'Diversity, Adaptability, Cultural appreciation',
        traditions: 'Blended celebrations, Multiple languages',
        challenges: 'Balancing different cultural identities'
    }
};

export class SimulationController {
    constructor(path1Display, path2Display, path1Events, path2Events) {
        this.path1Display = path1Display;
        this.path2Display = path2Display;
        this.path1Events = path1Events;
        this.path2Events = path2Events;
        this.isSimulating = false;
        this.timelineContainer = document.getElementById('timeline-comparison');
        this.timelineTemplate = document.getElementById('timeline-template');
    }

    createTimelineEntry(age) {
        console.log('Creating timeline entry for age:', age);
        
        if (!this.timelineTemplate) {
            console.error('Timeline template not found');
            return null;
        }

        // Clone the template
        const entry = this.timelineTemplate.children[0].cloneNode(true);
        
        // Set the age
        const ageLabel = entry.querySelector('.age-label');
        if (ageLabel) {
            ageLabel.textContent = `Age: ${age}`;
        }

        return entry;
    }

    updateTimelineEntry(entry, path1Event, path2Event) {
        if (!entry) {
            console.error('Timeline entry is null');
            return;
        }

        console.log('Updating timeline entry with events:', { path1Event, path2Event });

        // Update culture names
        const path1Culture = entry.querySelector('.path1-culture');
        const path2Culture = entry.querySelector('.path2-culture');
        const path1Story = entry.querySelector('.path1-story');
        const path2Story = entry.querySelector('.path2-story');
        const path1Stats = entry.querySelector('.path1-stats');
        const path2Stats = entry.querySelector('.path2-stats');

        if (path1Culture) path1Culture.textContent = path1Event.choice;
        if (path2Culture) path2Culture.textContent = path2Event.choice;
        if (path1Story) path1Story.textContent = path1Event.story;
        if (path2Story) path2Story.textContent = path2Event.story;

        // Format and update stats changes
        const formatStats = (stats) => {
            return Object.entries(stats)
                .filter(([key]) => key !== 'age' && key !== 'alive')
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
        };

        if (path1Stats) path1Stats.textContent = formatStats(path1Event.stats_changes);
        if (path2Stats) path2Stats.textContent = formatStats(path2Event.stats_changes);

        // Make the entry visible
        entry.classList.remove('hidden');

        // Add animation
        anime({
            targets: entry,
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutElastic(1, .8)'
        });
    }

    updateCulturalContext(pathNumber, culturalChoice) {
        console.log(`Attempting to update cultural context for path ${pathNumber} with choice: "${culturalChoice}"`);
        
        // Validate input
        if (!pathNumber || !culturalChoice) {
            console.error('Invalid input:', { pathNumber, culturalChoice });
            return;
        }

        // Get cultural context
        const context = CULTURAL_CONTEXT[culturalChoice];
        if (!context) {
            console.error(`No cultural context found for "${culturalChoice}". Available contexts:`, 
                Object.keys(CULTURAL_CONTEXT));
            return;
        }

        // Get DOM elements
        const elements = {
            values: document.querySelector(`.cultural-values-${pathNumber}`),
            traditions: document.querySelector(`.cultural-traditions-${pathNumber}`),
            challenges: document.querySelector(`.cultural-challenges-${pathNumber}`)
        };

        // Check for missing elements
        const missingElements = Object.entries(elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);

        if (missingElements.length > 0) {
            console.error(`Missing DOM elements for path ${pathNumber}:`, missingElements);
            console.log('Attempted to find:', {
                values: `.cultural-values-${pathNumber}`,
                traditions: `.cultural-traditions-${pathNumber}`,
                challenges: `.cultural-challenges-${pathNumber}`
            });
            return;
        }

        // Update the elements
        try {
            elements.values.textContent = context.values;
            elements.traditions.textContent = context.traditions;
            elements.challenges.textContent = context.challenges;
            console.log(`Successfully updated cultural context for path ${pathNumber} with:`, context);
        } catch (error) {
            console.error(`Error updating cultural context for path ${pathNumber}:`, error);
        }
    }

    async simulateYear(culturalChoice, stats, history) {
        try {
            // Format history to match the expected schema
            const formattedHistory = history.map(event => ({
                year: event.year || stats.age,
                choice: event.choice || culturalChoice,
                story: event.story || "",
                stats_changes: event.stats_changes || {}
            }));

            const response = await fetch('/api/simulate_year', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    current_stats: {
                        age: stats.age,
                        faith: stats.faith,
                        familyTies: stats.familyTies,
                        communityBonds: stats.communityBonds,
                        education: stats.education,
                        culturalKnowledge: stats.culturalKnowledge,
                        independence: stats.independence,
                        tradition: stats.tradition,
                        exploration: stats.exploration,
                        alive: stats.alive
                    },
                    choice_history: formattedHistory,
                    total_years: history.length,
                    initial_choice: culturalChoice
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server response:', errorData);
                throw new Error(`Simulation failed: ${response.statusText}`);
            }

            const result = await response.json();
            
            // Update the stats object with new values
            if (result.updated_stats) {
                Object.assign(stats, result.updated_stats);
                console.log('Updated stats:', stats);
            }
            
            return {
                year: stats.age,
                choice: culturalChoice,
                story: result.story,
                stats_changes: result.stats_changes
            };
        } catch (error) {
            console.error('Error in simulateYear:', error);
            throw error;
        }
    }

    async startSimulation(path1Choice, path2Choice, path1Stats, path2Stats, path1History, path2History) {
        if (this.isSimulating) {
            console.log('Simulation already running');
            return;
        }

        try {
            // Set simulation state
            this.isSimulating = true;
            
            // Show loading states
            document.querySelector('#start-simulation .loading')?.classList.remove('hidden');
            document.querySelector('#stop-simulation')?.classList.remove('hidden');
            document.querySelector('#start-simulation')?.setAttribute('disabled', 'true');
            
            // Clear previous timeline entries
            if (this.timelineContainer) {
                this.timelineContainer.innerHTML = '';
            } else {
                console.error('Timeline container not found');
                return;
            }

            // Update cultural context for both paths
            this.updateCulturalContext(1, path1Choice);
            this.updateCulturalContext(2, path2Choice);

            while (path1Stats.alive && path2Stats.alive && this.isSimulating && path1Stats.age < 80) {
                console.log(`Simulating year at age ${path1Stats.age}`);
                
                // Create timeline entry for this year
                const timelineEntry = this.createTimelineEntry(path1Stats.age);
                if (!timelineEntry) {
                    throw new Error('Failed to create timeline entry');
                }
                
                this.timelineContainer.insertBefore(timelineEntry, this.timelineContainer.firstChild);

                try {
                    // Simulate both paths in parallel
                    const [path1Result, path2Result] = await Promise.all([
                        this.simulateYear(path1Choice, path1Stats, path1History),
                        this.simulateYear(path2Choice, path2Stats, path2History)
                    ]);

                    // Update timeline entry with results
                    this.updateTimelineEntry(timelineEntry, path1Result, path2Result);

                    // Update histories
                    path1History.push(path1Result);
                    path2History.push(path2Result);

                    // Create copies of the stats to trigger reactivity
                    const path1StatsCopy = { ...path1Stats };
                    const path2StatsCopy = { ...path2Stats };

                    // Update displays with the latest stats
                    console.log('Updating displays with stats:', { path1StatsCopy, path2StatsCopy });
                    
                    // Force a reflow before updating stats
                    requestAnimationFrame(() => {
                        this.path1Display.updateStats(path1StatsCopy);
                        this.path2Display.updateStats(path2StatsCopy);
                    });
                    
                    // Update event logs
                    this.path1Events.addEvent(path1Result);
                    this.path2Events.addEvent(path2Result);

                    // Add a small delay between years for better visualization
                    await new Promise(resolve => setTimeout(resolve, 1500));
                } catch (error) {
                    console.error('Error during year simulation:', error);
                    throw error;
                }
            }
        } catch (error) {
            console.error('Simulation error:', error);
            alert('An error occurred during simulation. Please try again.');
        } finally {
            // Reset simulation state
            this.isSimulating = false;
            document.querySelector('#start-simulation .loading')?.classList.add('hidden');
            document.querySelector('#stop-simulation')?.classList.add('hidden');
            document.querySelector('#start-simulation')?.removeAttribute('disabled');
        }
    }

    stopSimulation() {
        this.isSimulating = false;
    }
} 