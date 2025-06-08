# -*- coding: utf-8 -*-
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db_model import HealthGold
from app.modules.basic_response import BasicResponse
from app.schemas.healthGold import CreateHealthGold, UpdateHealthGold,HealthGoldSchema
from app.schemas.user import UserInfo
from app.service.healthGold import HealthGoldService


class HealthGoldController:
    def __init__(self, session: AsyncSession, user: UserInfo) -> None:
        self._session = session
        self._user = user
        self._querys = HealthGoldService(session, self._user)

    async def create_health_gold(
        self, form_data: CreateHealthGold
    ) -> BasicResponse[None]:
        try:
            await HealthGoldService(self._session, self._user).create_health_gold(
                form_data
            )
            return BasicResponse[None]()
        except HTTPException as e:
            raise e

    async def update_health_gold(
        self, form_data: UpdateHealthGold, gold_id: int
    ) -> BasicResponse[None]:
        try:
            await HealthGoldService(self._session, self._user).update_health_gold(
                form_data, gold_id
            )
            return BasicResponse[None]()
        except HTTPException as e:
            raise e

    async def delete_health_gold(self, gold_id: int) -> BasicResponse[None]:
        try:
            await HealthGoldService(self._session, self._user).delete_health_gold(
                gold_id
            )
            return BasicResponse[None]()
        except HTTPException as e:
            raise e

    async def get_health_gold_by_user(self) -> BasicResponse[list[HealthGoldSchema]]:
        try:
            health_gold = await HealthGoldService(
                self._session, self._user
            ).get_health_gold_by_user()
            return BasicResponse[list[HealthGoldSchema]](data=health_gold)
        except HTTPException as e:
            raise e

    async def get_health_gold_by_id(self, gold_id: int) -> BasicResponse[HealthGoldSchema | None]:
        try:
            health_gold = await HealthGoldService(
                self._session, self._user
            ).get_health_gold_by_id(gold_id)
            return BasicResponse[health_gold| None](data=health_gold)
        except HTTPException as e:
            raise e
