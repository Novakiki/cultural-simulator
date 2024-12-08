"""Pydantic models for the Cultural Life Simulator"""
from pydantic import BaseModel
from typing import Dict, List

class Stats(BaseModel):
    age: int
    faith: int
    familyTies: int
    communityBonds: int
    education: int
    culturalKnowledge: int
    independence: int
    tradition: int
    exploration: int
    alive: bool

class ChoiceHistory(BaseModel):
    year: int
    choice: str
    story: str
    stats_changes: Dict[str, str]

class SimulationContext(BaseModel):
    current_stats: Stats
    choice_history: List[ChoiceHistory]
    total_years: int
    initial_choice: str

class SimulationResponse(BaseModel):
    story: str
    stats_changes: Dict[str, str]
    updated_stats: Stats 