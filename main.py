from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from termcolor import colored
from config.prompts import get_simulation_prompt
from config.simulation_config import SIMULATION_RULES
from models.schemas import Stats, ChoiceHistory, SimulationContext, SimulationResponse
from services.ai_service import AIService

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
async def simulate_year(context: SimulationContext) -> SimulationResponse:
    try:
        print(colored(f"Received request with context: {context.dict()}", "cyan"))
        if not ai_service.client.api_key:
            raise ValueError("OpenAI API key not found in environment variables")
        
        # Updated prompt for cultural simulation
        prompt = get_simulation_prompt(context, SIMULATION_RULES)
        
        # Make API call
        print(colored(f"Exploring cultural year {context.total_years}", "yellow"))
        response = await ai_service.generate_year_simulation(context, SIMULATION_RULES)
        
        # Convert to Pydantic model for validation
        simulation_response = SimulationResponse(**response)
        
        return simulation_response

    except Exception as e:
        print(colored(f"Detailed error in simulation: {str(e)}", "red"))
        import traceback
        print(colored(f"Traceback: {traceback.format_exc()}", "red"))
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )

if __name__ == "__main__":
    import uvicorn
    print(colored("Starting development server...", "yellow"))
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True) 