"""AI Service for Cultural Life Simulator"""
from openai import AsyncOpenAI
from termcolor import colored
import json
import os

class AIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4o-mini"
        self.temperature = 0.7

    async def generate_year_simulation(self, context, rules):
        try:
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
            current_age = context.current_stats.age
            result['updated_stats']['age'] = current_age + 1
            result['story'] = result['story'].replace(
                f"{current_age + 1}-year-old",
                f"{current_age}-year-old"
            )
            return result
        except Exception as e:
            print(colored(f"AI Service Error: {str(e)}", "red"))
            raise

    def _build_prompt(self, context, rules):
        return f"""Given the following context about a person's cultural upbringing:
Cultural Background: {context.initial_choice}
Current Age: {context.current_stats.age}
Years in Journey: {context.total_years}

+ Important: When writing the story, refer to the person as a {context.current_stats.age}-year-old, 
+ as this story describes what happened during their {context.current_stats.age}th year.

Rules and Constraints:
{json.dumps(rules, indent=2)}

Please generate a response in JSON format following this structure:
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
    }}
}}
""" 