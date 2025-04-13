# -*- coding: utf-8 -*-
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.engine import CursorResult
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import bindparam, delete, text, update

from app.core.db_model import User, UserRelations
from app.schemas.user import (
    ClientInfo,
    CreateUser,
    UpdateUser,
    UserDetail,
    UserInfo,
    UserLogin,
)


class UserService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session


    async def get_user_by_cpf(self, cpf: str) -> UserInfo | None:
        query = text(
            """SELECT
                id,
                email,
                user_profile,
                "name"
            FROM users
            WHERE cpf = :cpf
        """
        ).bindparams(bindparam("cpf", cpf))
        result: CursorResult = await self._session.execute(query)  # type: ignore[type-arg, assignment]
        user = result.fetchone()
        return UserInfo(**user._asdict()) if user else None

    async def get_user_by_email(self, email: str) -> UserLogin | None:
        query = text(
            """SELECT
                id,
                password
            FROM users
            WHERE email = :email"""
        ).bindparams(bindparam("email", email))
        result: CursorResult = await self._session.execute(query)  # type: ignore[type-arg, assignment]
        user = result.fetchone()
        return UserLogin(**user._asdict()) if user else None

    async def get_user_by_id(self, user_id: int) -> UserInfo | None:
        query = text(
            """SELECT
                id,
                email,
                user_profile,
                "name"
            FROM users
            WHERE id = :id
        """
        ).bindparams(bindparam("id", user_id))
        result: CursorResult = await self._session.execute(query)  # type: ignore[type-arg, assignment]
        user = result.fetchone()
        return UserInfo(**user._asdict()) if user else None

    async def get_user_by_cpf(self, cpf: str) -> UserInfo | None:
        query = text(
            """SELECT
                id,
                email,
                user_profile,
                "name"
            FROM users
            WHERE cpf = :cpf
        """
        ).bindparams(bindparam("cpf", cpf))
        result: CursorResult = await self._session.execute(query)  # type: ignore[type-arg, assignment]
        user = result.fetchone()
        return UserInfo(**user._asdict()) if user else None

    async def get_clients_for_professional(self, user_id: int) -> list[ClientInfo]:
        query = text(
            """select 
                    u.id,
                    u."name",
                    u.cpf,
                    u.email
                from users u
                join user_relations ur
                on ur.user_id = u.id
                where ur.professional_id = :professional_id
            """
        ).bindparams(bindparam("professional_id", user_id))
        result: CursorResult = await self._session.execute(query)
        clients = result.fetchall()
        return [ClientInfo(**client._asdict()) for client in clients]
    
    async def get_user_details(self, user_id: int) -> UserDetail:
        query = text(
            """SELECT
                    u.id AS user_id,
                    u."name",
                    ut.id AS user_training_id,
                    ud.id AS user_diets_id
                FROM users u 
                LEFT JOIN user_diets ud
                    ON u.id = ud.user_id
                    AND ud.is_completed = TRUE
                LEFT JOIN user_trainings ut
                    ON u.id = ut.user_id
                    AND ut.is_completed = TRUE
                WHERE u.id = :id
                ORDER BY ud.end_date DESC NULLS LAST, ut.end_date DESC NULLS LAST
"""
        ).bindparams(bindparam("id", user_id))
        result: CursorResult = await self._session.execute(query)
        user = result.fetchone()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserDetail(**user._asdict())

    async def associate_professional_with_client(
        self, user_id: int, professional_id: int
    ) -> None:
        await self._create_user_relation(user_id, professional_id)
    
    async def create_user(self, form_user: CreateUser) -> None:
        await self._validate_user_uniqueness(form_user)
        user = await self._create_user_record(form_user)
        if form_user.professional_id:
            await self._create_user_relation(user.id, form_user.professional_id)

    async def _create_user_record(self, form_user: CreateUser) -> User:
        user_data = form_user.model_dump(exclude={"professional_id"})
        user = User(**user_data)
        self._session.add(user)
        await self._session.flush()
        await self._session.commit()
        return user

    async def _create_user_relation(
        self, user_id: int, professional_id: int
    ) -> None:
        user_relation = UserRelations(
            user_id=user_id, professional_id=professional_id
        )
        self._session.add(user_relation)
        await self._session.flush()
        await self._session.commit()

    async def disable_user(self, user_id: int) -> None:
        await self._session.execute(
            update(User)
            .where(User.id == user_id)
            .values(is_active=False, last_update=datetime.now())
        )
        await self._session.commit()

    async def update_user(self, user_id: int, form_user: UpdateUser) -> None:
        user = await self.get_user_by_cpf(form_user.cpf) if form_user.cpf else None
        if user and user.id != user_id:
            raise HTTPException(status_code=400, detail="CPF already in use")
        update_data = {
            key: value
            for key, value in form_user.model_dump().items()
            if value is not None
        }
        await self._session.execute(
            update(User).where(User.id == user_id).values(**update_data)
        )
        await self._session.commit()

    async def delete_relation(self, user_id: int, professional_id: int) -> None:
        await self._session.execute(
            delete(UserRelations).where(
                UserRelations.user_id == user_id
                and UserRelations.professional_id == professional_id
            )
        )
        await self._session.commit()

    async def _validate_user_uniqueness(self, form_user: CreateUser) -> None:
        if await self.get_user_by_email(form_user.email):
            raise HTTPException(status_code=400, detail="Email already in use")
        if await self.get_user_by_cpf(form_user.cpf):
            raise HTTPException(status_code=400, detail="CPF already in use")
    
    
