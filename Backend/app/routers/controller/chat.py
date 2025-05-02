# coding: utf-8

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.basic_response import BasicResponse
from app.schemas.chat import ChatId, ChatMessages, Chats, SendMessage, SugestionChat
from app.schemas.user import UserInfo
from app.service.chat import ChatService


class ChatController:
    def __init__(self, session: AsyncSession, user: UserInfo) -> None:
        self._session = session
        self._service = ChatService(session)
        self._user = user

    async def get_all_messages(
        self, chat_id: int
    ) -> BasicResponse[list[ChatMessages]]:
        try:
            return await self._service.get_all_messages(self._user.id, chat_id)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def create_message(self, send_message: SendMessage) -> BasicResponse[None]:
        try:
            return await self._service.create_message(self._user.id, send_message)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_chats_by_user(self) -> BasicResponse[list[Chats]]:
        try:
            chats = await self._service.get_chats_by_user(self._user.id)
            return BasicResponse(data=chats)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def delete_chat(self, chat_id: int) -> BasicResponse[None]:
        try:
            await self._service.delete_chat(self._user.id, chat_id)
            return BasicResponse(data=None)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def create_chat(self, other_user_id: int) -> BasicResponse[ChatId]:
        try:
            chat = await self._service.create_chat(self._user.id, other_user_id)
            return BasicResponse(
                data=chat,
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_sugestion_chat(self) -> BasicResponse[list[SugestionChat]]:
        try:
            sugestion = await self._service.get_sugestions(self._user.id)
            return BasicResponse(
                data=sugestion,
            )
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e
