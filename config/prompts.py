"""Prompt templates for the Cultural Life Simulator"""

import json
from config.simulation_config import SIMULATION_RULES

def get_simulation_prompt(context, rules):
    return f"""Given the following context about a person's cultural upbringing:
Cultural Background: {context.initial_choice}
Current Age: {context.current_stats.age}
Years in Journey: {context.total_years}

+ Current Stats Analysis:
+ Faith ({context.current_stats.faith}/100): Influences tradition and community bonds
+ Family Ties ({context.current_stats.familyTies}/100): Core cultural foundation
+ Education ({context.current_stats.education}/100): Affects knowledge and independence
+ 
+ Important Stat Relationships:
+ - High faith affects tradition and community positively
+ - Strong family ties can limit independence but boost cultural knowledge
+ - Education increases independence and cultural understanding
+ 
+ Age-Appropriate Development:
+ - Changes should be gradual ({'-2 to +2' if context.current_stats.age < 13 else '-3 to +3'})
+ - Focus on {SIMULATION_RULES['age_appropriate_changes']['child' if context.current_stats.age < 13 else 'teen']['focus_stats']}

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
