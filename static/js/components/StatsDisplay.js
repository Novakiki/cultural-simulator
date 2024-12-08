export class StatsDisplay {
    constructor(cardId, emojis) {
        this.cardId = cardId;
        this.emojis = emojis;
        this.pendingUpdates = new Map();
        this.frameRequest = null;
    }

    updateStats(stats, changes = null) {
        try {
            if (this.frameRequest) {
                cancelAnimationFrame(this.frameRequest);
            }

            this.frameRequest = requestAnimationFrame(() => {
                Object.entries(stats).forEach(([stat, value]) => {
                    if (stat === 'alive') return;
                    this.pendingUpdates.set(stat, {
                        value,
                        change: changes?.[stat]
                    });
                });
                this.processPendingUpdates();
            });
        } catch (error) {
            console.error('Error updating stats display:', error);
        }
    }

    processPendingUpdates() {
        this.pendingUpdates.forEach((update, stat) => {
            this.updateStatValue(stat, update.value, update.change);
        });
        this.pendingUpdates.clear();
    }

    updateStatValue(stat, value, change = null) {
        const element = document.querySelector(`#${this.cardId} .stat-${stat}`);
        if (!element) return;

        const newValue = this.formatValue(stat, value);
        if (element.textContent !== newValue) {
            element.textContent = newValue;
        }

        if (change) {
            this.animateChange(element, change);
        }
    }

    formatValue(stat, value) {
        const emoji = this.emojis[stat] || '';
        return stat === 'age' ? `${value} ${emoji}` : `${value}/100 ${emoji}`;
    }

    animateChange(element, change) {
        const changeValue = parseInt(change);
        const color = changeValue > 0 ? '#86efac' : '#fca5a5';
        
        const indicator = document.createElement('div');
        const description = this.getChangeDescription(changeValue);
        indicator.innerHTML = `
            <span>${changeValue > 0 ? `+${changeValue}` : changeValue}</span>
            <span class="text-xs opacity-80"> ${description}</span>
        `;
        indicator.style.position = 'absolute';
        indicator.style.color = color;
        indicator.style.fontSize = '0.875rem';
        indicator.style.fontWeight = 'bold';
        indicator.style.opacity = '0';
        indicator.style.pointerEvents = 'none';
        indicator.style.textShadow = '0 1px 2px rgba(0,0,0,0.2)';
        
        element.style.position = 'relative';
        element.appendChild(indicator);

        anime({
            targets: element,
            scale: [1, 1.2, 1],
            duration: 600,
            easing: 'easeOutElastic(1, .8)'
        });

        anime({
            targets: indicator,
            translateY: [-20, -30],
            opacity: [0, 1, 0],
            duration: 1000,
            easing: 'easeOutCubic',
            complete: () => indicator.remove()
        });
    }

    getChangeDescription(change) {
        const abs = Math.abs(change);
        if (abs >= 4) return change > 0 ? 'major gain' : 'major loss';
        if (abs >= 2) return change > 0 ? 'moderate gain' : 'moderate loss';
        return change > 0 ? 'slight gain' : 'slight loss';
    }
}
