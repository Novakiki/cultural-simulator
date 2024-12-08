export class JourneyAnalysis {
    constructor() {
        this.journeyAnalysisElement = document.getElementById('journey-analysis');
        this.timelineElement = document.getElementById('timeline-visualization');
    }

    showAnalysis() {
        this.journeyAnalysisElement.classList.remove('hidden');
        anime({
            targets: this.journeyAnalysisElement,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutCubic'
        });
    }

    updateTimeline(path1Events, path2Events) {
        const timelineContainer = this.timelineElement.querySelector('.timeline-events');
        timelineContainer.innerHTML = '';

        // Combine and sort events by age
        const allEvents = [...path1Events, ...path2Events]
            .sort((a, b) => a.year - b.year);

        // Group events by year
        const eventsByYear = allEvents.reduce((acc, event) => {
            if (!acc[event.year]) {
                acc[event.year] = [];
            }
            acc[event.year].push(event);
            return acc;
        }, {});

        // Create timeline entries
        Object.entries(eventsByYear).forEach(([year, events]) => {
            const timelineEntry = this.createTimelineEntry(year, events);
            timelineContainer.appendChild(timelineEntry);
        });

        // Animate timeline entries
        anime({
            targets: '.timeline-entry',
            opacity: [0, 1],
            translateX: [-20, 0],
            delay: anime.stagger(100),
            duration: 800,
            easing: 'easeOutCubic'
        });
    }

    createTimelineEntry(year, events) {
        const entry = document.createElement('div');
        entry.className = 'timeline-entry relative pl-8 pb-8';
        
        const dot = document.createElement('div');
        dot.className = 'absolute left-1/2 -translate-x-1/2 -ml-px w-3 h-3 rounded-full bg-indigo-500';
        
        const content = document.createElement('div');
        content.className = 'grid grid-cols-2 gap-4';
        
        // Create columns for each path
        events.forEach(event => {
            const eventColumn = this.createEventColumn(event);
            content.appendChild(eventColumn);
        });
        
        entry.appendChild(dot);
        entry.appendChild(content);
        
        return entry;
    }

    createEventColumn(event) {
        const column = document.createElement('div');
        column.className = 'bg-slate-800/50 backdrop-blur-xl p-4 rounded-lg border border-white/10 shadow-xl';
        
        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-2';
        
        const title = document.createElement('div');
        title.className = 'text-sm font-bold text-indigo-400';
        title.textContent = `Age ${event.year} - ${event.choice}`;
        
        const statsChanges = document.createElement('div');
        statsChanges.className = 'flex flex-wrap gap-2 text-xs';
        Object.entries(event.stats_changes)
            .filter(([_, change]) => parseInt(change) !== 0)
            .forEach(([stat, change]) => {
                const statBadge = document.createElement('span');
                const changeNum = parseInt(change);
                statBadge.className = `px-1.5 py-0.5 rounded ${changeNum > 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`;
                statBadge.textContent = `${stat}: ${change}`;
                statsChanges.appendChild(statBadge);
            });
        
        const story = document.createElement('p');
        story.className = 'text-sm text-white/80 mt-2';
        story.textContent = event.story;
        
        header.appendChild(title);
        column.appendChild(header);
        column.appendChild(statsChanges);
        column.appendChild(story);
        
        return column;
    }

    updateJourneySummary(pathNumber, events, finalStats) {
        const container = document.querySelector(`#journey-analysis > div:nth-child(2) > div:nth-child(${pathNumber})`);
        if (!container) return;
        
        const culturalInsights = container.querySelector('.cultural-insights');
        culturalInsights.innerHTML = this.generateCulturalInsights(events, finalStats);
    }

    async shareJourney() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Cultural Life Journey',
                    text: 'Check out my simulated cultural life journey!',
                    url: window.location.href
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            // Fallback to copying URL
            await navigator.clipboard.writeText(window.location.href);
            // Show toast or notification that URL was copied
        }
    }
} 