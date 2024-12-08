from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from termcolor import colored
from pydantic import BaseModel
from typing import Dict, List, Optional, Union
from openai import OpenAI
import os
import json

print(colored("Starting Cultural Life Simulator...", "cyan"))

app = FastAPI(title="Cultural Life Simulator")

try:
    app.mount("/static", StaticFiles(directory="static"), name="static")
    print(colored("Static files mounted successfully", "green"))
except Exception as e:
    print(colored(f"Error mounting static files: {str(e)}", "red"))

templates = Jinja2Templates(directory="templates")

# Initialize OpenAI client
try:
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    print(colored("OpenAI client initialized successfully", "green"))
except Exception as e:
    print(colored(f"Error initializing OpenAI client: {str(e)}", "red"))
    raise

# Models for request/response
class Stats(BaseModel):
    age: int
    faith: int
    familyTies: int
    communityBonds: int
    education: int
    culturalKnowledge: int
    independence: int
    tradition: int
    exploration: int
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
        
        # Updated prompt for cultural simulation
        prompt = f"""Given the following context about a person's cultural upbringing:
Cultural Background: {context.initial_choice}
Current Age: {context.current_stats.age}
Years in Journey: {context.total_years}

Current Stats:
{json.dumps(context.current_stats.dict(), indent=2)}

Previous Events:
{json.dumps([h.dict() for h in context.choice_history], indent=2)}

Generate the next year of their life, considering their cultural background and its influence on their experiences. Consider:
- Age-appropriate cultural and religious practices
- Family dynamics and expectations
- Community involvement and traditions
- Educational experiences typical for this background
- Cultural celebrations and milestones
- Relationships with family and community
- Personal identity development
- Cultural learning and transmission

Events should be authentic to the cultural experience while avoiding stereotypes. Include both everyday moments and significant milestones.

Response must be in this JSON format:
{{
    "story": "A culturally authentic description of what happened this year",
    "stats_changes": {{
        "stat_name": "+1 or -1 format"
    }},
    "updated_stats": {{
        "age": "integer",
        "faith": "integer",
        "familyTies": "integer",
        "communityBonds": "integer",
        "education": "integer",
        "culturalKnowledge": "integer",
        "independence": "integer",
        "tradition": "integer",
        "exploration": "integer",
        "alive": "boolean"
    }},
    "transition_message": "If alive is false, provide a culturally appropriate message about their legacy. Otherwise, leave empty."
}}"""

        # Make API call
        print(colored(f"Exploring cultural year {context.total_years}", "yellow"))
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
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True) 