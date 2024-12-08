export class EventLog {
    constructor(cardId) {
        this.container = document.querySelector(`#${cardId} .stories-list`);
        this.loadingState = false;
        this.animationQueue = [];
        this.isProcessing = false;
        this.observer = new IntersectionObserver(
            (entries) => this.handleVisibility(entries),
            { threshold: 0.1 }
        );
    }

    handleVisibility(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                this.observer.unobserve(entry.target);
            }
        });
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
        console.log('Adding event:', { age, story, backgroundColor });
        if (this.loadingState) {
            this.setLoading(false);
        }

        const container = this.container.closest('.story-container');
        if (container) {
            container.classList.remove('hidden');
        }

        const storyElement = this.createEventElement(age, story, backgroundColor);
        console.log('Created element:', storyElement);

        this.container.insertBefore(storyElement, this.container.firstChild);

        requestAnimationFrame(() => {
            storyElement.style.opacity = '1';
            storyElement.style.transform = 'translateY(0)';
        });
    }

    async processAnimationQueue() {
        if (this.isProcessing || this.animationQueue.length === 0) return;
        
        this.isProcessing = true;
        const batch = this.animationQueue.splice(0, 3);
        
        await Promise.all(batch.map(event => {
            return new Promise(resolve => {
                requestAnimationFrame(() => {
                    const element = this.createEventElement(
                        event.age, event.story, event.backgroundColor
                    );
                    this.container.insertBefore(element, this.container.firstChild);
                    this.observer.observe(element);
                    resolve();
                });
            });
        }));
        
        this.isProcessing = false;
        if (this.animationQueue.length > 0) {
            this.processAnimationQueue();
        }
    }

    createEventElement(age, story, backgroundColor = null) {
        const storyElement = document.createElement('div');
        storyElement.className = 'mb-3 p-3 rounded-lg transition-all duration-300';
        storyElement.style.opacity = '0';
        storyElement.style.transform = 'translateY(-10px)';
        
        if (backgroundColor) {
            storyElement.style.backgroundColor = backgroundColor;
        }

        console.log('Creating story element with:', { age, story });
        storyElement.innerHTML = `
            <div class="text-sm font-bold mb-1">Age ${age}</div>
            <div class="text-xs">${story}</div>
        `;

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
