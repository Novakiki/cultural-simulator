"""Pydantic models for the Cultural Life Simulator"""
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Union

class Stats(BaseModel):
    age: int
    faith: int = Field(ge=0, le=100)
    familyTies: int = Field(ge=0, le=100)
    communityBonds: float = Field(ge=0, le=100)
    education: float = Field(ge=0, le=100)
    culturalKnowledge: float = Field(ge=0, le=100)
    independence: float = Field(ge=0, le=100)
    tradition: float = Field(ge=0, le=100)
    exploration: float = Field(ge=0, le=100)
    alive: bool

class CulturalWeights(BaseModel):
    """Model for cultural value weights"""
    values: Dict[str, float]
    description: Optional[str]

    def apply_to_stats(self, stats: Stats) -> Stats:
        """Apply cultural weights to stats"""
        weighted = Stats(**stats.dict())
        for value_name, weight in self.values.items():
            if "faith" in value_name.lower():
                weighted.faith = min(100, weighted.faith * weight)
            elif "family" in value_name.lower():
                weighted.familyTies = min(100, weighted.familyTies * weight)
            # Add other mappings
        return weighted

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
    cultural_weights: Optional[CulturalWeights] = None

    def copy(self, deep: bool = True) -> 'SimulationContext':
        """Create a deep copy with proper weight handling"""
        copied = super().copy(deep=deep)
        if self.cultural_weights:
            copied.current_stats = self.cultural_weights.apply_to_stats(copied.current_stats)
        return copied

class SimulationResponse(BaseModel):
    story: str
    stats_changes: Dict[str, str]
    updated_stats: Stats 