"""Prompt templates for the Cultural Life Simulator"""

import json

def get_simulation_prompt(context, rules):
    return f"""Given the following context about a person's cultural upbringing:
Cultural Background: {context.initial_choice}
Current Age: {context.current_stats.age}
Years in Journey: {context.total_years}

Previous Events: {json.dumps([h.dict() for h in context.choice_history], indent=2)}

Important Guidelines:
- This story describes events at age {context.current_stats.age}
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
