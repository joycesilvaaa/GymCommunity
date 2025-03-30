# -*- coding: utf-8 -*-
from datetime import datetime

from pydantic import BaseModel


class Options(BaseModel):
    name: str
    quantity: int


class Meal(BaseModel):
    name: str
    options: list[Options] = []


class Menu(BaseModel):
    options: list[Meal] = []


class DietData(BaseModel):
    id: int
    menu: Menu
    title: str
    description: str
    start_date: datetime
    end_date: datetime


class ListDietActual(BaseModel):
    id: int
    start_date: datetime
    end_date: datetime


class CreateDiet(BaseModel):
    title: str
    description: str
    menu: Menu
    is_public: bool | None = False
    months_valid: int


class AllFreeDietQuantity(BaseModel):
    quantity: int | None = 0


class ExpiringDiets(BaseModel):
    id: int
    title: str
    user_id: int
    days_remaining: int


class UpdateDiet(BaseModel):
    title: str
    description: str
    menu: Menu
    is_public: bool | None = False
    months_valid: int
    last_update: datetime | None = datetime.now()


class LastFinishedDiet(BaseModel):
    id: int
    title: str
    end_date: datetime
