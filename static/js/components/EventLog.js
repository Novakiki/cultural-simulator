export class EventLog {
    constructor(cardId) {
        this.container = document.querySelector(`#${cardId} .stories-list`);
        this.loadingState = false;
        this.cardId = cardId;
    }

    showLoading() {
        const container = document.querySelector(`#${this.cardId} .story-container`);
        const loadingStatus = document.querySelector(`#${this.cardId} .simulation-status`);
        
        if (container) container.classList.remove('hidden');
        if (loadingStatus) loadingStatus.classList.remove('hidden');
        
        this.loadingState = true;
    }

    hideLoading() {
        const loadingStatus = document.querySelector(`#${this.cardId} .simulation-status`);
        if (loadingStatus) loadingStatus.classList.add('hidden');
        this.loadingState = false;
    }

    clear() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        const container = document.querySelector(`#${this.cardId} .story-container`);
        if (container) {
            container.classList.add('hidden');
        }
    }

    addEvent(event) {
        if (!this.container) return;
        
        const storyElement = this.createEventElement(event);
        this.container.insertBefore(storyElement, this.container.firstChild);
        this.animateEvent(storyElement);
    }

    createEventElement(event) {
        const storyElement = document.createElement('div');
        storyElement.className = 'mb-3 opacity-0 p-3 rounded-lg transition-all duration-300 bg-slate-800/50';

        // Truncate story to 100 characters
        const truncatedStory = event.story.length > 100 ? event.story.slice(0, 100) + '...' : event.story;
        const isLongStory = event.story.length > 100;

        // Create stats changes HTML
        const statsChanges = Object.entries(event.stats_changes)
            .filter(([_, change]) => parseInt(change) !== 0)
            .map(([stat, change]) => {
                const changeNum = parseInt(change);
                const color = changeNum > 0 ? 'text-green-400' : 'text-red-400';
                return `<span class="${color}">${stat}: ${change}</span>`;
            })
            .join(' ');

        storyElement.innerHTML = `
            <div class="flex justify-between items-start mb-1">
                <div class="text-sm font-bold">Age ${event.year}</div>
                <div class="text-xs space-x-2">${statsChanges}</div>
            </div>
            <div class="text-xs story-content">${truncatedStory}</div>
            ${isLongStory ? `
                <button class="text-xs text-blue-400 hover:text-blue-300 mt-1 expand-story">
                    Read more
                </button>
            ` : ''}
        `;

        // Add click handler for expansion if story is long
        if (isLongStory) {
            const expandButton = storyElement.querySelector('.expand-story');
            const storyContent = storyElement.querySelector('.story-content');
            let isExpanded = false;

            expandButton.addEventListener('click', () => {
                if (isExpanded) {
                    storyContent.textContent = truncatedStory;
                    expandButton.textContent = 'Read more';
                } else {
                    storyContent.textContent = event.story;
                    expandButton.textContent = 'Show less';
                }
                isExpanded = !isExpanded;

                // Animate the height change
                anime({
                    targets: storyElement,
                    height: ['auto'],
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            });
        }

        return storyElement;
    }

    animateEvent(element) {
        anime({
            targets: element,
            translateY: [20, 0],
            opacity: [0, 1],
            duration: 800,
            easing: 'easeOutElastic(1, .8)'
        });
    }
}
