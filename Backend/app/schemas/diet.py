# -*- coding: utf-8 -*-
from datetime import datetime

from pydantic import BaseModel


class Option(BaseModel):
    name: str
    quantity: int
    type: str


class Menu(BaseModel):
    title: str
    options: list[Option] = []


class DietData(BaseModel):
    id: int
    user_id: int
    title: str
    description: str
    menu: list[Menu] = []
    is_public: bool
    months_valid: int


class ListDietActual(BaseModel):
    id: int
    start_date: datetime
    end_date: datetime


class CreateDiet(BaseModel):
    title: str
    description: str
    menu: list[Menu] = []
    is_public: bool
    months_valid: int


class AllFreeDietQuantity(BaseModel):
    quantity: int | None = 0


class ExpiringDiets(BaseModel):
    id: int
    title: str
    user_id: int
    days_remaining: int


class AllFreeDiets(BaseModel):
    id: int
    title: str
    description: str


class DietsByProfissional(BaseModel):
    id: int
    title: str
    description: str


class UpdateDiet(BaseModel):
    title: str
    description: str
    menu: list[Menu] = []
    is_public: bool | None = False
    months_valid: int
    last_update: datetime | None = datetime.now()


class LastFinishedDiet(BaseModel):
    id: int
    title: str
    end_date: datetime


class AllExpiredDiets(BaseModel):
    id: int
    title: str
    description: str
    user_id: int
    diet_id: int
    days_remaining: int
