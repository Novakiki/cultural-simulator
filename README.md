# Cultural Life Simulator

## Overview
Cultural Life Simulator is an interactive web application that explores how different cultural backgrounds shape life experiences.

## Features
- Parallel simulation of two different cultural backgrounds
- Real-time cultural stat tracking (faith, family ties, cultural knowledge, etc.)
- Year-by-year story progression
- Beautiful animated UI with dark mode
- Interactive story cards with expandable content
- Dynamic stat changes with visual feedback
- Cultural journey from childhood through significant life stages

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
- Users select two different cultural backgrounds to explore
- Each path starts with identical base stats for a 5-year-old child
- The AI model generates year-by-year progression for both paths
- Stories and stat changes reflect cultural experiences and milestones

### Stats System
- Age: Current life stage
- Faith: Religious and spiritual connection
- Family Ties: Connection to family
- Community Bonds: Integration with community
- Education: Academic development
- Cultural Knowledge: Understanding of traditions
- Independence: Personal autonomy
- Tradition: Connection to cultural practices
- Exploration: Openness to new experiences

### Story Generation
The AI model considers:
- Cultural background
- Current stats
- Previous life events
- Age-appropriate cultural milestones
- Cultural traditions and practices

### End Conditions
A life path simulation ends when:
- Person reaches adulthood or significant cultural milestone
- Natural conclusion of the cultural journey
- User manually stops the simulation

## Usage
1. Open the application in a web browser
2. Read the disclaimer about AI-generated content
3. Select different cultural backgrounds from the dropdowns
4. Click "Begin Cultural Journey" to start the simulation
5. Watch as both lives unfold in parallel
6. Use the stop button to end simulation if desired
7. Expand story cards to read full details

## Note
This is an experimental project using AI to explore different cultural experiences. All generated content is fictional and any similarities to real events or persons are purely coincidental. 