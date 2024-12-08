"""Configuration for the Cultural Life Simulator"""

SIMULATION_RULES = {
    "event_distribution": {
        "challenging": 0.4,
        "neutral": 0.3,
        "positive": 0.3
    },
    "stat_changes": {
        "challenging": {"min": -5, "max": -2},
        "neutral": {"min": -1, "max": 1},
        "positive": {"min": 1, "max": 3}
    },
    "thematic_changes": {
        "family_conflicts": {
            "familyTies": {"min": -4, "max": -2},
            "tradition": {"min": -3, "max": -1}
        },
        # ... other thematic changes
    },
    "age_stages": {
        "5-12": ["family dynamics", "school adjustment", "peer relationships"],
        "13-17": ["identity formation", "cultural conflicts", "peer pressure"],
        "18-25": ["independence", "tradition vs. modernity", "career choices"],
        "26+": ["family obligations", "community expectations", "cultural transmission"]
    }
} 