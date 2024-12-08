"""Configuration for the Cultural Life Simulator"""

SIMULATION_RULES = {
    "cultural_milestones": {
        "Mormon Family 🏠": {
            "early_years": ["First Family Home Evening", "Primary Classes", "Baptism Preparation"],
            "middle_years": ["First Temple Visit", "Youth Programs", "Seminary Classes"],
            "teen_years": ["Priesthood/Young Women", "Mission Preparation", "Leadership Roles"]
        },
        "Jewish Family ✡️": {
            "early_years": ["First Shabbat Participation", "Hebrew School", "Torah Reading"],
            "middle_years": ["Bar/Bat Mitzvah Prep", "Jewish Youth Groups", "Holiday Traditions"],
            "teen_years": ["Israel Programs", "Community Leadership", "Jewish Studies"]
        },
        "Muslim Family 🕌": {
            "early_years": ["First Ramadan Fast", "Quran Recitation", "Islamic Studies"],
            "middle_years": ["Prayer Rituals", "Community Service", "Cultural Festivals"],
            "teen_years": ["Religious Leadership", "Hajj Discussions", "Identity Development"]
        },
        "Buddhist Family 🕉️": {
            "early_years": ["Temple Visits", "Meditation Introduction", "Basic Teachings"],
            "middle_years": ["Mindfulness Practice", "Community Service", "Cultural Studies"],
            "teen_years": ["Advanced Teachings", "Retreat Participation", "Personal Practice"]
        },
        "Hindu Family 🕉️": {
            "early_years": ["Puja Participation", "Festival Celebrations", "Sanskrit Learning"],
            "middle_years": ["Temple Activities", "Cultural Dance/Music", "Vedic Studies"],
            "teen_years": ["Philosophical Discussions", "Community Leadership", "Tradition Practice"]
        },
        "Secular Household 🌎": {
            "early_years": ["Science Fairs", "Nature Exploration", "Cultural Festivals"],
            "middle_years": ["Critical Thinking Projects", "Community Service", "Arts & Music"],
            "teen_years": ["Social Activism", "Philosophy Discussions", "Personal Projects"]
        },
        "Native American Family 🪶": {
            "early_years": ["First Powwow", "Language Learning", "Traditional Stories"],
            "middle_years": ["Tribal Ceremonies", "Cultural Crafts", "Nature Connection"],
            "teen_years": ["Tribal Leadership", "Heritage Projects", "Community Roles"]
        },
        "Japanese Family 🗾": {
            "early_years": ["First Shichi-Go-San", "Tea Ceremony Introduction", "Festival Participation"],
            "middle_years": ["Martial Arts", "Calligraphy Practice", "Cultural School Events"],
            "teen_years": ["Coming of Age Day", "Traditional Arts", "Cultural Identity"]
        },
        "African Family 🌍": {
            "early_years": ["Naming Ceremonies", "Storytelling Traditions", "Community Festivals"],
            "middle_years": ["Cultural Dance", "Traditional Music", "Heritage Learning"],
            "teen_years": ["Rites of Passage", "Community Service", "Cultural Leadership"]
        },
        "Greek Orthodox Family ☦️": {
            "early_years": ["First Church Service", "Name Day Celebrations", "Religious Education"],
            "middle_years": ["Fasting Traditions", "Cultural Festivals", "Church Youth Groups"],
            "teen_years": ["Religious Studies", "Community Leadership", "Cultural Preservation"]
        },
        "Chinese Family 🏮": {
            "early_years": ["Red Egg Ceremony", "Lunar New Year", "Language School"],
            "middle_years": ["Cultural Performances", "Traditional Arts", "Festival Roles"],
            "teen_years": ["Family Traditions", "Cultural Identity", "Community Events"]
        },
        "Mexican Family 🇲🇽": {
            "early_years": ["First Posada", "Family Traditions", "Cultural Celebrations"],
            "middle_years": ["Quinceañera Preparation", "Folk Dance", "Cultural Studies"],
            "teen_years": ["Family Responsibilities", "Cultural Pride", "Community Events"]
        }
    },

    "life_events": {
        "cultural_specific": {
            "Mormon Family 🏠": {
                "positive": ["Family Home Evening Success", "Temple Visits", "Ward Activities"],
                "challenging": ["Non-Member Friends", "Word of Wisdom Questions", "Mission Decisions"]
            },
            "Jewish Family ✡️": {
                "positive": ["Successful Seder", "Bar/Bat Mitzvah Achievement", "Shabbat Celebrations"],
                "challenging": ["Kosher Diet at School", "Holiday Conflicts", "Identity Questions"]
            },
            "Muslim Family 🕌": {
                "positive": ["Ramadan Family Meals", "Eid Celebrations", "Community Recognition"],
                "challenging": ["Prayer Time at School", "Dietary Restrictions", "Cultural Misconceptions"]
            },
            "Buddhist Family 🕉️": {
                "positive": ["Meditation Achievements", "Temple Celebrations", "Mindfulness Practice"],
                "challenging": ["Materialism Pressure", "Non-Violence Choices", "Cultural Understanding"]
            },
            "Native American Family 🪶": {
                "positive": ["Tribal Recognition", "Cultural Achievement", "Community Celebration"],
                "challenging": ["Cultural Preservation", "Modern Integration", "Identity Balance"]
            }
        },
        "education": {
            "cultural_context": {
                "academic_focus": ["Test Preparation", "Cultural Studies", "Language Learning"],
                "social_integration": ["Cultural Exchange", "Identity Navigation", "Peer Understanding"]
            }
        }
    },

    "stat_influences": {
        "faith": {
            "increase_triggers": ["Religious Ceremonies", "Family Prayer", "Community Service"],
            "decrease_triggers": ["Peer Conflicts", "Unanswered Questions", "Cultural Differences"]
        },
        "familyTies": {
            "strengthen": ["Family Traditions", "Shared Activities", "Open Discussions"],
            "strain": ["Value Conflicts", "Time Pressures", "Communication Issues"]
        },
        "cultural_values": {
            "Mormon Family 🏠": {
                "faith_importance": 1.9,
                "family_focus": 1.8,
                "community_emphasis": 1.5,
                "education_value": 1.3
            },
            "Jewish Family ✡️": {
                "tradition_importance": 1.7,
                "education_focus": 1.9,
                "family_bonds": 1.6,
                "community_support": 1.5
            },
            "Muslim Family 🕌": {
                "faith_devotion": 1.5,
                "community_unity": 1.4,
                "moral_values": 1.3
            },
            "Buddhist Family 🕉️": {
                "mindfulness_focus": 1.8,
                "harmony_emphasis": 1.7,
                "wisdom_pursuit": 1.6,
                "non_attachment": 1.5
            },
            "Native American Family 🪶": {
                "nature_connection": 1.9,
                "tribal_unity": 1.8,
                "ancestral_wisdom": 1.7,
                "spiritual_harmony": 1.6
            },
            "Japanese Family 🗾": {
                "group_harmony": 1.9,
                "respect_hierarchy": 1.7,
                "academic_excellence": 1.6,
                "tradition_adherence": 1.5
            },
            "Chinese Family 🏮": {
                "family_honor": 1.8,
                "filial_piety": 1.9,
                "academic_success": 1.7,
                "collective_harmony": 1.6
            },
            "Mexican Family 🇲🇽": {
                "family_unity": 1.5,
                "cultural_pride": 1.4,
                "tradition_respect": 1.3
            },
            "Secular Household 🌎": {
                "critical_thinking": 1.7,
                "personal_growth": 1.6,
                "social_awareness": 1.5,
                "scientific_mindset": 1.6
            }
        }
    }
} 