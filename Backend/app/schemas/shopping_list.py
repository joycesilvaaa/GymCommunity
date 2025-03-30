# -*- coding: utf-8 -*-
from pydantic import BaseModel, field_validator
from datetime import datetime

class Options(BaseModel):
    name: str
    quantity: int


class CreateShoppingList(BaseModel):
    diet_id: int | None = None
    user_id: int | None = None
    title: str
    options: list[dict[str, str]] = []

    @field_validator("*", mode="before")
    @classmethod
    def remove_none(cls, value):
        return value if value is not None else None 


class ListShoppingPreviouns(BaseModel):
    id: int
    last_update: datetime
    title: str


class ShoppingListData(BaseModel):
    id: int
    diet_id: int | None = None
    title: str
    last_update: datetime
    options: list[Options] = []
