from fastapi import FastAPI, Request, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from termcolor import colored
from config.prompts import get_simulation_prompt
from config.simulation_config import SIMULATION_RULES
from models.schemas import Stats, ChoiceHistory, SimulationContext, SimulationResponse
from services.ai_service import AIService
import os

print(colored("Starting Cultural Life Simulator...", "cyan"))

app = FastAPI(title="Cultural Life Simulator")
ai_service = AIService()

try:
    app.mount("/static", StaticFiles(directory="static"), name="static")
    print(colored("Static files mounted successfully", "green"))
except Exception as e:
    print(colored(f"Error mounting static files: {str(e)}", "red"))

templates = Jinja2Templates(directory="templates")

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
async def simulate_year(context: SimulationContext):
    try:
        print(colored(f"Received context: {context.dict()}", "cyan"))
        if not ai_service.client.api_key:
            raise ValueError("OpenAI API key not found in environment variables")
        
        # Updated prompt for cultural simulation
        prompt = get_simulation_prompt(context, SIMULATION_RULES)
        
        # Get cultural values for this background
        cultural_values = SIMULATION_RULES["stat_influences"]["cultural_values"].get(
            context.initial_choice, 
            SIMULATION_RULES["stat_influences"]["cultural_values"]["Secular Household 🌎"]  # default
        )
        
        # Apply cultural weights to the simulation
        weighted_context = apply_cultural_weights(context, cultural_values)
        
        # Make API call
        print(colored(f"Exploring cultural year {context.total_years}", "yellow"))
        response = await ai_service.generate_year_simulation(weighted_context, SIMULATION_RULES)
        
        # Convert to Pydantic model for validation
        simulation_response = SimulationResponse(**response)
        
        return simulation_response

    except Exception as e:
        print(colored(f"Detailed error in simulation: {str(e)}", "red"))
        print(colored(f"SIMULATION_RULES structure: {SIMULATION_RULES.keys()}", "yellow"))
        raise HTTPException(status_code=422, detail=str(e))

def apply_cultural_weights(context, cultural_values):
    """Apply cultural value weights to the simulation context"""
    weighted_context = context.copy(deep=True)
    
    # Adjust stats based on cultural values
    for value, weight in cultural_values.items():
        if "faith" in value.lower():
            weighted_context.current_stats.faith *= weight
        elif "family" in value.lower():
            weighted_context.current_stats.familyTies *= weight
        elif "education" in value.lower():
            weighted_context.current_stats.education *= weight
        # Add more mappings as needed
    
    return weighted_context

if __name__ == "__main__":
    import uvicorn
    print(colored("Starting development server...", "yellow"))
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True) 