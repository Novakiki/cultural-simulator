"""Configuration for life phases and their characteristics"""

LIFE_PHASES = {
    "Early Childhood": {
        "age_range": (5, 12),
        "key_influences": [
            "family dynamics",
            "early education",
            "cultural exposure",
            "peer interactions",
            "religious/spiritual introduction"
        ],
        "milestone_events": [
            "first day of school",
            "religious ceremonies",
            "family traditions",
            "making first friends",
            "learning cultural practices"
        ],
        "developmental_focus": [
            "basic identity formation",
            "understanding of values",
            "cultural awareness",
            "emotional development",
            "social skills"
        ],
        "challenges": [
            "adapting to school environment",
            "understanding cultural differences",
            "family expectations",
            "peer acceptance"
        ]
    },
    "Adolescence": {
        "age_range": (13, 18),
        "key_influences": [
            "peer groups",
            "education system",
            "cultural identity",
            "media exposure",
            "family traditions vs modern life"
        ],
        "milestone_events": [
            "coming of age ceremonies",
            "cultural conflicts",
            "academic achievements",
            "first romantic interest",
            "identity questioning"
        ],
        "developmental_focus": [
            "independence building",
            "cultural values examination",
            "social identity formation",
            "future aspirations",
            "belief system development"
        ],
        "challenges": [
            "cultural identity conflicts",
            "peer pressure",
            "family expectations vs personal desires",
            "academic pressure"
        ]
    },
    "Young Adult": {
        "age_range": (19, 25),
        "key_influences": [
            "higher education",
            "career choices",
            "relationships",
            "independent living",
            "cultural community"
        ],
        "milestone_events": [
            "college/work decisions",
            "leaving home",
            "serious relationships",
            "cultural independence",
            "financial independence"
        ],
        "developmental_focus": [
            "life direction",
            "cultural integration",
            "personal values solidification",
            "relationship building",
            "career development"
        ],
        "challenges": [
            "balancing tradition with modernity",
            "career vs cultural expectations",
            "relationship choices",
            "independent decision making"
        ]
    }
}

def get_life_phase(age: int) -> dict:
    """Get the life phase details for a given age."""
    for phase, details in LIFE_PHASES.items():
        if details["age_range"][0] <= age <= details["age_range"][1]:
            return {"phase": phase, **details}
    return None

def get_phase_appropriate_events(age: int, cultural_background: str) -> dict:
    """Get appropriate events and influences for the current age and cultural background."""
    phase_details = get_life_phase(age)
    if not phase_details:
        return None
    
    return {
        "current_phase": phase_details["phase"],
        "possible_events": phase_details["milestone_events"],
        "key_influences": phase_details["key_influences"],
        "developmental_focus": phase_details["developmental_focus"],
        "challenges": phase_details["challenges"]
    } 