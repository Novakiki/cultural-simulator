"""AI Service for Cultural Life Simulator"""
from openai import AsyncOpenAI
from termcolor import colored
import json
import os
from config.life_phases import get_life_phase, get_phase_appropriate_events

class AIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.model = "gpt-4o-mini"
        self.temperature = 0.7
        # Define maximum yearly changes for different stat types
        self.max_yearly_changes = {
            'faith': 5,           # Faith changes tend to be gradual
            'familyTies': 5,      # Family relationships change slowly
            'communityBonds': 5,  # Community bonds change gradually
            'education': 8,       # Education can progress more quickly
            'culturalKnowledge': 6,
            'independence': 5,    # Independence grows gradually
            'tradition': 4,       # Traditional values change slowly
            'exploration': 6      # Exploration can vary more
        }

    def _apply_diminishing_returns(self, value: int, change: int) -> int:
        """Apply diminishing returns for stats over 90."""
        if value > 90:
            # Reduce the change based on how close to 100 we are
            reduction_factor = (value - 90) / 10  # Will be between 0 and 1
            change = change * (1 - reduction_factor)
        return round(change)

    def _apply_growth_limits(self, stat_name: str, original_value: int, new_value: int) -> int:
        """Apply growth rate limits to stat changes."""
        max_change = self.max_yearly_changes.get(stat_name, 5)  # Default to 5 if stat not specified
        change = new_value - original_value
        # Apply diminishing returns for high values
        if change > 0:  # Only apply to positive changes
            change = self._apply_diminishing_returns(original_value, change)
        limited_change = max(min(change, max_change), -max_change)
        return max(0, min(100, original_value + limited_change))

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
            
            # Apply growth limits to each stat
            for key, value in result['updated_stats'].items():
                if key not in ['age', 'alive']:
                    original_value = getattr(context.current_stats, key)
                    result['updated_stats'][key] = self._apply_growth_limits(key, original_value, value)
            
            result['story'] = result['story'].replace(
                f"{current_age + 1}-year-old",
                f"{current_age}-year-old"
            )
            return result
        except Exception as e:
            print(colored(f"AI Service Error: {str(e)}", "red"))
            raise

    def _build_prompt(self, context, rules):
        # Get phase-appropriate context
        phase_context = get_phase_appropriate_events(
            context.current_stats.age,
            context.initial_choice
        )
        
        # Build a rich context for the AI
        return f"""You are simulating a year in the life of someone from a specific cultural background.

Current Context:
- Cultural Background: {context.initial_choice}
- Current Age: {context.current_stats.age}
- Life Phase: {phase_context['current_phase']}
- Years in Journey: {context.total_years}

Developmental Stage Information:
- Key Influences: {', '.join(phase_context['key_influences'])}
- Possible Milestone Events: {', '.join(phase_context['possible_events'])}
- Development Focus Areas: {', '.join(phase_context['developmental_focus'])}
- Age-Appropriate Challenges: {', '.join(phase_context['challenges'])}

Current Stats:
{json.dumps(context.current_stats.dict(), indent=2)}

Previous History:
{self._format_history(context.choice_history)}

Important Guidelines:
1. Focus on age-appropriate experiences and challenges
2. Consider cultural background's influence on each event
3. Balance positive and negative experiences
4. Include at least one significant event from the possible milestones
5. Show how key influences affect decisions and outcomes
6. Maintain realistic progression of stats based on events
7. All stats must stay between 0 and 100
8. Stats should change gradually:
   - Faith: max ±5 per year
   - Family Ties: max ±5 per year
   - Community Bonds: max ±7 per year
   - Education: max ±8 per year
   - Cultural Knowledge: max ±6 per year
   - Independence: max ±5 per year
   - Tradition: max ±4 per year
   - Exploration: max ±6 per year

Please generate a response in JSON format following this structure:
{{
    "story": "A culturally authentic and age-appropriate description of what happened this year",
    "stats_changes": {{
        "stat_name": "+1 or -1 format"
    }},
    "updated_stats": {{
        "age": "integer",
        "faith": "integer (0-100)",
        "familyTies": "integer (0-100)",
        "communityBonds": "integer (0-100)",
        "education": "integer (0-100)",
        "culturalKnowledge": "integer (0-100)",
        "independence": "integer (0-100)",
        "tradition": "integer (0-100)",
        "exploration": "integer (0-100)",
        "alive": "boolean"
    }}
}}"""

    def _format_history(self, history):
        if not history:
            return "No previous history."
        
        formatted_history = []
        for event in history:
            formatted_history.append(
                f"Age {event.year}: {event.choice}\n"
                f"What happened: {event.story}\n"
                f"Changes: {json.dumps(event.stats_changes, indent=2)}\n"
            )
        return "\n".join(formatted_history) 