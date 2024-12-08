"""Prompt templates for the Cultural Life Simulator"""

import json
from config.simulation_config import SIMULATION_RULES

def get_simulation_prompt(context, rules):
    age = context.current_stats.age
    culture = context.initial_choice
    stage = "early_years" if age < 8 else "middle_years" if age < 13 else "teen_years"
    
    milestones = rules["cultural_milestones"][culture][stage]
    life_events = rules["life_events"]
    cultural_values = rules["stat_influences"]["cultural_values"][culture]
    
    return f"""Given the following context about a person's cultural upbringing:
Cultural Background: {culture}
Current Age: {age}
Years in Journey: {context.total_years}

Core Cultural Values (Priority Order):
{json.dumps(cultural_values, indent=2)}
These values should influence decisions, reactions, and growth.

Available Cultural Milestones for this age:
{json.dumps(milestones, indent=2)}

Cultural Context:
- Each culture has unique approaches to challenges
- Consider how {culture} typically handles:
  * Family conflicts
  * Educational choices
  * Community interactions
  * Personal growth

Potential Life Events:
Family Events: {json.dumps(life_events['cultural_specific'].get(culture, {}), indent=2)}
Educational Events: {json.dumps(life_events['education']['cultural_context'], indent=2)}

Previous Events: {json.dumps([h.dict() for h in context.choice_history], indent=2)}

Important Guidelines:
- This story describes events at age {age}
- Reference previous events for continuity
- Maintain consistent personality traits
+ - Balance challenges with positive growth
+ - Show both cultural preservation and adaptation
+ - Include supportive family moments alongside conflicts
+ - Demonstrate resilience and learning from difficulties
+ - Highlight moments of cultural pride and understanding
+ - Show gradual, realistic character development

Rules and Constraints:
{json.dumps(rules, indent=2)}

Generate the next year of their life, considering:
- Age-appropriate cultural and religious practices
- Family dynamics and expectations
- Cultural challenges and identity conflicts
- Generational differences and tensions
+ - Moments of family unity and understanding
+ - Cultural celebrations and shared experiences
+ - Personal achievements and growth
+ - Positive community connections

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
    }}
}}"""
