# -*- coding: utf-8 -*-
from datetime import datetime

from pydantic import BaseModel


class ChatMessages(BaseModel):
    chat_id: int
    create_date: datetime
    content: str
    send_date: datetime
    image_urls: list[str] | None = None
    sender_name: str
    other_person_name: str


class SendMessage(BaseModel):
    chat_id: int
    content: str
    image_urls: list[str] | None = None


class Chats(BaseModel):
    chat_id: int
    other_person_name: str
    image_profile: str | None = None
    sender_id: int | None = None
    last_message: str | None = None
    send_date: datetime | None = None


class SugestionChat(BaseModel):
    other_person_name: str
    user_id: int
    image_url: str | None = None


class ChatId(BaseModel):
    chat_id: int
