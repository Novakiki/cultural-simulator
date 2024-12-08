# Cultural Life Simulator

## Overview
Cultural Life Simulator is an interactive web application that explores how different cultural backgrounds shape life experiences.

## Features
- Parallel simulation of two different life paths
- Real-time stat tracking (health, wealth, happiness, etc.)
- Year-by-year story progression
- Beautiful animated UI with dark mode
- Interactive story cards with expandable content
- Dynamic stat changes with visual feedback
- Natural life progression until age 100 or other life-ending events

## Technical Stack
- Backend: FastAPI (Python)
- Frontend: HTML, JavaScript, TailwindCSS, DaisyUI
- Animations: Anime.js
- AI Model: GPT-4o-mini
- Styling: Custom CSS with responsive design

## Requirements
```
fastapi
uvicorn
jinja2
termcolor
openai
pydantic
```

## Setup
1. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

2. Set up your OpenAI API key as an environment variable:
   ```
   set OPENAI_API_KEY=your_api_key_here  # Windows
   export OPENAI_API_KEY=your_api_key_here  # Linux/Mac
   ```

3. Run the application:
   ```
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

## How It Works

### Life Path Generation
- Users select two different life paths from 50 predefined choices
- Each path starts with identical base stats for a 21-year-old person
- The AI model generates year-by-year progression for both paths
- Stories and stat changes are generated based on previous choices and events

### Stats System
- Age: Current age of the character
- Wealth: Financial status
- Health: Physical wellbeing
- Education: Knowledge and academic achievements
- Skills: Practical abilities and expertise
- Network: Social connections and influence
- Happiness: Overall life satisfaction
- Energy: Vitality and motivation
- Status: Social standing and recognition

### Story Generation
The AI model considers:
- Initial life choice
- Current stats
- Previous life events
- Age progression
- Natural life transitions

### End Conditions
A life path simulation ends when:
- Character reaches age 100
- Health-related or accidental life-ending event occurs
- User manually stops the simulation

## Usage
1. Open the application in a web browser
2. Read the disclaimer about AI-generated content
3. Select different life paths from the dropdowns
4. Click "Begin Life Journey" to start the simulation
5. Watch as both lives unfold in parallel
6. Use the stop button to end simulation if desired
7. Expand story cards to read full details

## Note
This is an experimental project using AI to explore hypothetical life paths. All generated content is fictional and any similarities to real events or persons are purely coincidental. 