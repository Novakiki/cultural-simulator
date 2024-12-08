"""AI Service for Cultural Life Simulator"""
from openai import AsyncOpenAI
from termcolor import colored
import json
import os
from typing import Dict, Any
from models.schemas import Stats, SimulationContext

class AIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4o-mini"
        self.temperature = 0.7
        self.pendingRequests = new Map()
        self.debounceTime = 300

    def validate_stats(self, stats: Stats, cultural_values: Dict[str, Any]) -> None:
        """Validate stats against cultural values and constraints"""
        try:
            # Check for cultural consistency
            if "faith" in cultural_values and stats.faith < 20:
                print(colored(f"Warning: Low faith ({stats.faith}) for culture emphasizing faith", "yellow"))
            
            # Validate stat relationships
            if stats.tradition > 80 and stats.exploration > 80:
                print(colored("Warning: Unusually high values for both tradition and exploration", "yellow"))
            
            # Check for balanced development
            total_stats = sum([
                stats.faith, stats.familyTies, stats.education,
                stats.culturalKnowledge, stats.independence, stats.tradition
            ])
            if total_stats / 6 > 90:
                print(colored("Warning: Stats seem unrealistically high overall", "yellow"))
        except Exception as e:
            print(colored(f"Stat validation warning: {str(e)}", "yellow"))

    async def generate_year_simulation(self, context: SimulationContext, rules: Dict[str, Any]):
        try:
            # Validate current stats
            cultural_values = rules["stat_influences"]["cultural_values"].get(
                context.initial_choice, {}
            )
            self.validate_stats(context.current_stats, cultural_values)

            prompt = self._build_prompt(context, rules)
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[{
                    "role": "user",
                    "content": f"{prompt}\nPlease provide your response in JSON format."
                }],
                response_format={"type": "json_object"},
                temperature=self.temperature
            )

            result = json.loads(response.choices[0].message.content)
           
            # Validate response stats
            if "updated_stats" in result:
                self.validate_stats(Stats(**result["updated_stats"]), cultural_values)
            
            # Ensure story reflects cultural values
            if not any(value.lower() in result["story"].lower() 
                      for value in cultural_values.keys()):
                print(colored("Warning: Story may not reflect cultural values strongly enough", "yellow"))

            return result
        except Exception as e:
            print(colored(f"AI Service Error: {str(e)}", "red"))
            raise