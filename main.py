from fastapi import FastAPI, Request, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from termcolor import colored
from config.prompts import get_simulation_prompt
from config.simulation_config import SIMULATION_RULES
from models.schemas import Stats, ChoiceHistory, SimulationContext, SimulationResponse
from services.ai_service import AIService
from typing import Dict, Any
import asyncio
import traceback

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
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/how-it-works", response_class=HTMLResponse)
async def how_it_works(request: Request):
    try:
        return templates.TemplateResponse(
            "how_it_works.html",
            {"request": request}
        )
    except Exception as e:
        print(colored(f"Error rendering template: {str(e)}", "red"))
        raise HTTPException(status_code=500, detail=str(e))

def validate_simulation_response(response: Dict[str, Any]) -> bool:
    """Validate the simulation response has all required fields."""
    required_fields = {'updated_stats', 'story', 'stats_changes'}
    if not all(field in response for field in required_fields):
        return False
    if not isinstance(response['updated_stats'], dict):
        return False
    if not isinstance(response['story'], str):
        return False
    if not isinstance(response['stats_changes'], dict):
        return False
    return True

@app.post("/api/simulate_year")
async def simulate_year(context: SimulationContext) -> SimulationResponse:
    try:
        print(colored(f"Received request with context: {context.dict()}", "cyan"))
        
        # Validate API key
        if not ai_service.client.api_key:
            raise HTTPException(
                status_code=500,
                detail="OpenAI API key not found in environment variables"
            )
        
        # Validate input context
        if not context.current_stats or not context.initial_choice:
            raise HTTPException(
                status_code=422,
                detail="Invalid simulation context: missing required fields"
            )
        
        # Set timeout for simulation
        try:
            # Updated prompt for cultural simulation
            prompt = get_simulation_prompt(context, SIMULATION_RULES)
            
            # Make API call with timeout
            print(colored(f"Exploring cultural year {context.total_years}", "yellow"))
            response = await asyncio.wait_for(
                ai_service.generate_year_simulation(context, SIMULATION_RULES),
                timeout=15.0  # 15 second timeout
            )
            
            # Validate response structure
            if not validate_simulation_response(response):
                raise HTTPException(
                    status_code=500,
                    detail="Invalid response format from AI service"
                )
            
            # Convert to Pydantic model for validation
            simulation_response = SimulationResponse(**response)
            
            return simulation_response

        except asyncio.TimeoutError:
            raise HTTPException(
                status_code=504,
                detail="Simulation request timed out"
            )

    except HTTPException as he:
        print(colored(f"HTTP error in simulation: {str(he)}", "red"))
        raise he
    except Exception as e:
        print(colored(f"Detailed error in simulation: {str(e)}", "red"))
        print(colored(f"Traceback: {traceback.format_exc()}", "red"))
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    print(colored("Starting development server...", "yellow"))
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True) 