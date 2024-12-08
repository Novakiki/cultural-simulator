export class EventLog {
    constructor(cardId) {
        this.container = document.querySelector(`#${cardId} .stories-list`);
        this.loadingState = false;
    }

    setLoading(isLoading) {
        this.loadingState = isLoading;
        const container = this.container.closest('.story-container');
        if (container) {
            if (isLoading) {
                container.classList.remove('hidden');
                this.addLoadingPlaceholder();
            } else {
                this.removeLoadingPlaceholder();
            }
        }
    }

    addLoadingPlaceholder() {
        const placeholder = document.createElement('div');
        placeholder.className = 'loading-placeholder mb-3 p-3 rounded-lg bg-slate-800/50';
        placeholder.innerHTML = `
            <div class="animate-pulse">
                <div class="h-4 bg-slate-700 rounded w-1/4 mb-2"></div>
                <div class="h-3 bg-slate-700 rounded w-3/4"></div>
            </div>
        `;
        this.container.insertBefore(placeholder, this.container.firstChild);
    }

    removeLoadingPlaceholder() {
        const placeholder = this.container.querySelector('.loading-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
    }

    addEvent(age, story, backgroundColor = null) {
        if (this.loadingState) {
            this.setLoading(false);
        }
        const storyElement = this.createEventElement(age, story, backgroundColor);
        this.container.insertBefore(storyElement, this.container.firstChild);
        this.animateEvent(storyElement);
    }

    createEventElement(age, story, backgroundColor) {
        const storyElement = document.createElement('div');
        storyElement.className = 'mb-3 opacity-0 p-3 rounded-lg transition-all duration-300';
        
        if (backgroundColor) {
            storyElement.style.backgroundColor = backgroundColor;
        }

        // Truncate story to 100 characters
        const truncatedStory = story.length > 100 ? story.slice(0, 100) + '...' : story;
        const isLongStory = story.length > 100;

        storyElement.innerHTML = `
            <div class="text-sm font-bold mb-1">Age ${age}</div>
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
                    storyContent.textContent = story;
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

        // Add hover interactions
        this.addHoverEffects(storyElement, backgroundColor);
        
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

    addHoverEffects(element, backgroundColor) {
        if (!backgroundColor) return;

        element.addEventListener('mouseenter', () => {
            anime({
                targets: element,
                scale: 1.02,
                duration: 300,
                easing: 'easeOutCubic',
                update: function(anim) {
                    const progress = anim.progress / 100;
                    const lightenAmount = 5 * progress;
                    element.style.backgroundColor = backgroundColor.replace('25%', `${25 + lightenAmount}%`);
                }
            });
        });

        element.addEventListener('mouseleave', () => {
            anime({
                targets: element,
                scale: 1,
                duration: 300,
                easing: 'easeOutCubic',
                update: function(anim) {
                    const progress = 1 - (anim.progress / 100);
                    const lightenAmount = 5 * progress;
                    element.style.backgroundColor = backgroundColor.replace('25%', `${25 + lightenAmount}%`);
                }
            });
        });
    }
}
