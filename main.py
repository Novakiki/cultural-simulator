from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from termcolor import colored
from pydantic import BaseModel
from typing import Dict, List, Optional, Union
from openai import AsyncOpenAI
import os
import json

print(colored("Starting FastAPI application...", "cyan"))

app = FastAPI(title="Alternate Life Simulator")

try:
    app.mount("/static", StaticFiles(directory="static"), name="static")
    print(colored("Static files mounted successfully", "green"))
except Exception as e:
    print(colored(f"Error mounting static files: {str(e)}", "red"))

templates = Jinja2Templates(directory="templates")

# Initialize AsyncOpenAI client
try:
    client = AsyncOpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
        max_retries=3,
        timeout=30.0
    )
    print(colored("OpenAI client initialized successfully", "green"))
except Exception as e:
    print(colored(f"Error initializing OpenAI client: {str(e)}", "red"))
    raise

# Models for request/response
class Stats(BaseModel):
    age: int
    wealth: int
    health: int
    education: int
    skills: int
    network: int
    happiness: int
    energy: int
    status: int
    alive: bool

class ChoiceHistory(BaseModel):
    year: int
    choice: str
    story: str
    stats_changes: Dict[str, str]

class SimulationContext(BaseModel):
    current_stats: Stats
    choice_history: List[ChoiceHistory]
    total_years: int
    initial_choice: str

class SimulationResponse(BaseModel):
    story: str
    stats_changes: Dict[str, str]
    updated_stats: Stats

# Routes
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    try:
        return templates.TemplateResponse(
            "index.html",
            {"request": request}
        )
    except Exception as e:
        print(colored(f"Error rendering template: {str(e)}", "red"))
        raise

@app.post("/api/simulate_year")
async def simulate_year(context: SimulationContext) -> SimulationResponse:
    try:
        if not client.api_key:
            raise ValueError("OpenAI API key not found in environment variables")
        
        # Prepare prompt for the model
        prompt = f"""Given the following context about a person's life path:
Initial Choice: {context.initial_choice}
Current Age: {context.current_stats.age}
Years Passed: {context.total_years}
Current Stats:
{json.dumps(context.current_stats.dict(), indent=2)}

Previous Events:
{json.dumps([h.dict() for h in context.choice_history], indent=2)}

Generate the next year of their life. Be objective and realistic. Events can be positive or negative.
The story should be concise but impactful. Stats should change based on life events. Do not include mental health related issues in life. and have a  normal life progression unless and accident or health issue occurs.

If the person's journey should end (due to health issues, accidents, or reaching age 100), 
set alive to false and provide a meaningful "transition_message" about their legacy and how they transitioned to the great beyond.
Make this transition feel like a natural progression of their life story.

Response must be in the following JSON format:
{{
    "story": "A concise description of what happened this year",
    "stats_changes": {{
        "stat_name": "+1 or -1 format"
    }},
    "updated_stats": {{
        "age": "integer",
        "wealth": "integer",
        "health": "integer",
        "education": "integer",
        "skills": "integer",
        "network": "integer",
        "happiness": "integer",
        "energy": "integer",
        "status": "integer",
        "alive": "boolean"
    }},
    "transition_message": "If alive is false, provide a beautiful message about their legacy and transition. Otherwise, leave empty."
}}"""

        # Make API call
        print(colored(f"making api call for year {context.total_years}", "yellow"))
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.7
        )

        # Parse and validate response
        result = json.loads(response.choices[0].message.content)
        
        # Convert to Pydantic model for validation
        simulation_response = SimulationResponse(**result)
        
        return simulation_response

    except Exception as e:
        print(colored(f"Error in simulation: {str(e)}", "red"))
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

if __name__ == "__main__":
    import uvicorn
    print(colored("Starting development server...", "yellow"))
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True) 