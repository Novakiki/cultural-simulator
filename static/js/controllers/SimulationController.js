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
    }

    async startSimulation(path1Choice, path2Choice, path1Stats, path2Stats, path1History, path2History) {
        if (this.simulationActive) return;
        
        try {
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
            console.error('Simulation error:', error);
        } finally {
            this.simulationActive = false;
            this.updateUIForSimulationEnd();
        }
    }

    async simulateYear(path1Stats, path2Stats, path1History, path2History, path1Choice, path2Choice) {
        try {
            const displayAge = path1Stats.age;
            this.path1Events.setLoading(true);
            this.path2Events.setLoading(true);

            const [path1Response, path2Response] = await Promise.all([
                this.simulationService.simulateYear(path1Stats, path1History, path1Choice),
                this.simulationService.simulateYear(path2Stats, path2History, path2Choice)
            ]).catch(error => {
                this.path1Events.setLoading(false);
                this.path2Events.setLoading(false);
                this.handleSimulationError(error);
                return null;
            });

            if (!path1Response || !path2Response) return;

            // Get colors after responses are available
            const path1Color = this.simulationService.getEventColor(path1Response);
            const path2Color = this.simulationService.getEventColor(path2Response);

            // Update stats first
            Object.assign(path1Stats, path1Response.updated_stats);
            Object.assign(path2Stats, path2Response.updated_stats);

            // Record history with the age when events occurred
            path1History.push({
                year: displayAge,
                choice: path1Choice,
                story: path1Response.story,
                stats_changes: path1Response.stats_changes
            });

            path2History.push({
                year: displayAge,
                choice: path2Choice,
                story: path2Response.story,
                stats_changes: path2Response.stats_changes
            });

            // Update displays and add events
            this.path1Display.updateStats(path1Stats, path1Response.stats_changes);
            this.path1Events.addEvent(displayAge, path1Response.story, path1Color);
            
            this.path2Display.updateStats(path2Stats, path2Response.stats_changes);
            this.path2Events.addEvent(displayAge, path2Response.story, path2Color);

            // Handle transitions if needed
            if (!path1Stats.alive && path1Response.transition_message) {
                this.displayTransitionMessage(path1Response.transition_message, 'stats-card-1');
            }
            if (!path2Stats.alive && path2Response.transition_message) {
                this.displayTransitionMessage(path2Response.transition_message, 'stats-card-2');
            }

        } catch (error) {
            this.handleSimulationError(error);
        }
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
        console.error('Simulation error:', error);
        this.simulationActive = false;
        this.updateUIForSimulationEnd();
        
        // Show user-friendly error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'text-error text-sm mt-4 text-center';
        errorMessage.textContent = 'The simulation encountered an error. Please try again.';
        
        document.querySelectorAll('.story-container').forEach(container => {
            container.appendChild(errorMessage.cloneNode(true));
        });
    }
} 