# -*- coding: utf-8 -*-
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import bindparam, delete, text, update

from app.core.db_model import HealthGold
from app.schemas.healthGold import CreateHealthGold, UpdateHealthGold
from app.schemas.user import UserInfo


class HealthGoldService:
    def __init__(self, session: AsyncSession, user: UserInfo) -> None:
        self._session = session
        self._user = user
        self._querys = HealthGoldQuerys(session)

    async def create_health_gold(self, form_data: CreateHealthGold) -> None:
        new_health_gold = HealthGold(**form_data.model_dump(), user_id=self._user.id)
        self._session.add(new_health_gold)
        await self._session.flush()
        await self._session.commit()

    async def update_health_gold(
        self, form_data: UpdateHealthGold, gold_id: int
    ) -> None:
        health_gold = await self._querys.get_health_gold_by_id(gold_id)
        if not health_gold:
            raise HTTPException(status_code=404, detail="Health Gold não encontrado")

        data_updated = {
            key: value
            for key, value in form_data.model_dump().items()
            if value is not None
        }

        if not data_updated:
            raise HTTPException(
                status_code=400, detail="Nenhum campo para atualizar"
            )

        await self._session.execute(
            update(HealthGold).where(HealthGold.id == gold_id).values(**data_updated)
        )
        await self._session.commit()

    async def delete_health_gold(self, gold_id: int) -> None:
        await self._session.execute(
            delete(HealthGold).where(HealthGold.id == gold_id)
        )
        await self._session.commit()

    async def get_health_gold_by_user(self) -> list[HealthGold]:
        health_gold = await self._querys.get_health_gold_by_user(self._user.id)
        if not health_gold:
            raise HTTPException(status_code=404, detail="Health Gold não encontrado")
        return health_gold

    async def get_health_gold_by_id(self, gold_id: int) -> HealthGold:
        health_gold = await self._querys.get_health_gold_by_id(gold_id)
        if not health_gold:
            raise HTTPException(status_code=404, detail="Health Gold não encontrado")
        return health_gold


class HealthGoldQuerys:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_health_gold_by_id(self, gold_id: int) -> HealthGold | None:
        query = text("""
            SELECT *
            FROM health_gold
            WHERE id = :gold_id
        """).bindparams(bindparam("gold_id", gold_id))
        result = await self._session.execute(query)
        health_gold = result.fetchone()
        if not health_gold:
            raise HTTPException(status_code=404, detail="Health Gold não encontrado")
        return HealthGold(**health_gold._asdict())

    async def get_health_gold_by_user(self, user_id: int) -> list[HealthGold]:
        query = text("""
            SELECT *
            FROM health_gold
            WHERE user_id = :user_id
        """).bindparams(bindparam("user_id", user_id))
        result = await self._session.execute(query)
        health_gold = result.fetchall()
        return [HealthGold(**gold._asdict()) for gold in health_gold]
