"""Configuration for the Cultural Life Simulator"""

SIMULATION_RULES = {
    "event_distribution": {
        "challenging": 0.30,
        "neutral": 0.45,
        "positive": 0.25
    },
    "stat_changes": {
        "challenging": {"min": -2, "max": -1},
        "neutral": {"min": -1, "max": 1},
        "positive": {"min": 1, "max": 2}
    },
    "thematic_changes": {
        "family_conflicts": {
            "familyTies": {"min": -2, "max": -1},
            "tradition": {"min": -2, "max": -1}
        },
        "cultural_adaptation": {
            "culturalKnowledge": {"min": 1, "max": 2},
            "exploration": {"min": 1, "max": 2}
        },
        "identity_formation": {
            "independence": {"min": 1, "max": 2},
            "faith": {"min": -1, "max": 1}
        },
        "community_engagement": {
            "communityBonds": {"min": 1, "max": 2},
            "culturalKnowledge": {"min": 1, "max": 2}
        },
        "educational_milestones": {
            "education": {"min": 1, "max": 2},
            "independence": {"min": 1, "max": 2}
        },
        "cultural_challenges": {
            "faith": {"min": -1, "max": 1},
            "tradition": {"min": -1, "max": 1},
            "exploration": {"min": 1, "max": 2}
        },
        "family_bonding": {
            "familyTies": {"min": 1, "max": 2},
            "communityBonds": {"min": 1, "max": 2}
        }
    },
    "age_stages": {
        "5-12": [
            "family bonding",
            "early education",
            "cultural exposure",
            "peer friendships",
            "basic traditions",
            "cultural curiosity",
            "family values"
        ],
        "13-17": [
            "identity exploration",
            "cultural questioning",
            "peer influence",
            "family dynamics",
            "educational goals",
            "value conflicts",
            "independence growth"
        ],
        "18-25": [
            "independence",
            "cultural values",
            "life choices",
            "community role",
            "career path",
            "belief systems",
            "personal identity"
        ],
        "26+": [
            "cultural preservation",
            "family leadership",
            "community contribution",
            "tradition passing",
            "life balance",
            "cultural synthesis",
            "legacy building"
        ]
    }
} 