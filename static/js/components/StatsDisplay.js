export class StatsDisplay {
    constructor(cardId) {
        this.cardId = cardId;
        this.emojis = {
            age: '👤',
            faith: '🙏',
            familyTies: '👨‍👩‍👧‍👦',
            communityBonds: '🤝',
            education: '🎓',
            culturalKnowledge: '🌍',
            independence: '⭐',
            tradition: '📚',
            exploration: '🌟'
        };
        console.log(`StatsDisplay initialized for card: ${cardId}`);
    }

    updateStats(stats) {
        try {
            console.log(`Updating stats for ${this.cardId}:`, stats);
            Object.entries(stats).forEach(([stat, value]) => {
                if (stat === 'alive') return;
                this.updateStatValue(stat, value);
            });

            // Show the card if it's hidden
            const card = document.getElementById(this.cardId);
            if (card && card.classList.contains('opacity-0')) {
                card.classList.remove('opacity-0');
                anime({
                    targets: card,
                    translateY: [-20, 0],
                    opacity: [0, 1],
                    duration: 1000,
                    easing: 'easeOutElastic(1, .8)'
                });
            }
        } catch (error) {
            console.error(`Error updating stats display for ${this.cardId}:`, error);
        }
    }

    updateStatValue(stat, value) {
        // Find the stat element within the specific card
        const card = document.getElementById(this.cardId);
        if (!card) {
            console.error(`Card not found: ${this.cardId}`);
            return;
        }

        const element = card.querySelector(`.stat-${stat}`);
        if (!element) {
            console.error(`Stat element not found: ${stat} in card ${this.cardId}`);
            return;
        }

        console.log(`Updating ${stat} to ${value} in ${this.cardId}`);
        const oldValue = this.extractCurrentValue(element.textContent);
        const newValue = this.formatValue(stat, value);
        element.textContent = newValue;

        if (oldValue !== null && oldValue !== value) {
            this.animateChange(element, value - oldValue);
        }
    }

    extractCurrentValue(text) {
        const match = text.match(/(\d+)/);
        return match ? parseInt(match[1]) : null;
    }

    formatValue(stat, value) {
        const emoji = this.emojis[stat] || '';
        return stat === 'age' ? `${value} ${emoji}` : `${value}/100 ${emoji}`;
    }

    animateChange(element, change) {
        if (change === 0) return;

        const color = change > 0 ? '#86efac' : '#fca5a5';
        const indicator = document.createElement('div');
        const description = this.getChangeDescription(change);
        
        indicator.innerHTML = `
            <span>${change > 0 ? `+${change}` : change}</span>
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

        // Highlight stat change
        anime({
            targets: element,
            scale: [1, 1.2, 1],
            duration: 600,
            easing: 'easeOutElastic(1, .8)'
        });

        // Animate indicator
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
