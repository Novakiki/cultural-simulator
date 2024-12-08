"""Prompt templates for the Cultural Life Simulator"""

import json

def get_simulation_prompt(context, rules):
    return f"""Given the following context about a person's cultural upbringing:

Cultural Background: {context.initial_choice}
Current Age: {context.current_stats.age}
Years in Journey: {context.total_years}

Previous Events: {json.dumps([h.dict() for h in context.choice_history], indent=2)}

Consider how this cultural background influences:
1. Daily Life: Routines, practices, and expectations shaped by cultural values
2. Decision Making: How cultural beliefs guide choices and priorities
3. Relationships: Family dynamics, community connections, and social expectations
4. Personal Growth: Balance between tradition and individual development
5. Challenges: Cultural-specific obstacles and how they're navigated

Important Guidelines:
- Events should reflect authentic cultural experiences
- Show both internal growth and external influences
- Include cultural celebrations, traditions, and challenges
- Demonstrate how cultural values shape responses to situations
- Balance universal experiences with cultural specificity

Rules and Constraints:
{json.dumps(rules, indent=2)}

Generate the next year of their life, showing how their cultural background influences their experiences and choices.

Response must be in this JSON format:
{{
    "story": "A culturally authentic description of what happened this year",
    "stats_changes": {{
        "stat_name": "number between -2 and +2"
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
