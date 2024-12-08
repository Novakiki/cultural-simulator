import { SimulationService } from '../services/SimulationService.js';

export class SimulationController {
    constructor(path1Display, path2Display, path1Events, path2Events) {
        this.path1Display = path1Display;
        this.path2Display = path2Display;
        this.path1Events = path1Events;
        this.path2Events = path2Events;
        this.simulationService = new SimulationService();
        this.simulationActive = false;
        this.simulationStopped = false;
        this.yearDelay = 3000;  // 3 seconds between years for better readability
        this.maxHistoryLength = 50;  // Limit history size
        this.pendingUpdates = [];    // Batch updates
        this.batchSize = 5;          // Process updates in batches
    }

    async startSimulation(path1Choice, path2Choice, path1Stats, path2Stats, path1History, path2History) {
        if (this.simulationActive) return;
        
        try {
            // Clear any previous error messages
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            
            this.simulationActive = true;
            this.simulationStopped = false;
            this.updateUIForSimulationStart();

            while (path1Stats.alive && path2Stats.alive && !this.simulationStopped) {
                await this.simulateYear(
                    path1Stats, path2Stats,
                    path1History, path2History,
                    path1Choice, path2Choice
                );
                await new Promise(resolve => setTimeout(resolve, this.yearDelay));
            }
        } catch (error) {
            this.displayError(`Simulation failed: ${error.message}`);
        } finally {
            this.simulationActive = false;
            this.updateUIForSimulationEnd();
        }
    }

    async simulateYear(path1Stats, path2Stats, path1History, path2History, path1Choice, path2Choice) {
        try {
            const displayAge = path1Stats.age;
            
            // Trim histories if too long
            if (path1History.length > this.maxHistoryLength) {
                path1History = path1History.slice(-this.maxHistoryLength);
                path2History = path2History.slice(-this.maxHistoryLength);
            }

            console.log('Simulating year:', {
                age: displayAge,
                path1Choice,
                path2Choice
            });

            const [path1Response, path2Response] = await Promise.all([
                this.simulationService.simulateYear(path1Stats, path1History, path1Choice),
                this.simulationService.simulateYear(path2Stats, path2History, path2Choice)
            ]);

            console.log('Received responses:', {
                path1: path1Response,
                path2: path2Response
            });

            // Update stats and history
            this.updateSimulationState(
                displayAge,
                [path1Stats, path1Response, path1Choice, path1History],
                [path2Stats, path2Response, path2Choice, path2History]
            );

        } catch (error) {
            console.error('Simulation error:', error);
            this.handleSimulationError(error);
            // Show error in UI
            this.path1Events.addEvent(displayAge, "Error: " + error.message, "hsl(0, 70%, 30%)");
            this.path2Events.addEvent(displayAge, "Error: " + error.message, "hsl(0, 70%, 30%)");
        }
    }

    updateSimulationState(age, path1Data, path2Data) {
        const [stats1, response1, choice1, history1] = path1Data;
        const [stats2, response2, choice2, history2] = path2Data;

        console.log('Updating UI with stories:', {
            story1: response1.story,
            story2: response2.story
        });

        // Update stats
        Object.assign(stats1, response1.updated_stats);
        Object.assign(stats2, response2.updated_stats);

        // Update histories
        history1.push({
            year: age,
            choice: choice1,
            story: response1.story,
            stats_changes: response1.stats_changes
        });

        history2.push({
            year: age,
            choice: choice2,
            story: response2.story,
            stats_changes: response2.stats_changes
        });

        // Update UI
        const color1 = this.simulationService.getEventColor(response1);
        const color2 = this.simulationService.getEventColor(response2);

        requestAnimationFrame(() => {
            this.path1Display.updateStats(stats1, response1.stats_changes);
            this.path1Events.addEvent(age, response1.story, color1);
            this.path2Display.updateStats(stats2, response2.stats_changes);
            this.path2Events.addEvent(age, response2.story, color2);
            
            // Ensure containers are visible
            document.querySelectorAll('.story-container').forEach(container => {
                container.classList.remove('hidden');
            });
        });
    }

    stopSimulation() {
        this.simulationStopped = true;
    }

    updateUIForSimulationStart() {
        const startButton = document.getElementById('start-simulation');
        const stopButton = document.getElementById('stop-simulation');
        const spinner = startButton.querySelector('.loading');
        
        startButton.disabled = true;
        stopButton.classList.remove('hidden');
        spinner.classList.remove('hidden');
        
        // Show story containers
        document.querySelectorAll('.story-container').forEach(container => {
            container.classList.remove('hidden');
        });
    }

    updateUIForSimulationEnd() {
        const startButton = document.getElementById('start-simulation');
        const stopButton = document.getElementById('stop-simulation');
        const spinner = startButton.querySelector('.loading');
        
        startButton.disabled = false;
        stopButton.classList.add('hidden');
        spinner.classList.add('hidden');
    }

    displayTransitionMessage(message, cardId) {
        const transitionElement = document.createElement('div');
        transitionElement.innerHTML = `
            <div class="text-center">
                <div class="text-2xl mb-2">🌍 Cultural Journey Complete 🌍</div>
                <p class="text-sm">${message}</p>
            </div>
        `;

        const card = document.querySelector(`#${cardId}`);
        if (card) {
            card.insertBefore(transitionElement, card.firstChild);
            this.animateTransition(transitionElement);
        }
    }

    animateTransition(element) {
        anime({
            targets: element,
            opacity: [0, 1],
            translateY: [-20, 0],
            duration: 1000,
            easing: 'easeOutExpo'
        });

        anime({
            targets: element.querySelector('.text-2xl'),
            translateY: [-2, 2],
            direction: 'alternate',
            loop: true,
            duration: 2000,
            easing: 'easeInOutQuad'
        });
    }

    handleSimulationError(error) {
        this.displayError(error.message);
    }

    async processPendingUpdates() {
        try {
            // Process all pending updates in the batch
            for (const update of this.pendingUpdates) {
                const { age, path1, path2 } = update;
                
                // Get colors for both paths
                const path1Color = this.simulationService.getEventColor(path1.response);
                const path2Color = this.simulationService.getEventColor(path2.response);

                // Update stats and display for path1
                this.path1Display.updateStats(path1.stats, path1.response.stats_changes);
                this.path1Events.addEvent(age, path1.response.story, path1Color);

                // Update stats and display for path2
                this.path2Display.updateStats(path2.stats, path2.response.stats_changes);
                this.path2Events.addEvent(age, path2.response.story, path2Color);

                // Handle transitions if needed
                if (!path1.stats.alive && path1.response.transition_message) {
                    this.displayTransitionMessage(path1.response.transition_message, 'stats-card-1');
                }
                if (!path2.stats.alive && path2.response.transition_message) {
                    this.displayTransitionMessage(path2.response.transition_message, 'stats-card-2');
                }
            }

            // Clear the processed updates
            this.pendingUpdates = [];
        } catch (error) {
            console.error('Error processing updates:', error);
            this.handleSimulationError(error);
        }
    }

    displayError(message) {
        console.error('Simulation error:', message);
        
        // Create visible error message at the top of both cards
        ['stats-card-1', 'stats-card-2'].forEach(cardId => {
            const card = document.querySelector(`#${cardId}`);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message bg-red-800 text-white p-4 mb-4 rounded-lg';
            errorDiv.innerHTML = `
                <p class="font-bold">Error</p>
                <p>${message}</p>
            `;
            card.insertBefore(errorDiv, card.firstChild);
        });
    }
} 