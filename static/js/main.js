// Life choices array
const LIFE_CHOICES = [
    "Pursue Higher Education 🎓",
    "Start a Business Venture 💼",
    "Travel the World 🌎",
    "Focus on Career Growth 📈",
    "Learn New Skills 🛠️",
    "Start a Family 👨‍👩‍👧‍👦",
    "Move to a New City 🏙️",
    "Invest in Real Estate 🏠",
    "Join a Startup 🚀",
    "Become a Freelancer 💻",
    "Study Abroad 🌍",
    "Join Corporate World 🏢",
    "Start a YouTube Channel 🎥",
    "Learn Programming 👨‍💻",
    "Open a Restaurant 🍽️",
    "Become a Teacher 👨‍🏫",
    "Write a Book 📚",
    "Start a Non-Profit 🤝",
    "Become an Artist 🎨",
    "Join the Military 🪖",
    "Become a Doctor 👨‍⚕️",
    "Start a Band 🎸",
    "Become an Athlete 🏃‍♂️",
    "Study Psychology 🧠",
    "Learn Photography 📸",
    "Start a Podcast 🎙️",
    "Become an Actor 🎭",
    "Study Law 👨‍⚖️",
    "Learn to Code 💻",
    "Start a Blog ✍️",
    "Become a Chef 👨‍🍳",
    "Join Politics 🏛️",
    "Study Architecture 🏗️",
    "Become a Pilot ✈️",
    "Start a Farm 🌾",
    "Learn Dancing 💃",
    "Become a Designer 🎨",
    "Study Marine Biology 🐠",
    "Start a Tech Company 🖥️",
    "Become a Journalist 📰",
    "Learn Music 🎼",
    "Study Environmental Science 🌿",
    "Become a Financial Advisor 💰",
    "Start a Fashion Brand 👔",
    "Join Space Program 🚀",
    "Study Robotics 🤖",
    "Become a Social Worker 🤲",
    "Learn Film Making 🎬",
    "Start a Sports Career ⚽",
    "Become a Researcher 🔬"
];

// Initialize dropdowns with life choices
function initializeDropdowns() {
    try {
        const path1Select = document.getElementById('path1-choice');
        const path2Select = document.getElementById('path2-choice');

        if (!path1Select || !path2Select) {
            console.error('Dropdown elements not found');
            return;
        }

        // Clear existing options
        path1Select.innerHTML = '<option disabled selected>Choose Path 1</option>';
        path2Select.innerHTML = '<option disabled selected>Choose Path 2</option>';

        // Add life choices to both dropdowns
        LIFE_CHOICES.forEach(choice => {
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            option1.value = choice;
            option2.value = choice;
            option1.textContent = choice;
            option2.textContent = choice;
            path1Select.appendChild(option1);
            path2Select.appendChild(option2);
        });

        // Add change event listeners
        path1Select.addEventListener('change', () => {
            const selectedOption = path1Select.options[path1Select.selectedIndex];
            console.log('Path 1 selected:', selectedOption.value);
        });

        path2Select.addEventListener('change', () => {
            const selectedOption = path2Select.options[path2Select.selectedIndex];
            console.log('Path 2 selected:', selectedOption.value);
        });

    } catch (error) {
        console.error('Error initializing dropdowns:', error);
    }
}

// Initialize everything when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('Initializing application...');
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