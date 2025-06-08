# -*- coding: utf-8 -*-
from datetime import datetime

from pydantic import BaseModel, field_validator

from app.core.user_profile import UserPost, UserProfile


class UserLogin(BaseModel):
    id: int
    password: str


class CreateUser(BaseModel):
    name: str
    cpf: str
    email: str
    password: str
    user_profile: int = UserProfile.COMMON_USER.value
    birth_date: datetime
    professional_id: int | None = None

    @field_validator("password", mode="before")
    def set_password(cls, value: str) -> str:
        from app.modules.security import PasswordManager  # noqa:PLC0415

        return PasswordManager().password_hash(value)


class UpdateUser(BaseModel):
    cpf: str | None = None
    email: str | None = None
    password: str | None = None
    birth_date: datetime | None = None
    last_update: datetime | None = datetime.now()

    @field_validator("password", mode="before")
    def set_password(cls, value: str | None) -> str | None:
        from app.modules.security import PasswordManager  # noqa:PLC0415

        return PasswordManager().password_hash(value) if value else None


class ClientInfo(BaseModel):
    id: int
    name: str
    email: str
    cpf: str


class UserDetail(BaseModel):
    user_id: int
    name: str
    user_training_id: int | None = None
    user_diets_id: int | None = None


class UserInfo(BaseModel):
    id: int
    name: str
    user_profile: int
    email: str


class RankingPoints(BaseModel):
    id: int
    name: str
    points: int


class CreateUserPublication(BaseModel):
    content: str
    is_private: bool = False
    type_post: UserPost = UserPost.PROGRESS.value


class CreateUserPostSuggestion(BaseModel):
    content: str
    is_private: bool = False
    type_post: UserPost = UserPost.TIPS_SUGGESTIONS.value


class UpdateUserPublication(BaseModel):
    content: str | None = None
    image_urls: list[str] | None = None
    is_private: bool | None = None


class UserPublication(BaseModel):
    id: int
    user_id: int
    user_name: str
    content: str
    image_urls: list[str] | None = []
    create_date: datetime
