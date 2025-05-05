# -*- coding: utf-8 -*-

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependency.auth import AuthManager
from app.dependency.database import SessionConnection
from app.modules.basic_response import BasicResponse
from app.routers.controller.chat import ChatController
from app.schemas.chat import ChatId, ChatMessages, Chats, SendMessage, SugestionChat,ChatOtherUserName
from app.schemas.user import UserInfo

router_chat = APIRouter(prefix="/chat", tags=["chat"])

@router_chat.get("/sugestions")
async def get_sugestion_chat(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[list[SugestionChat]]:
    return await ChatController(session, user).get_sugestion_chat()


@router_chat.post("/")
async def create_message(
    send_message: SendMessage,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await ChatController(session, user).create_message(send_message)


@router_chat.get("/all-by-user")
async def get_chats_by_user(
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[list[Chats]]:
    return await ChatController(session, user).get_chats_by_user()


@router_chat.delete("/{chat_id}")
async def delete_chat(
    chat_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[None]:
    return await ChatController(session, user).delete_chat(chat_id)


@router_chat.post("/create/{other_user_id}")
async def create_chat(
    other_user_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[ChatId]:
    return await ChatController(session, user).create_chat(other_user_id)

@router_chat.get("/{chat_id}")
async def get_all_chats(
    chat_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[list[ChatMessages]]:
    return await ChatController(session, user).get_all_messages(chat_id)

@router_chat.get("/other-user-name/{chat_id}")
async def get_other_user_name(
    chat_id: int,
    session: AsyncSession = Depends(SessionConnection.session),
    user: UserInfo = Depends(AuthManager.has_authorization),
) -> BasicResponse[ChatOtherUserName]:
    return await ChatController(session, user).get_other_user_name(chat_id)