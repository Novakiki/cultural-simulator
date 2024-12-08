export class SimulationService {
    constructor() {
        this.baseUrl = '/api';
        // Define consistent colors for different types of events
        this.eventColors = {
            challenging: 'hsl(350, 30%, 25%)',  // Muted red for challenges
            mixed: 'hsl(280, 30%, 25%)',        // Purple for mixed experiences
            growth: 'hsl(200, 30%, 25%)',       // Blue for personal growth
            positive: 'hsl(120, 30%, 25%)'      // Green for positive events
        };
    }

    async simulateYear(stats, history, choice) {
        try {
            console.log('Sending request with:', {stats, history, choice});
            const response = await fetch(`${this.baseUrl}/simulate_year`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    current_stats: stats,
                    choice_history: history,
                    total_years: history.length,
                    initial_choice: choice
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Simulation API error:', error);
            throw error;
        }
    }

    getEventColor(response) {
        // Analyze the story themes and changes
        const changes = response.stats_changes;
        const positiveChanges = Object.values(changes).filter(c => parseInt(c) > 0).length;
        const negativeChanges = Object.values(changes).filter(c => parseInt(c) < 0).length;
        
        // Check for growth indicators
        const hasGrowth = changes.education > 0 || changes.culturalKnowledge > 0 || changes.independence > 0;
        const hasChallenges = changes.familyTies < 0 || changes.tradition < 0;
        
        if (positiveChanges > negativeChanges) return this.eventColors.positive;
        if (hasGrowth && hasChallenges) return this.eventColors.growth;
        if (positiveChanges === negativeChanges) return this.eventColors.mixed;
        return this.eventColors.challenging;
    }

    getContrastColor(bgColor) {
        const hue = parseInt(bgColor.split(',')[0].split('(')[1]);
        return `hsl(${hue}, 30%, 85%)`; // Light, slightly desaturated text
    }
} 