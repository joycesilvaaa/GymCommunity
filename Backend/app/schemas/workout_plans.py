# -*- coding: utf-8 -*-
from datetime import datetime

from pydantic import BaseModel


class Options(BaseModel):
    name: str
    repetitions: str
    rest_time: int


class Plan(BaseModel):
    title: str
    exercises: list[Options]


class WorkoutPlanData(BaseModel):
    id: int
    plan: Plan
    title: str
    description: str
    start_date: datetime
    end_date: datetime


class ListWorkoutPlanActual(BaseModel):
    id: int
    start_date: datetime
    end_date: datetime


class CreateWorkoutPlan(BaseModel):
    title: str
    description: str
    plans: list[Plan] = []
    is_public: bool | None = False
    months_valid: int
    days_per_week: int
    type: str 


class AllFreeWorkoutPlanQuantity(BaseModel):
    quantity: int = 0


class ExpiringWorkoutPlans(BaseModel):
    id: int
    title: str
    user_id: int
    workout_id: int


class UpdateWorkoutPlan(BaseModel):
    title: str
    description: str
    plan: Plan
    is_public: bool | None = False
    months_valid: int
    last_update: datetime | None = datetime.now()


class LastFinishedWorkoutPlan(BaseModel):
    id: int
    title: str
    end_date: datetime

class PreviousWorkoutPlan(BaseModel):
    id: int
    title: str
    description: str
    professional_name: str | None = None