# -*- coding: utf-8 -*-
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.basic_response import BasicResponse
from app.schemas.diet import (
    AllExpiredDiets,
    AllFreeDietQuantity,
    AllFreeDiets,
    CreateDiet,
    DietData,
    DietsByProfissional,
    LastFinishedDiet,
    ListDietActual,
    UpdateDiet,
)
from app.schemas.user import UserInfo
from app.service.diets import DietService


class DietController:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session
        self._service = DietService(session)

    async def get_diet_actual(self, user_id: int) -> BasicResponse[list[DietData]]:
        try:
            diet = await self._service.get_diet_actual(user_id)
            return BasicResponse(data=diet)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_diet_actual_previous(
        self, user_id: int
    ) -> BasicResponse[list[ListDietActual]]:
        try:
            diet = await self._service.get_diet_actual_previous(user_id)
            return BasicResponse(data=diet)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_diet_by_id(self, diet_id: int) -> BasicResponse[list[DietData]]:
        try:
            diet = await self._service.get_diet_by_id(diet_id)
            return BasicResponse(data=diet)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_quantity_of_free_diets(self) -> BasicResponse[AllFreeDietQuantity]:
        try:
            quantity = await self._service.get_quantity_of_free_diets()
            print(quantity)
            return BasicResponse(data=quantity)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_all_expiring_diets(
        self, user: UserInfo
    ) -> BasicResponse[list[AllExpiredDiets]]:
        try:
            expiring_diets = await self._service.get_all_expiring_diets(user.id)
            return BasicResponse(data=expiring_diets)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_all_finished_diets(
        self, user: UserInfo
    ) -> BasicResponse[list[DietData]]:
        try:
            finished_diets = await self._service.get_all_finished_diets(user.id)
            return BasicResponse(data=finished_diets)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_name_last_diet(
        self, user: UserInfo
    ) -> BasicResponse[list[LastFinishedDiet]]:
        try:
            last_finished_diet = await self._service.get_name_last_diet(user.id)
            return BasicResponse(data=last_finished_diet)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def create_diet(
        self, diet: CreateDiet, user: UserInfo
    ) -> BasicResponse[None]:
        try:
            await self._service.create_diet(diet, user.id)
            return BasicResponse()
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def update_diet(
        self, diet_id: int, diet: UpdateDiet
    ) -> BasicResponse[None]:
        try:
            await self._service.update_diet(diet_id, diet)
            return BasicResponse()
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def delete_diet(self, diet_id: int) -> BasicResponse[None]:
        try:
            await self._service.delete_diet(diet_id)
            return BasicResponse()
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_diets_by_profissional(
        self, user: UserInfo
    ) -> BasicResponse[list[DietsByProfissional]]:
        try:
            diets = await self._service.get_diets_by_professional(user.id)
            return BasicResponse(data=diets)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e

    async def get_all_free_diets(self) -> BasicResponse[list[AllFreeDiets]]:
        try:
            diets = await self._service.get_all_free_diets()
            return BasicResponse(data=diets)
        except HTTPException as e:
            raise e
        except Exception as e:
            raise e
