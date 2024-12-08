// Cultural background choices array
const CULTURAL_BACKGROUNDS = [
    "Mormon Family 🏠",
    "Secular Household 🌎",
    "Jewish Family ✡️",
    "Buddhist Family 🕉️",
    "Hindu Family 🕉️",
    "Muslim Family 🕌",
    "Catholic Family ⛪",
    "Protestant Family 📖",
    "Orthodox Christian Family ☦️",
    "Sikh Family 🏠",
    "Traditional Chinese Family 🏮",
    "Japanese Family 🗾",
    "Korean Family 🇰🇷",
    "Indian Family 🪔",
    "Native American Family 🪶",
    "African Traditional Family 🌍",
    "Greek Orthodox Family ⛪",
    "Russian Orthodox Family ☦️",
    "Amish Family 🏠",
    "Mennonite Family 🏠"
];

// Initialize dropdowns with cultural backgrounds
function initializeDropdowns() {
    try {
        const path1Select = document.getElementById('path1-choice');
        const path2Select = document.getElementById('path2-choice');

        if (!path1Select || !path2Select) {
            console.error('Dropdown elements not found');
            return;
        }

        // Clear existing options
        path1Select.innerHTML = '<option disabled selected>Choose Cultural Background 1</option>';
        path2Select.innerHTML = '<option disabled selected>Choose Cultural Background 2</option>';

        // Add cultural backgrounds to both dropdowns
        CULTURAL_BACKGROUNDS.forEach(culture => {
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            option1.value = culture;
            option2.value = culture;
            option1.textContent = culture;
            option2.textContent = culture;
            path1Select.appendChild(option1);
            path2Select.appendChild(option2);
        });

        // Add change event listeners
        path1Select.addEventListener('change', () => {
            const selectedOption = path1Select.options[path1Select.selectedIndex];
            console.log('Background 1 selected:', selectedOption.value);
        });

        path2Select.addEventListener('change', () => {
            const selectedOption = path2Select.options[path2Select.selectedIndex];
            console.log('Background 2 selected:', selectedOption.value);
        });

    } catch (error) {
        console.error('Error initializing dropdowns:', error);
    }
}

// Initialize everything when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing cultural simulator...');
        initializeDropdowns();
        
        // Initialize anime.js animations for cards
        anime({
            targets: '.stat-card',
            translateY: [-20, 0],
            opacity: [0, 1],
            duration: 1000,
            easing: 'easeOutElastic(1, .8)',
            delay: anime.stagger(100)
        });

    } catch (error) {
        console.error('Error during initialization:', error);
    }
});