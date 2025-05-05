# -*- coding: utf-8 -*-
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import bindparam, delete, text

from app.core.db_model import Chat, ChatMessage, Participant
from app.schemas.chat import ChatId, ChatMessages, Chats, SendMessage, SugestionChat, ChatOtherUserName


class ChatService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_all_messages(
        self, user_id: int, chat_id: int
    ) -> list[ChatMessages]:
        query = text(
            """
            SELECT
                cm.id as chat_message,
                c.id AS chat_id,
                c.create_date,
                cm.content,
                cm.send_date,
                cm.image_urls,
                u_sender.name AS sender_name,
                u_other.name AS other_person_name
            FROM chats c
            JOIN chat_messages cm ON cm.chat_id = c.id
            JOIN users u_sender ON u_sender.id = cm.user_id
            JOIN participants p ON p.chat_id = c.id
            JOIN users u_other ON u_other.id = p.user_id
            WHERE 
                c.id = :chat_id
                AND EXISTS (
                    SELECT 1
                    FROM participants p_current
                    WHERE p_current.chat_id = c.id
                    AND p_current.user_id = :current_user_id
                )
                AND u_other.id != :current_user_id
                AND EXISTS (
                    SELECT 1
                    FROM user_relations ur
                    WHERE 
                        (ur.user_id = :current_user_id AND ur.professional_id = u_other.id)
                        OR 
                        (ur.professional_id = :current_user_id AND ur.user_id = u_other.id)
                )
            ORDER BY cm.send_date ASC
        """
        ).bindparams(
            bindparam("current_user_id", user_id), bindparam("chat_id", chat_id)
        )
        result = await self._session.execute(query)
        return [ChatMessages(**row._asdict()) for row in result.fetchall()]

    async def create_message(self, user_id: int, send_message: SendMessage) -> None:
        chat = await self._get_chat_by_id(send_message.chat_id)
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        message = ChatMessage(**send_message.model_dump(), user_id=user_id)
        self._session.add(message)
        await self._session.flush()
        await self._session.commit()

    async def get_chats_by_user(self, user_id: int) -> list[Chats]:
        query = text(
            """
            SELECT
                c.id AS chat_id,
                u_other.name AS other_person_name,
                u_other.image_profile,
                cm.user_id AS sender_id,
                cm.content AS last_message,
                cm.send_date
            FROM chats c
            JOIN participants p1
            ON p1.chat_id = c.id AND p1.user_id = :current_user_id
            JOIN participants p2
            ON p2.chat_id = c.id AND p2.user_id != :current_user_id
            JOIN users u_other ON u_other.id = p2.user_id
            LEFT JOIN chat_messages cm
                ON cm.chat_id = c.id
                AND cm.send_date = (
                    SELECT MAX(send_date)
                    FROM chat_messages
                    WHERE chat_id = c.id
                )
            ORDER BY cm.send_date DESC
        """
        ).bindparams(bindparam("current_user_id", user_id))
        result = await self._session.execute(query)
        return [Chats(**chat._asdict()) for chat in result.fetchall()]

    async def delete_chat(self, chat_id: int) -> None:
        await self._session.execute(delete(Chat).where(Chat.id == chat_id))
        await self._session.commit()

    async def create_chat(self, user_id: int, other_user_id: int) -> ChatId:
        chat = Chat()
        self._session.add(chat)
        await self._session.flush()
        await self._session.commit()
        participant_1 = Participant(user_id=user_id, chat_id=chat.id)
        participant_2 = Participant(user_id=other_user_id, chat_id=chat.id)
        self._session.add(participant_1)
        self._session.add(participant_2)
        await self._session.flush()
        await self._session.commit()
        return ChatId(chat_id=chat.id)

    async def _get_chat_by_id(self, chat_id: int) -> Chat | None:
        query = text(
            """
            SELECT * FROM chats WHERE id = :chat_id
        """
        ).bindparams(bindparam("chat_id", chat_id))
        result = await self._session.execute(query)
        return result.scalar_one_or_none()

    async def get_sugestions(self, user_id: int) -> list[SugestionChat]:
        query = text(
            """
            SELECT u.id AS user_id,
                u.name AS other_person_name,
                u.image_profile  as image_url
            FROM user_relations ur
            JOIN users u ON
                (u.id = ur.user_id AND ur.professional_id = :user_id)
                OR (u.id = ur.professional_id AND ur.user_id = :user_id)
            WHERE u.id NOT IN (
                SELECT p2.user_id
                FROM participants p1
                JOIN participants p2 ON p1.chat_id = p2.chat_id
                WHERE p1.user_id = :user_id AND p2.user_id != :user_id
            )
        """
        ).bindparams(bindparam("user_id", user_id))
        result = await self._session.execute(query)
        return [SugestionChat(**user._asdict()) for user in result.fetchall()]

    async def get_name_other_user(
        self, user_id: int, chat_id: int
    ) ->ChatOtherUserName :
        query = text(
            """
            SELECT u.name AS other_person_name
            FROM participants p
            JOIN users u ON u.id = p.user_id
            WHERE p.chat_id = :chat_id AND p.user_id != :user_id
        """
        ).bindparams(bindparam("user_id", user_id), bindparam("chat_id", chat_id))
        result = await self._session.execute(query)
        return ChatOtherUserName(other_user_name=result.scalar())