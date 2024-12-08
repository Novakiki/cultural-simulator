export class SimulationService {
    constructor() {
        this.baseUrl = '/api';
        // Define consistent colors for different types of events
        this.eventColors = {
            challenging: 'hsl(0, 40%, 25%)',    // Reddish for challenges
            neutral: 'hsl(220, 40%, 25%)',      // Bluish for neutral events
            positive: 'hsl(120, 40%, 25%)'      // Greenish for positive events
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
        // Determine event type based on stat changes
        const changes = Object.values(response.stats_changes)
            .map(change => parseInt(change))
            .reduce((sum, change) => sum + change, 0);
        
        if (changes < 0) return this.eventColors.challenging;
        if (changes > 0) return this.eventColors.positive;
        return this.eventColors.neutral;
    }

    getContrastColor(bgColor) {
        const hue = parseInt(bgColor.split(',')[0].split('(')[1]);
        return `hsl(${hue}, 30%, 85%)`; // Light, slightly desaturated text
    }
} 