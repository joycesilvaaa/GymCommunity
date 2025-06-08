# -*- coding: utf-8 -*-
from datetime import datetime

from pydantic import BaseModel


class HealthGoldSchema(BaseModel):
    id: int
    goal_type: str
    start_weight: float
    goal_weight: float
    end_weight: float
    start_date: datetime
    end_date: datetime



class CreateHealthGold(BaseModel):
    goal_type: str
    start_weight: float
    goal_weight: float
    end_weight: float
    start_date: datetime
    end_date: datetime


class UpdateHealthGold(BaseModel):
    goal_type: str | None = None
    start_weight: float | None = None
    goal_weight: float | None = None
    end_weight: float | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
