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

    def _build_prompt(self, context, rules):
        """Build the prompt using the template from config"""
        from config.prompts import get_simulation_prompt
        return get_simulation_prompt(context, rules)

    def validate_and_adjust_changes(self, response, context, rules):
        """Enforce stat change rules based on age and relationships"""
        changes = response['stats_changes']
        age = context.current_stats.age
        stage = 'child' if age < 13 else 'teen'
        
        # Get age-appropriate limits
        max_change = rules['age_appropriate_changes'][stage]['max_change']
        focus_stats = rules['age_appropriate_changes'][stage]['focus_stats']
        
        # Count and limit changes
        positive_changes = sum(1 for v in changes.values() if int(v) > 0)
        negative_changes = sum(1 for v in changes.values() if int(v) < 0)
        
        # Apply relationship effects
        for stat, value in changes.items():
            if stat in rules['stat_relationships']:
                rel = rules['stat_relationships'][stat]
                # Affect related stats
                for affected in rel['affects']:
                    if affected not in changes:
                        changes[affected] = str(int(value) // 2)  # Half effect
        
        # Enforce limits
        for stat, value in changes.items():
            value = int(value)
            # Limit by age-appropriate max
            value = max(min(value, max_change), -max_change)
            # Ensure stat stays within bounds
            new_value = context.current_stats[stat] + value
            if new_value < rules['stat_limits']['min']:
                value = rules['stat_limits']['min'] - context.current_stats[stat]
            elif new_value > rules['stat_limits']['max']:
                value = rules['stat_limits']['max'] - context.current_stats[stat]
            changes[stat] = str(value)
        
        return changes 

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
            # Validate and adjust stat changes
            result['stats_changes'] = self.validate_and_adjust_changes(result, context, rules)
            result['updated_stats']['age'] = context.current_stats.age + 1
            return result
        except Exception as e:
            print(colored(f"AI Service Error: {str(e)}", "red"))
            raise 